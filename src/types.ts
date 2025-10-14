export interface ParsedInput {
  environment: string;
  commitSha: string;
  token: string;
  numberOfDeploymentsToCheck: number;
}

export interface QueryResponse {
  repository: {
    deployments: {
      nodes: DeploymentInfo[];
    };
  };
}

export interface DeploymentInfo {
  commitOid: string;
  state: string;
}