import {getInput, setOutput, info, error, setFailed} from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {DeploymentInfo, ParsedInput, QueryResponse} from './types'

async function run(): Promise<void> {
  try {
    const input = getParsedInput()
    const deployments = await getLatestDeployments(input)
    info(`Query Response: ${JSON.stringify(deployments)}`)
    const result = hasDeployment(input, deployments)
    // deprecated, to be removed
    setOutput('has_active_deployment', result)
    setOutput('has_deployment', result)
  } catch (err) {
    error(JSON.stringify(err))
    setFailed('Failed to check the deployments for environment')
  }
}

function getParsedInput(): ParsedInput {
  const environment = getInput('environment', {required: true})
  info(`Parsed Input [environment]: ${environment}`)
  const commitSha = getInput('commit_sha', {required: false}) || context.sha
  info(`Parsed Input [commitSha]: ${commitSha}`)
  const maxHistorySize = parseInt(getInput('max_history_size', {required: false})) || 2
  info(`Parsed Input [maxHistorySize]: ${commitSha}`)
  const isActiveDeployment = JSON.parse(getInput('is_active_deployment', {required: false})) || true
  info(`Parsed Input [isActiveDeployment]: ${isActiveDeployment}`)
  const token = getInput('github_token', {required: false}) || (process.env.GITHUB_TOKEN as string)

  return {
    environment,
    commitSha,
    token,
    maxHistorySize,
    isActiveDeployment,
  }
}

const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!, $maxHistorySize: Int!,) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: $maxHistorySize, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        commitOid
        state
      }
    }
  }
}
`

async function getLatestDeployments(input: ParsedInput): Promise<DeploymentInfo[]> {
  const octokit = getOctokit(input.token, {})
  const response = await octokit.graphql<QueryResponse>(query, {
    owner: context.repo.owner,
    name: context.repo.repo,
    environment: input.environment,
    maxHistorySize: input.maxHistorySize,
  })

  return response.repository.deployments.nodes
}

function hasDeployment(input: ParsedInput, deployments: DeploymentInfo[]): boolean {
  for (const deployment of deployments)
    if (deployment.commitOid === input.commitSha) {
      if (input.isActiveDeployment)
        return deployment.state === 'ACTIVE'

      return true
    }


  return false
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
