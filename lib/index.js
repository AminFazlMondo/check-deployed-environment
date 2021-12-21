"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
async function run() {
    const input = getParsedInput();
    const deployments = await getLatestDeployments(input);
    const result = hasActiveDeployment(input.commitId, deployments);
    (0, core_1.setOutput)('has_active_deployment', result);
}
function getParsedInput() {
    const environment = (0, core_1.getInput)('environment', { required: true });
    const commitId = (0, core_1.getInput)('commit_id', { required: false }) || github_1.context.sha;
    const token = (0, core_1.getInput)('github_token', { required: false }) || process.env.GITHUB_TOKEN;
    return {
        environment,
        commitId,
        token,
    };
}
const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: 2, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        commit {
          abbreviatedOid
        }
        state
      }
    }
  }
}
`;
async function getLatestDeployments(input) {
    const octokit = (0, github_1.getOctokit)(input.token, {});
    const response = await octokit.graphql(query, {
        owner: github_1.context.repo.owner,
        name: github_1.context.repo.repo,
    });
    return response.repository.deployments.nodes;
}
function hasActiveDeployment(commitId, deployments) {
    if (deployments.length === 0)
        return false;
    const latest = deployments.shift();
    if (latest && latest.commit.abbreviatedOid === commitId && latest.state === 'ACTIVE')
        return true;
    const secondLast = deployments.shift();
    if (latest && secondLast)
        return (latest.commit.abbreviatedOid === commitId &&
            secondLast.commit.abbreviatedOid === commitId &&
            latest.state === 'IN_PROGRESS' &&
            secondLast.state === 'ACTIVE');
    return false;
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3Q0FBaUQ7QUFDakQsNENBQW1EO0FBR25ELEtBQUssVUFBVSxHQUFHO0lBQ2hCLE1BQU0sS0FBSyxHQUFHLGNBQWMsRUFBRSxDQUFBO0lBQzlCLE1BQU0sV0FBVyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDckQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUMvRCxJQUFBLGdCQUFTLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDNUMsQ0FBQztBQUVELFNBQVMsY0FBYztJQUNyQixNQUFNLFdBQVcsR0FBRyxJQUFBLGVBQVEsRUFBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtJQUM3RCxNQUFNLFFBQVEsR0FBRyxJQUFBLGVBQVEsRUFBQyxXQUFXLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsSUFBSSxnQkFBTyxDQUFDLEdBQUcsQ0FBQTtJQUN4RSxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQVEsRUFBQyxjQUFjLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsSUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQXVCLENBQUE7SUFFakcsT0FBTztRQUNMLFdBQVc7UUFDWCxRQUFRO1FBQ1IsS0FBSztLQUNOLENBQUE7QUFDSCxDQUFDO0FBRUQsTUFBTSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7Ozs7Q0FhYixDQUFBO0FBRUQsS0FBSyxVQUFVLG9CQUFvQixDQUFDLEtBQWtCO0lBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1FBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1FBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO0tBQ3hCLENBQUMsQ0FBQTtJQUVGLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFBO0FBQzlDLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsV0FBNkI7SUFDMUUsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDMUIsT0FBTyxLQUFLLENBQUE7SUFFZCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUTtRQUNsRixPQUFPLElBQUksQ0FBQTtJQUViLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN0QyxJQUFJLE1BQU0sSUFBSSxVQUFVO1FBQ3RCLE9BQU8sQ0FDTCxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxRQUFRO1lBQ3pDLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVE7WUFDN0MsTUFBTSxDQUFDLEtBQUssS0FBSyxhQUFhO1lBQzlCLFVBQVUsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7SUFFbEMsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLEdBQUcsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZXRJbnB1dCwgc2V0T3V0cHV0fSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0IHtjb250ZXh0LCBnZXRPY3Rva2l0fSBmcm9tICdAYWN0aW9ucy9naXRodWInXG5pbXBvcnQge0RlcGxveW1lbnRJbmZvLCBQYXJzZWRJbnB1dCwgUXVlcnlSZXNwb25zZX0gZnJvbSAnLi90eXBlcydcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBpbnB1dCA9IGdldFBhcnNlZElucHV0KClcbiAgY29uc3QgZGVwbG95bWVudHMgPSBhd2FpdCBnZXRMYXRlc3REZXBsb3ltZW50cyhpbnB1dClcbiAgY29uc3QgcmVzdWx0ID0gaGFzQWN0aXZlRGVwbG95bWVudChpbnB1dC5jb21taXRJZCwgZGVwbG95bWVudHMpXG4gIHNldE91dHB1dCgnaGFzX2FjdGl2ZV9kZXBsb3ltZW50JywgcmVzdWx0KVxufVxuXG5mdW5jdGlvbiBnZXRQYXJzZWRJbnB1dCgpOiBQYXJzZWRJbnB1dCB7XG4gIGNvbnN0IGVudmlyb25tZW50ID0gZ2V0SW5wdXQoJ2Vudmlyb25tZW50Jywge3JlcXVpcmVkOiB0cnVlfSlcbiAgY29uc3QgY29tbWl0SWQgPSBnZXRJbnB1dCgnY29tbWl0X2lkJywge3JlcXVpcmVkOiBmYWxzZX0pIHx8IGNvbnRleHQuc2hhXG4gIGNvbnN0IHRva2VuID0gZ2V0SW5wdXQoJ2dpdGh1Yl90b2tlbicsIHtyZXF1aXJlZDogZmFsc2V9KSB8fCAocHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOIGFzIHN0cmluZylcblxuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50LFxuICAgIGNvbW1pdElkLFxuICAgIHRva2VuLFxuICB9XG59XG5cbmNvbnN0IHF1ZXJ5ID0gYFxucXVlcnkgZGVwbG95RGV0YWlscygkb3duZXI6IFN0cmluZyEsICRuYW1lOiBTdHJpbmchLCAkZW52aXJvbm1lbnQ6IFN0cmluZyEpIHtcbiAgcmVwb3NpdG9yeShvd25lcjogJG93bmVyLCBuYW1lOiAkbmFtZSkge1xuICAgIGRlcGxveW1lbnRzKGVudmlyb25tZW50czogWyRlbnZpcm9ubWVudF0sIGZpcnN0OiAyLCBvcmRlckJ5OiB7ZmllbGQ6IENSRUFURURfQVQsIGRpcmVjdGlvbjogREVTQ30pIHtcbiAgICAgIG5vZGVzIHtcbiAgICAgICAgY29tbWl0IHtcbiAgICAgICAgICBhYmJyZXZpYXRlZE9pZFxuICAgICAgICB9XG4gICAgICAgIHN0YXRlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5gXG5cbmFzeW5jIGZ1bmN0aW9uIGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0OiBQYXJzZWRJbnB1dCk6IFByb21pc2U8RGVwbG95bWVudEluZm9bXT4ge1xuICBjb25zdCBvY3Rva2l0ID0gZ2V0T2N0b2tpdChpbnB1dC50b2tlbiwge30pXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb2N0b2tpdC5ncmFwaHFsPFF1ZXJ5UmVzcG9uc2U+KHF1ZXJ5LCB7XG4gICAgb3duZXI6IGNvbnRleHQucmVwby5vd25lcixcbiAgICBuYW1lOiBjb250ZXh0LnJlcG8ucmVwbyxcbiAgfSlcblxuICByZXR1cm4gcmVzcG9uc2UucmVwb3NpdG9yeS5kZXBsb3ltZW50cy5ub2Rlc1xufVxuXG5mdW5jdGlvbiBoYXNBY3RpdmVEZXBsb3ltZW50KGNvbW1pdElkOiBzdHJpbmcsIGRlcGxveW1lbnRzOiBEZXBsb3ltZW50SW5mb1tdKTogYm9vbGVhbiB7XG4gIGlmIChkZXBsb3ltZW50cy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3QgbGF0ZXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKVxuICBpZiAobGF0ZXN0ICYmIGxhdGVzdC5jb21taXQuYWJicmV2aWF0ZWRPaWQgPT09IGNvbW1pdElkICYmIGxhdGVzdC5zdGF0ZSA9PT0gJ0FDVElWRScpXG4gICAgcmV0dXJuIHRydWVcblxuICBjb25zdCBzZWNvbmRMYXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKVxuICBpZiAobGF0ZXN0ICYmIHNlY29uZExhc3QpXG4gICAgcmV0dXJuIChcbiAgICAgIGxhdGVzdC5jb21taXQuYWJicmV2aWF0ZWRPaWQgPT09IGNvbW1pdElkICYmXG4gICAgICBzZWNvbmRMYXN0LmNvbW1pdC5hYmJyZXZpYXRlZE9pZCA9PT0gY29tbWl0SWQgJiZcbiAgICAgIGxhdGVzdC5zdGF0ZSA9PT0gJ0lOX1BST0dSRVNTJyAmJlxuICAgICAgc2Vjb25kTGFzdC5zdGF0ZSA9PT0gJ0FDVElWRScpXG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbnJ1bigpXG4iXX0=