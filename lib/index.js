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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBeUU7QUFDekUsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLGNBQWMsRUFBRSxDQUFBO1lBQzlCLE1BQU0sV0FBVyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDckQsSUFBQSxXQUFJLEVBQUMsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3RELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDaEUsSUFBQSxnQkFBUyxFQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQzNDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7WUFDMUIsSUFBQSxnQkFBUyxFQUFDLGlEQUFpRCxDQUFDLENBQUE7U0FDN0Q7SUFDSCxDQUFDO0NBQUE7QUFFRCxTQUFTLGNBQWM7SUFDckIsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFRLEVBQUMsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7SUFDN0QsSUFBQSxXQUFJLEVBQUMsK0JBQStCLFdBQVcsRUFBRSxDQUFDLENBQUE7SUFDbEQsTUFBTSxTQUFTLEdBQUcsSUFBQSxlQUFRLEVBQUMsWUFBWSxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUksZ0JBQU8sQ0FBQyxHQUFHLENBQUE7SUFDMUUsSUFBQSxXQUFJLEVBQUMsNkJBQTZCLFNBQVMsRUFBRSxDQUFDLENBQUE7SUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsY0FBYyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUF1QixDQUFBO0lBRWpHLE9BQU87UUFDTCxXQUFXO1FBQ1gsU0FBUztRQUNULEtBQUs7S0FDTixDQUFBO0FBQ0gsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFHOzs7Ozs7Ozs7OztDQVdiLENBQUE7QUFFRCxTQUFlLG9CQUFvQixDQUFDLEtBQWtCOztRQUNwRCxNQUFNLE9BQU8sR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzQyxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQWdCLEtBQUssRUFBRTtZQUMzRCxLQUFLLEVBQUUsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSztZQUN6QixJQUFJLEVBQUUsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUN2QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDL0IsQ0FBQyxDQUFBO1FBRUYsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUE7SUFDOUMsQ0FBQztDQUFBO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxTQUFpQixFQUFFLFdBQTZCO0lBQzNFLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQzFCLE9BQU8sS0FBSyxDQUFBO0lBRWQsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ2xDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUTtRQUN2RSxPQUFPLElBQUksQ0FBQTtJQUViLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUN0QyxJQUFJLE1BQU0sSUFBSSxVQUFVO1FBQ3RCLE9BQU8sQ0FDTCxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDOUIsVUFBVSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQ2xDLE1BQU0sQ0FBQyxLQUFLLEtBQUssYUFBYTtZQUM5QixVQUFVLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFBO0lBRWxDLE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQztBQUVELG1FQUFtRTtBQUNuRSxHQUFHLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2V0SW5wdXQsIHNldE91dHB1dCwgaW5mbywgZXJyb3IsIHNldEZhaWxlZH0gZnJvbSAnQGFjdGlvbnMvY29yZSdcbmltcG9ydCB7Y29udGV4dCwgZ2V0T2N0b2tpdH0gZnJvbSAnQGFjdGlvbnMvZ2l0aHViJ1xuaW1wb3J0IHtEZXBsb3ltZW50SW5mbywgUGFyc2VkSW5wdXQsIFF1ZXJ5UmVzcG9uc2V9IGZyb20gJy4vdHlwZXMnXG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpbnB1dCA9IGdldFBhcnNlZElucHV0KClcbiAgICBjb25zdCBkZXBsb3ltZW50cyA9IGF3YWl0IGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0KVxuICAgIGluZm8oYFF1ZXJ5IFJlc3BvbnNlOiAke0pTT04uc3RyaW5naWZ5KGRlcGxveW1lbnRzKX1gKVxuICAgIGNvbnN0IHJlc3VsdCA9IGhhc0FjdGl2ZURlcGxveW1lbnQoaW5wdXQuY29tbWl0U2hhLCBkZXBsb3ltZW50cylcbiAgICBzZXRPdXRwdXQoJ2hhc19hY3RpdmVfZGVwbG95bWVudCcsIHJlc3VsdClcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZXJyb3IoSlNPTi5zdHJpbmdpZnkoZXJyKSlcbiAgICBzZXRGYWlsZWQoJ0ZhaWxlZCB0byBjaGVjayB0aGUgZGVwbG95bWVudHMgZm9yIGVudmlyb25tZW50JylcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQYXJzZWRJbnB1dCgpOiBQYXJzZWRJbnB1dCB7XG4gIGNvbnN0IGVudmlyb25tZW50ID0gZ2V0SW5wdXQoJ2Vudmlyb25tZW50Jywge3JlcXVpcmVkOiB0cnVlfSlcbiAgaW5mbyhgUGFyc2VkIElucHV0IFtlbnZpcm9ubWVudF06ICR7ZW52aXJvbm1lbnR9YClcbiAgY29uc3QgY29tbWl0U2hhID0gZ2V0SW5wdXQoJ2NvbW1pdF9zaGEnLCB7cmVxdWlyZWQ6IGZhbHNlfSkgfHwgY29udGV4dC5zaGFcbiAgaW5mbyhgUGFyc2VkIElucHV0IFtjb21taXRTaGFdOiAke2NvbW1pdFNoYX1gKVxuICBjb25zdCB0b2tlbiA9IGdldElucHV0KCdnaXRodWJfdG9rZW4nLCB7cmVxdWlyZWQ6IGZhbHNlfSkgfHwgKHByb2Nlc3MuZW52LkdJVEhVQl9UT0tFTiBhcyBzdHJpbmcpXG5cbiAgcmV0dXJuIHtcbiAgICBlbnZpcm9ubWVudCxcbiAgICBjb21taXRTaGEsXG4gICAgdG9rZW4sXG4gIH1cbn1cblxuY29uc3QgcXVlcnkgPSBgXG5xdWVyeSBkZXBsb3lEZXRhaWxzKCRvd25lcjogU3RyaW5nISwgJG5hbWU6IFN0cmluZyEsICRlbnZpcm9ubWVudDogU3RyaW5nISkge1xuICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgZGVwbG95bWVudHMoZW52aXJvbm1lbnRzOiBbJGVudmlyb25tZW50XSwgZmlyc3Q6IDIsIG9yZGVyQnk6IHtmaWVsZDogQ1JFQVRFRF9BVCwgZGlyZWN0aW9uOiBERVNDfSkge1xuICAgICAgbm9kZXMge1xuICAgICAgICBjb21taXRPaWRcbiAgICAgICAgc3RhdGVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmBcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQ6IFBhcnNlZElucHV0KTogUHJvbWlzZTxEZXBsb3ltZW50SW5mb1tdPiB7XG4gIGNvbnN0IG9jdG9raXQgPSBnZXRPY3Rva2l0KGlucHV0LnRva2VuLCB7fSlcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBvY3Rva2l0LmdyYXBocWw8UXVlcnlSZXNwb25zZT4ocXVlcnksIHtcbiAgICBvd25lcjogY29udGV4dC5yZXBvLm93bmVyLFxuICAgIG5hbWU6IGNvbnRleHQucmVwby5yZXBvLFxuICAgIGVudmlyb25tZW50OiBpbnB1dC5lbnZpcm9ubWVudCxcbiAgfSlcblxuICByZXR1cm4gcmVzcG9uc2UucmVwb3NpdG9yeS5kZXBsb3ltZW50cy5ub2Rlc1xufVxuXG5mdW5jdGlvbiBoYXNBY3RpdmVEZXBsb3ltZW50KGNvbW1pdFNoYTogc3RyaW5nLCBkZXBsb3ltZW50czogRGVwbG95bWVudEluZm9bXSk6IGJvb2xlYW4ge1xuICBpZiAoZGVwbG95bWVudHMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGNvbnN0IGxhdGVzdCA9IGRlcGxveW1lbnRzLnNoaWZ0KClcbiAgaWYgKGxhdGVzdCAmJiBsYXRlc3QuY29tbWl0T2lkID09PSBjb21taXRTaGEgJiYgbGF0ZXN0LnN0YXRlID09PSAnQUNUSVZFJylcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IHNlY29uZExhc3QgPSBkZXBsb3ltZW50cy5zaGlmdCgpXG4gIGlmIChsYXRlc3QgJiYgc2Vjb25kTGFzdClcbiAgICByZXR1cm4gKFxuICAgICAgbGF0ZXN0LmNvbW1pdE9pZCA9PT0gY29tbWl0U2hhICYmXG4gICAgICBzZWNvbmRMYXN0LmNvbW1pdE9pZCA9PT0gY29tbWl0U2hhICYmXG4gICAgICBsYXRlc3Quc3RhdGUgPT09ICdJTl9QUk9HUkVTUycgJiZcbiAgICAgIHNlY29uZExhc3Quc3RhdGUgPT09ICdBQ1RJVkUnKVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXG5ydW4oKVxuIl19