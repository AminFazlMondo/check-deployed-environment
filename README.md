# Check Deployed Environment GitHub action

This github action checks if a given commit is the active deployment on a given environment in GitHub

## Usage

Example of workflow

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - id: deployment-check
      uses: AminFazlMondo/check-deployed-environment
      with:
        environment: dev
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

    - if: ${{ steps.deployment-check.outputs.has_active_deployment == true }}
      run: echo "already deployed to the environment"
```