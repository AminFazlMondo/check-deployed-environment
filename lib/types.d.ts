export interface ParsedInput {
    environment: string;
    commitId: string;
    token: string;
}
export interface QueryResponse {
    repository: {
        deployments: {
            nodes: DeploymentInfo[];
        };
    };
}
export interface DeploymentInfo {
    commit: {
        abbreviatedOid: string;
    };
    state: string;
}
