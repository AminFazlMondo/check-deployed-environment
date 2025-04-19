# Check Deployed Environment GitHub action

This github action checks if a given commit has been deployed to a given environment in GitHub.
Defaults to checking if sha is active (within the last two deployments)

## Usage

### Config

The action accepts the following inputs:

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `environment` | The environment name in GitHub | Yes | - |
| `github_token` | The GitHub token | No | Uses `GITHUB_TOKEN` env var |
| `commit_sha` | The commit SHA to check for deployment | No | Current commit SHA |
| `max_history_size` | How far back in deployment history to check | No | 2 |
| `is_active_deployment` | Whether SHA should be an active deployment | No | true |

The action provides the following outputs:

| Name | Description |
|------|-------------|
| `has_deployment` | True/False indicating if the commit has a deployment for the environment |
| `has_active_deployment` | DEPRECATED - please use `has_deployment` |

### Examples

Example of default workflow

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - id: deployment-check
      uses: AminFazlMondo/check-deployed-environment
      with:
        environment: dev

    - if: ${{ steps.deployment-check.outputs.has_deployment == true }}
      run: echo "actively deployed to the environment"
```

Example of fully configured workflow

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - id: deployment-check
      uses: AminFazlMondo/check-deployed-environment
      with:
        environment: dev
        commit_sha: v1.2.3 # defaults to current commit SHA if unset
        github_token: ${{ secrets.GITHUB_TOKEN }} # defaults to using environment variable `GITHUB_TOKEN` if unset
        is_active_deployment: false # defaults to `true` if unset
        max_history_size: 10 # default to `2` if unset
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # can use `github_token` input instead

    - if: ${{ steps.deployment-check.outputs.has_deployment == true }}
      run: echo "deployed to the environment"
```
