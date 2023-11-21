"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const input = getParsedInput();
            const deployments = yield getLatestDeployments(input);
            (0, core_1.info)(`Query Response: ${JSON.stringify(deployments)}`);
            const result = hasActiveDeployment(input.commitSha, deployments);
            (0, core_1.setOutput)('has_active_deployment', result);
        }
        catch (err) {
            (0, core_1.error)(JSON.stringify(err));
            (0, core_1.setFailed)('Failed to check the deployments for environment');
        }
    });
}
function getParsedInput() {
    const environment = (0, core_1.getInput)('environment', { required: true });
    (0, core_1.info)(`Parsed Input [environment]: ${environment}`);
    const commitSha = (0, core_1.getInput)('commit_sha', { required: false }) || github_1.context.sha;
    (0, core_1.info)(`Parsed Input [commitSha]: ${commitSha}`);
    const token = (0, core_1.getInput)('github_token', { required: false }) || process.env.GITHUB_TOKEN;
    return {
        environment,
        commitSha,
        token,
    };
}
const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: 2, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        commitOid
        state
      }
    }
  }
}
`;
function getLatestDeployments(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = (0, github_1.getOctokit)(input.token, {});
        const response = yield octokit.graphql(query, {
            owner: github_1.context.repo.owner,
            name: github_1.context.repo.repo,
            environment: input.environment,
        });
        return response.repository.deployments.nodes;
    });
}
function hasActiveDeployment(commitSha, deployments) {
    if (deployments.length === 0)
        return false;
    const latest = deployments.shift();
    if (latest && latest.commitOid === commitSha && latest.state === 'ACTIVE')
        return true;
    const secondLast = deployments.shift();
    if (latest && secondLast)
        return (latest.commitOid === commitSha &&
            secondLast.commitOid === commitSha &&
            latest.state === 'IN_PROGRESS' &&
            secondLast.state === 'ACTIVE');
    return false;
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBeUU7QUFDekUsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUE7WUFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNyRCxJQUFBLFdBQUksRUFBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDdEQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUNoRSxJQUFBLGdCQUFTLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDNUMsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDMUIsSUFBQSxnQkFBUyxFQUFDLGlEQUFpRCxDQUFDLENBQUE7UUFDOUQsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELFNBQVMsY0FBYztJQUNyQixNQUFNLFdBQVcsR0FBRyxJQUFBLGVBQVEsRUFBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtJQUM3RCxJQUFBLFdBQUksRUFBQywrQkFBK0IsV0FBVyxFQUFFLENBQUMsQ0FBQTtJQUNsRCxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQVEsRUFBQyxZQUFZLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsSUFBSSxnQkFBTyxDQUFDLEdBQUcsQ0FBQTtJQUMxRSxJQUFBLFdBQUksRUFBQyw2QkFBNkIsU0FBUyxFQUFFLENBQUMsQ0FBQTtJQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQVEsRUFBQyxjQUFjLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsSUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQXVCLENBQUE7SUFFakcsT0FBTztRQUNMLFdBQVc7UUFDWCxTQUFTO1FBQ1QsS0FBSztLQUNOLENBQUE7QUFDSCxDQUFDO0FBRUQsTUFBTSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7O0NBV2IsQ0FBQTtBQUVELFNBQWUsb0JBQW9CLENBQUMsS0FBa0I7O1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1lBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUE7UUFFRixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQTtJQUM5QyxDQUFDO0NBQUE7QUFFRCxTQUFTLG1CQUFtQixDQUFDLFNBQWlCLEVBQUUsV0FBNkI7SUFDM0UsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDMUIsT0FBTyxLQUFLLENBQUE7SUFFZCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxRQUFRO1FBQ3ZFLE9BQU8sSUFBSSxDQUFBO0lBRWIsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3RDLElBQUksTUFBTSxJQUFJLFVBQVU7UUFDdEIsT0FBTyxDQUNMLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUztZQUM5QixVQUFVLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDbEMsTUFBTSxDQUFDLEtBQUssS0FBSyxhQUFhO1lBQzlCLFVBQVUsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7SUFFbEMsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLEdBQUcsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZXRJbnB1dCwgc2V0T3V0cHV0LCBpbmZvLCBlcnJvciwgc2V0RmFpbGVkfSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0IHtjb250ZXh0LCBnZXRPY3Rva2l0fSBmcm9tICdAYWN0aW9ucy9naXRodWInXG5pbXBvcnQge0RlcGxveW1lbnRJbmZvLCBQYXJzZWRJbnB1dCwgUXVlcnlSZXNwb25zZX0gZnJvbSAnLi90eXBlcydcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKVxuICAgIGNvbnN0IGRlcGxveW1lbnRzID0gYXdhaXQgZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQpXG4gICAgaW5mbyhgUXVlcnkgUmVzcG9uc2U6ICR7SlNPTi5zdHJpbmdpZnkoZGVwbG95bWVudHMpfWApXG4gICAgY29uc3QgcmVzdWx0ID0gaGFzQWN0aXZlRGVwbG95bWVudChpbnB1dC5jb21taXRTaGEsIGRlcGxveW1lbnRzKVxuICAgIHNldE91dHB1dCgnaGFzX2FjdGl2ZV9kZXBsb3ltZW50JywgcmVzdWx0KVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKVxuICAgIHNldEZhaWxlZCgnRmFpbGVkIHRvIGNoZWNrIHRoZSBkZXBsb3ltZW50cyBmb3IgZW52aXJvbm1lbnQnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFBhcnNlZElucHV0KCk6IFBhcnNlZElucHV0IHtcbiAgY29uc3QgZW52aXJvbm1lbnQgPSBnZXRJbnB1dCgnZW52aXJvbm1lbnQnLCB7cmVxdWlyZWQ6IHRydWV9KVxuICBpbmZvKGBQYXJzZWQgSW5wdXQgW2Vudmlyb25tZW50XTogJHtlbnZpcm9ubWVudH1gKVxuICBjb25zdCBjb21taXRTaGEgPSBnZXRJbnB1dCgnY29tbWl0X3NoYScsIHtyZXF1aXJlZDogZmFsc2V9KSB8fCBjb250ZXh0LnNoYVxuICBpbmZvKGBQYXJzZWQgSW5wdXQgW2NvbW1pdFNoYV06ICR7Y29tbWl0U2hhfWApXG4gIGNvbnN0IHRva2VuID0gZ2V0SW5wdXQoJ2dpdGh1Yl90b2tlbicsIHtyZXF1aXJlZDogZmFsc2V9KSB8fCAocHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOIGFzIHN0cmluZylcblxuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50LFxuICAgIGNvbW1pdFNoYSxcbiAgICB0b2tlbixcbiAgfVxufVxuXG5jb25zdCBxdWVyeSA9IGBcbnF1ZXJ5IGRlcGxveURldGFpbHMoJG93bmVyOiBTdHJpbmchLCAkbmFtZTogU3RyaW5nISwgJGVudmlyb25tZW50OiBTdHJpbmchKSB7XG4gIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJG5hbWUpIHtcbiAgICBkZXBsb3ltZW50cyhlbnZpcm9ubWVudHM6IFskZW52aXJvbm1lbnRdLCBmaXJzdDogMiwgb3JkZXJCeToge2ZpZWxkOiBDUkVBVEVEX0FULCBkaXJlY3Rpb246IERFU0N9KSB7XG4gICAgICBub2RlcyB7XG4gICAgICAgIGNvbW1pdE9pZFxuICAgICAgICBzdGF0ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuYFxuXG5hc3luYyBmdW5jdGlvbiBnZXRMYXRlc3REZXBsb3ltZW50cyhpbnB1dDogUGFyc2VkSW5wdXQpOiBQcm9taXNlPERlcGxveW1lbnRJbmZvW10+IHtcbiAgY29uc3Qgb2N0b2tpdCA9IGdldE9jdG9raXQoaW5wdXQudG9rZW4sIHt9KVxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG9jdG9raXQuZ3JhcGhxbDxRdWVyeVJlc3BvbnNlPihxdWVyeSwge1xuICAgIG93bmVyOiBjb250ZXh0LnJlcG8ub3duZXIsXG4gICAgbmFtZTogY29udGV4dC5yZXBvLnJlcG8sXG4gICAgZW52aXJvbm1lbnQ6IGlucHV0LmVudmlyb25tZW50LFxuICB9KVxuXG4gIHJldHVybiByZXNwb25zZS5yZXBvc2l0b3J5LmRlcGxveW1lbnRzLm5vZGVzXG59XG5cbmZ1bmN0aW9uIGhhc0FjdGl2ZURlcGxveW1lbnQoY29tbWl0U2hhOiBzdHJpbmcsIGRlcGxveW1lbnRzOiBEZXBsb3ltZW50SW5mb1tdKTogYm9vbGVhbiB7XG4gIGlmIChkZXBsb3ltZW50cy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3QgbGF0ZXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKVxuICBpZiAobGF0ZXN0ICYmIGxhdGVzdC5jb21taXRPaWQgPT09IGNvbW1pdFNoYSAmJiBsYXRlc3Quc3RhdGUgPT09ICdBQ1RJVkUnKVxuICAgIHJldHVybiB0cnVlXG5cbiAgY29uc3Qgc2Vjb25kTGFzdCA9IGRlcGxveW1lbnRzLnNoaWZ0KClcbiAgaWYgKGxhdGVzdCAmJiBzZWNvbmRMYXN0KVxuICAgIHJldHVybiAoXG4gICAgICBsYXRlc3QuY29tbWl0T2lkID09PSBjb21taXRTaGEgJiZcbiAgICAgIHNlY29uZExhc3QuY29tbWl0T2lkID09PSBjb21taXRTaGEgJiZcbiAgICAgIGxhdGVzdC5zdGF0ZSA9PT0gJ0lOX1BST0dSRVNTJyAmJlxuICAgICAgc2Vjb25kTGFzdC5zdGF0ZSA9PT0gJ0FDVElWRScpXG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbnJ1bigpXG4iXX0=