import { typescript, javascript, TextFile, YamlFile } from 'projen';

const nodeVersion = '20';
const authorName = 'Amin Fazl';
const majorVersion = 1;

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
  packageManager: javascript.NodePackageManager.PNPM,
  npmAccess: javascript.NpmAccess.PUBLIC,
  deps: [
    '@actions/core',
    '@actions/github',
  ],
  devDeps: [
    '@types/babel__core',
    '@vercel/ncc',
    '@types/node@^20',
    'jest@^29.7.0',
    'jest-junit@^16.0.0',
    'ts-jest@^29.2.5',
    '@types/jest@^29.5.14',
  ],
  workflowNodeVersion: nodeVersion,
  publishTasks: false,
  jest: true,
  jestOptions: {
    jestConfig: {
      preset: 'ts-jest',
      testEnvironment: 'node',
      coverageDirectory: 'coverage',
      coveragePathIgnorePatterns: ['/node_modules/'],
      testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      collectCoverage: true,
      coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
    },
  },
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
  releaseFailureIssue: true,
  minNodeVersion: '20.0.0',
});

project.postCompileTask.exec('ncc build --source-map --out action');

project.release?.publisher.addGitHubPostPublishingSteps({
  name: 'Moving tag',
  env: {
    GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    GITHUB_REPOSITORY: '${{ github.repository }}',
    GITHUB_REF: '${{ github.ref }}',
  },
  run: `gh release edit v${majorVersion} -R $GITHUB_REPOSITORY --target $GITHUB_REF`,
});

new TextFile(project, '.nvmrc', {
  lines: [nodeVersion],
});

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
      number_of_deployments_to_check: {
        description: 'The number of latest deployments to check (default is 5)',
        required: false,
        default: '5',
      },
    },
    outputs: {
      has_active_deployment: {
        description: 'True/False to represent if the commit has active deployment for the specified environment',
      },
      currently_deployed_commit: {
        description: 'The commit sha that is currently deployed to the specified environment',
      },
    },
    runs: {
      using: 'node20',
      main: 'action/index.js',
    },
  },
});

project.synth();