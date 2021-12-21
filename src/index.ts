import {getInput, setOutput} from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {DeploymentInfo, ParsedInput, QueryResponse} from './types'

async function run(): Promise<void> {
  const input = getParsedInput()
  const deployments = await getLatestDeployments(input)
  const result = hasActiveDeployment(input.commitId, deployments)
  setOutput('has_active_deployment', result)
}

function getParsedInput(): ParsedInput {
  const environment = getInput('environment', {required: true})
  const commitId = getInput('commit_id', {required: false}) || context.sha
  const token = getInput('github_token', {required: false}) || (process.env.GITHUB_TOKEN as string)

  return {
    environment,
    commitId,
    token,
  }
}

const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: 2, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        commit {
          abbreviatedOid
        }
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
  })

  return response.repository.deployments.nodes
}

function hasActiveDeployment(commitId: string, deployments: DeploymentInfo[]): boolean {
  if (deployments.length === 0)
    return false

  const latest = deployments.shift()
  if (latest && latest.commit.abbreviatedOid === commitId && latest.state === 'ACTIVE')
    return true

  const secondLast = deployments.shift()
  if (latest && secondLast)
    return (
      latest.commit.abbreviatedOid === commitId &&
      secondLast.commit.abbreviatedOid === commitId &&
      latest.state === 'IN_PROGRESS' &&
      secondLast.state === 'ACTIVE')

  return false
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run()
