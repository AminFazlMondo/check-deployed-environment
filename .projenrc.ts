import {typescript, javascript, TextFile, YamlFile} from 'projen'

const nodeVersion = '16'
const authorName = 'Amin Fazl'
const majorVersion = 1

const project = new typescript.TypeScriptProject({
  name: 'check-deployed-environment',
  projenrcTs: true,
  authorName,
  authorEmail: 'amin.fazl@mondo.com.au',
  defaultReleaseBranch: 'main',
  description: 'A GitHub action to check if a release has been already deployed to an environment or not',
  keywords: [
    'projen',
    'Typescript',
    'GitHub',
    'Action',
    'Deploy',
    'Environment',
  ],
  repository: 'https://github.com/AminFazlMondo/check-deployed-environment.git',
  packageManager: javascript.NodePackageManager.NPM,
  npmAccess: javascript.NpmAccess.PUBLIC,
  deps: [
    '@actions/core',
    '@actions/github',
  ],
  devDeps: [
    '@types/babel__core',
    '@vercel/ncc',
  ],
  workflowNodeVersion: nodeVersion,
  publishTasks: false,
  jest: false,
  sampleCode: false,
  tsconfig: {
    compilerOptions: {
      target: 'es6',
    },
  },
  majorVersion,
  autoApproveOptions: {
    allowedUsernames: ['AminFazlMondo'],
  },
  autoApproveUpgrades: true,
})

project.postCompileTask.exec('ncc build --source-map --out action')

project.release?.publisher.addGitHubPostPublishingSteps({
  name: 'Moving tag',
  env: {
    GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    GITHUB_REPOSITORY: '${{ github.repository }}',
    GITHUB_REF: '${{ github.ref }}',
  },
  run: `gh release edit v${majorVersion} -R $GITHUB_REPOSITORY --target $GITHUB_REF`,
})

new TextFile(project, '.nvmrc', {
  lines: [nodeVersion],
})

new YamlFile(project, 'action.yml', {
  obj: {
    name: 'Has Active Deployment for Environment',
    description: 'checks whether the commit Id is the active deployment on the specified environment',
    author: authorName,
    branding: {
      icon: 'package',
      color: 'blue',
    },
    inputs: {
      environment: {
        description: 'The environment name in GitHub',
        required: true,
      },
      github_token: {
        description: 'The GitHub token (if not provided, the environment variable GITHUB_TOKEN will be used instead)',
        required: false,
      },
      commit_sha: {
        description: 'The commit sha to check and see if it is active (if not provided, the current commit id will be used)',
        required: false,
      },
    },
    outputs: {
      has_active_deployment: {
        description: 'True/False to represent if the commit has active deployment for the specified environment',
      },
    },
    runs: {
      using: 'node16',
      main: 'action/index.js',
    },
  },
})

project.eslint?.addRules({
  'curly': [
    'error',
    'multi',
    'consistent',
  ],
  'semi': [
    'error',
    'never',
  ],
  'object-curly-spacing': 'error',
  'nonblock-statement-body-position': ['error', 'below'],
})

project.synth()