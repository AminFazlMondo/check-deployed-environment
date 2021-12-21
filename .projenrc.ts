import {typescript, javascript, TextFile} from 'projen'

const nodeVersion = '14.18.1'

const project = new typescript.TypeScriptProject({
  name: 'check-deployed-environment',
  projenrcTs: true,
  authorName: 'Amin Fazl',
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
  ],
  peerDeps: [
  ],
  devDeps: [
  ],
  workflowNodeVersion: nodeVersion,
  depsUpgradeOptions: {
    ignoreProjen: false,
  },
  publishTasks: true,
})

new TextFile(project, '.nvmrc', {
  lines: [nodeVersion],
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