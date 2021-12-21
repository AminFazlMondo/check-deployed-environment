export interface ParsedInput {
    environment: string;
    commitSha: string;
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
    commitOid: string;
    state: string;
}
