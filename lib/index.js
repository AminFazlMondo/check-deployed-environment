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
        const input = getParsedInput();
        const deployments = yield getLatestDeployments(input);
        const result = hasActiveDeployment(input.commitId, deployments);
        (0, core_1.setOutput)('has_active_deployment', result);
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBaUQ7QUFDakQsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUE7UUFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNyRCxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQy9ELElBQUEsZ0JBQVMsRUFBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0NBQUE7QUFFRCxTQUFTLGNBQWM7SUFDckIsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFRLEVBQUMsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7SUFDN0QsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFRLEVBQUMsV0FBVyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUksZ0JBQU8sQ0FBQyxHQUFHLENBQUE7SUFDeEUsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsY0FBYyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUF1QixDQUFBO0lBRWpHLE9BQU87UUFDTCxXQUFXO1FBQ1gsUUFBUTtRQUNSLEtBQUs7S0FDTixDQUFBO0FBQ0gsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFHOzs7Ozs7Ozs7Ozs7O0NBYWIsQ0FBQTtBQUVELFNBQWUsb0JBQW9CLENBQUMsS0FBa0I7O1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1lBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUE7UUFFRixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQTtJQUM5QyxDQUFDO0NBQUE7QUFFRCxTQUFTLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsV0FBNkI7SUFDMUUsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDMUIsT0FBTyxLQUFLLENBQUE7SUFFZCxNQUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbEMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUTtRQUNsRixPQUFPLElBQUksQ0FBQTtJQUViLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN0QyxJQUFJLE1BQU0sSUFBSSxVQUFVO1FBQ3RCLE9BQU8sQ0FDTCxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxRQUFRO1lBQ3pDLFVBQVUsQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVE7WUFDN0MsTUFBTSxDQUFDLEtBQUssS0FBSyxhQUFhO1lBQzlCLFVBQVUsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUE7SUFFbEMsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLEdBQUcsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZXRJbnB1dCwgc2V0T3V0cHV0fSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0IHtjb250ZXh0LCBnZXRPY3Rva2l0fSBmcm9tICdAYWN0aW9ucy9naXRodWInXG5pbXBvcnQge0RlcGxveW1lbnRJbmZvLCBQYXJzZWRJbnB1dCwgUXVlcnlSZXNwb25zZX0gZnJvbSAnLi90eXBlcydcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBpbnB1dCA9IGdldFBhcnNlZElucHV0KClcbiAgY29uc3QgZGVwbG95bWVudHMgPSBhd2FpdCBnZXRMYXRlc3REZXBsb3ltZW50cyhpbnB1dClcbiAgY29uc3QgcmVzdWx0ID0gaGFzQWN0aXZlRGVwbG95bWVudChpbnB1dC5jb21taXRJZCwgZGVwbG95bWVudHMpXG4gIHNldE91dHB1dCgnaGFzX2FjdGl2ZV9kZXBsb3ltZW50JywgcmVzdWx0KVxufVxuXG5mdW5jdGlvbiBnZXRQYXJzZWRJbnB1dCgpOiBQYXJzZWRJbnB1dCB7XG4gIGNvbnN0IGVudmlyb25tZW50ID0gZ2V0SW5wdXQoJ2Vudmlyb25tZW50Jywge3JlcXVpcmVkOiB0cnVlfSlcbiAgY29uc3QgY29tbWl0SWQgPSBnZXRJbnB1dCgnY29tbWl0X2lkJywge3JlcXVpcmVkOiBmYWxzZX0pIHx8IGNvbnRleHQuc2hhXG4gIGNvbnN0IHRva2VuID0gZ2V0SW5wdXQoJ2dpdGh1Yl90b2tlbicsIHtyZXF1aXJlZDogZmFsc2V9KSB8fCAocHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOIGFzIHN0cmluZylcblxuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50LFxuICAgIGNvbW1pdElkLFxuICAgIHRva2VuLFxuICB9XG59XG5cbmNvbnN0IHF1ZXJ5ID0gYFxucXVlcnkgZGVwbG95RGV0YWlscygkb3duZXI6IFN0cmluZyEsICRuYW1lOiBTdHJpbmchLCAkZW52aXJvbm1lbnQ6IFN0cmluZyEpIHtcbiAgcmVwb3NpdG9yeShvd25lcjogJG93bmVyLCBuYW1lOiAkbmFtZSkge1xuICAgIGRlcGxveW1lbnRzKGVudmlyb25tZW50czogWyRlbnZpcm9ubWVudF0sIGZpcnN0OiAyLCBvcmRlckJ5OiB7ZmllbGQ6IENSRUFURURfQVQsIGRpcmVjdGlvbjogREVTQ30pIHtcbiAgICAgIG5vZGVzIHtcbiAgICAgICAgY29tbWl0IHtcbiAgICAgICAgICBhYmJyZXZpYXRlZE9pZFxuICAgICAgICB9XG4gICAgICAgIHN0YXRlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5gXG5cbmFzeW5jIGZ1bmN0aW9uIGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0OiBQYXJzZWRJbnB1dCk6IFByb21pc2U8RGVwbG95bWVudEluZm9bXT4ge1xuICBjb25zdCBvY3Rva2l0ID0gZ2V0T2N0b2tpdChpbnB1dC50b2tlbiwge30pXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb2N0b2tpdC5ncmFwaHFsPFF1ZXJ5UmVzcG9uc2U+KHF1ZXJ5LCB7XG4gICAgb3duZXI6IGNvbnRleHQucmVwby5vd25lcixcbiAgICBuYW1lOiBjb250ZXh0LnJlcG8ucmVwbyxcbiAgICBlbnZpcm9ubWVudDogaW5wdXQuZW52aXJvbm1lbnQsXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3BvbnNlLnJlcG9zaXRvcnkuZGVwbG95bWVudHMubm9kZXNcbn1cblxuZnVuY3Rpb24gaGFzQWN0aXZlRGVwbG95bWVudChjb21taXRJZDogc3RyaW5nLCBkZXBsb3ltZW50czogRGVwbG95bWVudEluZm9bXSk6IGJvb2xlYW4ge1xuICBpZiAoZGVwbG95bWVudHMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGNvbnN0IGxhdGVzdCA9IGRlcGxveW1lbnRzLnNoaWZ0KClcbiAgaWYgKGxhdGVzdCAmJiBsYXRlc3QuY29tbWl0LmFiYnJldmlhdGVkT2lkID09PSBjb21taXRJZCAmJiBsYXRlc3Quc3RhdGUgPT09ICdBQ1RJVkUnKVxuICAgIHJldHVybiB0cnVlXG5cbiAgY29uc3Qgc2Vjb25kTGFzdCA9IGRlcGxveW1lbnRzLnNoaWZ0KClcbiAgaWYgKGxhdGVzdCAmJiBzZWNvbmRMYXN0KVxuICAgIHJldHVybiAoXG4gICAgICBsYXRlc3QuY29tbWl0LmFiYnJldmlhdGVkT2lkID09PSBjb21taXRJZCAmJlxuICAgICAgc2Vjb25kTGFzdC5jb21taXQuYWJicmV2aWF0ZWRPaWQgPT09IGNvbW1pdElkICYmXG4gICAgICBsYXRlc3Quc3RhdGUgPT09ICdJTl9QUk9HUkVTUycgJiZcbiAgICAgIHNlY29uZExhc3Quc3RhdGUgPT09ICdBQ1RJVkUnKVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXG5ydW4oKVxuIl19