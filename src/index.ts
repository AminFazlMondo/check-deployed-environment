import { getInput, setOutput, info, error, setFailed, debug, exportVariable } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { DeploymentInfo, ParsedInput, QueryResponse } from './types';

async function run(): Promise<void> {
  try {
    const input = getParsedInput();
    const deployments = await getLatestDeployments(input);
    debug(`Query Response: ${JSON.stringify(deployments)}`);
    const result = hasActiveDeployment(input.commitSha, deployments);
    setOutput('has_active_deployment', result);
    debug(`Has Active Deployment: ${result}`);
    exportVariable('HAS_ACTIVE_DEPLOYMENT', result);

    const currentlyDeployedCommit = getCurrentlyDeployedCommit(deployments);
    setOutput('currently_deployed_commit', currentlyDeployedCommit);
    debug(`Currently Deployed Commit: ${currentlyDeployedCommit}`);
    exportVariable('CURRENTLY_DEPLOYED_COMMIT', currentlyDeployedCommit);
  } catch (err) {
    error(JSON.stringify(err));
    setFailed('Failed to check the deployments for environment');
  }
}

function getParsedInput(): ParsedInput {
  const environment = getInput('environment', { required: true });
  info(`Parsed Input [environment]: ${environment}`);
  const commitSha = getInput('commit_sha', { required: false }) || context.sha;
  info(`Parsed Input [commitSha]: ${commitSha}`);
  const token = getInput('github_token', { required: false }) || (process.env.GITHUB_TOKEN as string);
  const numberOfDeploymentsToCheck = getNumberInput('number_of_deployments_to_check') || 5;
  info(`Parsed Input [numberOfDeploymentsToCheck]: ${numberOfDeploymentsToCheck}`);

  return {
    environment,
    commitSha,
    token,
    numberOfDeploymentsToCheck,
  };
}

function getNumberInput(name: string): number | undefined {
  const value = getInput(name, { required: false });
  const parsed = parseInt(value);

  return isNaN(parsed) ? undefined : parsed;
}

const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!, $numberOfDeploymentsToCheck: Int!) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: $numberOfDeploymentsToCheck, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        commitOid
        state
      }
    }
  }
}
`;

async function getLatestDeployments(input: ParsedInput): Promise<DeploymentInfo[]> {
  const octokit = getOctokit(input.token, {});
  const response = await octokit.graphql<QueryResponse>(query, {
    owner: context.repo.owner,
    name: context.repo.repo,
    environment: input.environment,
    numberOfDeploymentsToCheck: input.numberOfDeploymentsToCheck,
  });

  return response.repository.deployments.nodes;
}

function hasActiveDeployment(commitSha: string, deployments: DeploymentInfo[]): boolean {
  if (deployments.length === 0) {return false;}

  const latest = deployments[0];
  if (latest && latest.commitOid === commitSha && latest.state === 'ACTIVE') {return true;}

  const secondLast = deployments[1];
  if (latest && secondLast) {
    return (
      latest.commitOid === commitSha &&
      secondLast.commitOid === commitSha &&
      latest.state === 'IN_PROGRESS' &&
      secondLast.state === 'ACTIVE');
  }

  return false;
}

function getCurrentlyDeployedCommit(deployments: DeploymentInfo[]): string {
  const activeDeployment = deployments.find((d) => d.state === 'ACTIVE');
  return activeDeployment ? activeDeployment.commitOid : '';
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
