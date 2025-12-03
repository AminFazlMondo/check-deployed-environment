import { DeploymentInfo } from '../src/types';

describe('GitHub Action - Check Deployed Environment', () => {
  describe('hasActiveDeployment logic', () => {
    it('should return false when deployments array is empty', () => {
      const deployments: DeploymentInfo[] = [];
      const commitSha = 'abc123';

      const result = hasActiveDeployment(commitSha, deployments);

      expect(result).toBe(false);
    });

    it('should return true when latest deployment is ACTIVE and matches commitSha', () => {
      const commitSha = 'abc123';
      const deployments: DeploymentInfo[] = [
        { commitOid: 'abc123', state: 'ACTIVE' },
      ];

      const result = hasActiveDeployment(commitSha, deployments);

      expect(result).toBe(true);
    });

    it('should return false when latest deployment is ACTIVE but does not match commitSha', () => {
      const commitSha = 'abc123';
      const deployments: DeploymentInfo[] = [
        { commitOid: 'def456', state: 'ACTIVE' },
      ];

      const result = hasActiveDeployment(commitSha, deployments);

      expect(result).toBe(false);
    });

    it('should return true when both latest and second latest deployments match commitSha and states are IN_PROGRESS and ACTIVE', () => {
      const commitSha = 'abc123';
      const deployments: DeploymentInfo[] = [
        { commitOid: 'abc123', state: 'IN_PROGRESS' },
        { commitOid: 'abc123', state: 'ACTIVE' },
      ];

      const result = hasActiveDeployment(commitSha, deployments);

      expect(result).toBe(true);
    });

    it('should return false when deployments do not match the expected patterns', () => {
      const commitSha = 'abc123';
      const deployments: DeploymentInfo[] = [
        { commitOid: 'abc123', state: 'PENDING' },
      ];

      const result = hasActiveDeployment(commitSha, deployments);

      expect(result).toBe(false);
    });
  });

  describe('getCurrentlyDeployedCommit logic', () => {
    it('should return empty string when no ACTIVE deployment exists', () => {
      const deployments: DeploymentInfo[] = [
        { commitOid: 'abc123', state: 'IN_PROGRESS' },
        { commitOid: 'def456', state: 'PENDING' },
      ];

      const result = getCurrentlyDeployedCommit(deployments);

      expect(result).toBe('');
    });

    it('should return commitOid of the ACTIVE deployment', () => {
      const deployments: DeploymentInfo[] = [
        { commitOid: 'abc123', state: 'IN_PROGRESS' },
        { commitOid: 'def456', state: 'ACTIVE' },
        { commitOid: 'ghi789', state: 'INACTIVE' },
      ];

      const result = getCurrentlyDeployedCommit(deployments);

      expect(result).toBe('def456');
    });
  });
});

// Helper functions extracted from src/index.ts for testing
function hasActiveDeployment(commitSha: string, deployments: DeploymentInfo[]): boolean {
  if (deployments.length === 0) {return false;}

  const latest = deployments[0];
  if (latest && latest.commitOid === commitSha && latest.state === 'ACTIVE') {return true;}

  const secondLast = deployments[1];
  if (latest && secondLast) {
    return (
      latest.commitOid === commitSha &&
      secondLast.commitOid === commitSha &&
      latest.state === 'IN_PROGRESS' &&
      secondLast.state === 'ACTIVE');
  }

  return false;
}

function getCurrentlyDeployedCommit(deployments: DeploymentInfo[]): string {
  const activeDeployment = deployments.find((d) => d.state === 'ACTIVE');
  return activeDeployment ? activeDeployment.commitOid : '';
}
