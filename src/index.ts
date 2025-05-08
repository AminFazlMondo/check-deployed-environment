import { getInput, setOutput, info, error, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { DeploymentInfo, ParsedInput, QueryResponse } from './types';

async function run(): Promise<void> {
  try {
    const input = getParsedInput();
    const deployments = await getLatestDeployments(input);
    info(`Query Response: ${JSON.stringify(deployments)}`);
    const result = hasActiveDeployment(input.commitSha, deployments);
    setOutput('has_active_deployment', result);
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

  return {
    environment,
    commitSha,
    token,
  };
}

const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: 2, orderBy: {field: CREATED_AT, direction: DESC}) {
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
  });

  return response.repository.deployments.nodes;
}

function hasActiveDeployment(commitSha: string, deployments: DeploymentInfo[]): boolean {
  if (deployments.length === 0) {return false;}

  const latest = deployments.shift();
  if (latest && latest.commitOid === commitSha && latest.state === 'ACTIVE') {return true;}

  const secondLast = deployments.shift();
  if (latest && secondLast) {
    return (
      latest.commitOid === commitSha &&
      secondLast.commitOid === commitSha &&
      latest.state === 'IN_PROGRESS' &&
      secondLast.state === 'ACTIVE');
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
