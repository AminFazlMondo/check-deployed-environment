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

## Development

This project uses [pnpm](https://pnpm.io/) as the package manager and requires Node.js 20 or higher.

### Setup

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm run test
```