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
            const result = hasActiveDeployment(input.commitId, deployments);
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
    const commitId = (0, core_1.getInput)('commit_id', { required: false }) || github_1.context.ref;
    (0, core_1.info)(`Parsed Input [commitId]: ${commitId}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBeUU7QUFDekUsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLGNBQWMsRUFBRSxDQUFBO1lBQzlCLE1BQU0sV0FBVyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDckQsSUFBQSxXQUFJLEVBQUMsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3RELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDL0QsSUFBQSxnQkFBUyxFQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQzNDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDMUIsSUFBQSxnQkFBUyxFQUFDLGlEQUFpRCxDQUFDLENBQUE7U0FDN0Q7SUFDSCxDQUFDO0NBQUE7QUFFRCxTQUFTLGNBQWM7SUFDckIsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFRLEVBQUMsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7SUFDN0QsSUFBQSxXQUFJLEVBQUMsK0JBQStCLFdBQVcsRUFBRSxDQUFDLENBQUE7SUFDbEQsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFRLEVBQUMsV0FBVyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUksZ0JBQU8sQ0FBQyxHQUFHLENBQUE7SUFDeEUsSUFBQSxXQUFJLEVBQUMsNEJBQTRCLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFDNUMsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsY0FBYyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUF1QixDQUFBO0lBRWpHLE9BQU87UUFDTCxXQUFXO1FBQ1gsUUFBUTtRQUNSLEtBQUs7S0FDTixDQUFBO0FBQ0gsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFHOzs7Ozs7Ozs7Ozs7O0NBYWIsQ0FBQTtBQUVELFNBQWUsb0JBQW9CLENBQUMsS0FBa0I7O1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1lBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUE7UUFFRixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQTtJQUM5QyxDQUFDO0NBQUE7QUFFRCxTQUFTLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsV0FBNkI7SUFDMUUsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDMUIsT0FBTyxLQUFLLENBQUE7SUFFZCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUTtRQUNsRixPQUFPLElBQUksQ0FBQTtJQUViLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN0QyxJQUFJLE1BQU0sSUFBSSxVQUFVO1FBQ3RCLE9BQU8sQ0FDTCxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxRQUFRO1lBQ3pDLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVE7WUFDN0MsTUFBTSxDQUFDLEtBQUssS0FBSyxhQUFhO1lBQzlCLFVBQVUsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7SUFFbEMsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLEdBQUcsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZXRJbnB1dCwgc2V0T3V0cHV0LCBpbmZvLCBlcnJvciwgc2V0RmFpbGVkfSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0IHtjb250ZXh0LCBnZXRPY3Rva2l0fSBmcm9tICdAYWN0aW9ucy9naXRodWInXG5pbXBvcnQge0RlcGxveW1lbnRJbmZvLCBQYXJzZWRJbnB1dCwgUXVlcnlSZXNwb25zZX0gZnJvbSAnLi90eXBlcydcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKVxuICAgIGNvbnN0IGRlcGxveW1lbnRzID0gYXdhaXQgZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQpXG4gICAgaW5mbyhgUXVlcnkgUmVzcG9uc2U6ICR7SlNPTi5zdHJpbmdpZnkoZGVwbG95bWVudHMpfWApXG4gICAgY29uc3QgcmVzdWx0ID0gaGFzQWN0aXZlRGVwbG95bWVudChpbnB1dC5jb21taXRJZCwgZGVwbG95bWVudHMpXG4gICAgc2V0T3V0cHV0KCdoYXNfYWN0aXZlX2RlcGxveW1lbnQnLCByZXN1bHQpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG4gICAgc2V0RmFpbGVkKCdGYWlsZWQgdG8gY2hlY2sgdGhlIGRlcGxveW1lbnRzIGZvciBlbnZpcm9ubWVudCcpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2VkSW5wdXQoKTogUGFyc2VkSW5wdXQge1xuICBjb25zdCBlbnZpcm9ubWVudCA9IGdldElucHV0KCdlbnZpcm9ubWVudCcsIHtyZXF1aXJlZDogdHJ1ZX0pXG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbZW52aXJvbm1lbnRdOiAke2Vudmlyb25tZW50fWApXG4gIGNvbnN0IGNvbW1pdElkID0gZ2V0SW5wdXQoJ2NvbW1pdF9pZCcsIHtyZXF1aXJlZDogZmFsc2V9KSB8fCBjb250ZXh0LnJlZlxuICBpbmZvKGBQYXJzZWQgSW5wdXQgW2NvbW1pdElkXTogJHtjb21taXRJZH1gKVxuICBjb25zdCB0b2tlbiA9IGdldElucHV0KCdnaXRodWJfdG9rZW4nLCB7cmVxdWlyZWQ6IGZhbHNlfSkgfHwgKHByb2Nlc3MuZW52LkdJVEhVQl9UT0tFTiBhcyBzdHJpbmcpXG5cbiAgcmV0dXJuIHtcbiAgICBlbnZpcm9ubWVudCxcbiAgICBjb21taXRJZCxcbiAgICB0b2tlbixcbiAgfVxufVxuXG5jb25zdCBxdWVyeSA9IGBcbnF1ZXJ5IGRlcGxveURldGFpbHMoJG93bmVyOiBTdHJpbmchLCAkbmFtZTogU3RyaW5nISwgJGVudmlyb25tZW50OiBTdHJpbmchKSB7XG4gIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJG5hbWUpIHtcbiAgICBkZXBsb3ltZW50cyhlbnZpcm9ubWVudHM6IFskZW52aXJvbm1lbnRdLCBmaXJzdDogMiwgb3JkZXJCeToge2ZpZWxkOiBDUkVBVEVEX0FULCBkaXJlY3Rpb246IERFU0N9KSB7XG4gICAgICBub2RlcyB7XG4gICAgICAgIGNvbW1pdCB7XG4gICAgICAgICAgYWJicmV2aWF0ZWRPaWRcbiAgICAgICAgfVxuICAgICAgICBzdGF0ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuYFxuXG5hc3luYyBmdW5jdGlvbiBnZXRMYXRlc3REZXBsb3ltZW50cyhpbnB1dDogUGFyc2VkSW5wdXQpOiBQcm9taXNlPERlcGxveW1lbnRJbmZvW10+IHtcbiAgY29uc3Qgb2N0b2tpdCA9IGdldE9jdG9raXQoaW5wdXQudG9rZW4sIHt9KVxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG9jdG9raXQuZ3JhcGhxbDxRdWVyeVJlc3BvbnNlPihxdWVyeSwge1xuICAgIG93bmVyOiBjb250ZXh0LnJlcG8ub3duZXIsXG4gICAgbmFtZTogY29udGV4dC5yZXBvLnJlcG8sXG4gICAgZW52aXJvbm1lbnQ6IGlucHV0LmVudmlyb25tZW50LFxuICB9KVxuXG4gIHJldHVybiByZXNwb25zZS5yZXBvc2l0b3J5LmRlcGxveW1lbnRzLm5vZGVzXG59XG5cbmZ1bmN0aW9uIGhhc0FjdGl2ZURlcGxveW1lbnQoY29tbWl0SWQ6IHN0cmluZywgZGVwbG95bWVudHM6IERlcGxveW1lbnRJbmZvW10pOiBib29sZWFuIHtcbiAgaWYgKGRlcGxveW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gZmFsc2VcblxuICBjb25zdCBsYXRlc3QgPSBkZXBsb3ltZW50cy5zaGlmdCgpXG4gIGlmIChsYXRlc3QgJiYgbGF0ZXN0LmNvbW1pdC5hYmJyZXZpYXRlZE9pZCA9PT0gY29tbWl0SWQgJiYgbGF0ZXN0LnN0YXRlID09PSAnQUNUSVZFJylcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IHNlY29uZExhc3QgPSBkZXBsb3ltZW50cy5zaGlmdCgpXG4gIGlmIChsYXRlc3QgJiYgc2Vjb25kTGFzdClcbiAgICByZXR1cm4gKFxuICAgICAgbGF0ZXN0LmNvbW1pdC5hYmJyZXZpYXRlZE9pZCA9PT0gY29tbWl0SWQgJiZcbiAgICAgIHNlY29uZExhc3QuY29tbWl0LmFiYnJldmlhdGVkT2lkID09PSBjb21taXRJZCAmJlxuICAgICAgbGF0ZXN0LnN0YXRlID09PSAnSU5fUFJPR1JFU1MnICYmXG4gICAgICBzZWNvbmRMYXN0LnN0YXRlID09PSAnQUNUSVZFJylcblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xucnVuKClcbiJdfQ==