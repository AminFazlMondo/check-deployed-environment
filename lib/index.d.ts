import { DeploymentInfo } from './types';
export declare function hasActiveDeployment(commitSha: string, deployments: DeploymentInfo[]): boolean;
export declare function getCurrentlyDeployedCommit(deployments: DeploymentInfo[]): string;
