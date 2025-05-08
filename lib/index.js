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
            const result = hasDeployment(input, deployments);
            // deprecated, to be removed
            (0, core_1.setOutput)('has_active_deployment', result);
            (0, core_1.setOutput)('has_deployment', result);
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
    const maxHistorySize = parseInt((0, core_1.getInput)('max_history_size', { required: false })) || 2;
    (0, core_1.info)(`Parsed Input [maxHistorySize]: ${commitSha}`);
    const isActiveDeployment = JSON.parse((0, core_1.getInput)('is_active_deployment', { required: false })) || true;
    (0, core_1.info)(`Parsed Input [isActiveDeployment]: ${isActiveDeployment}`);
    const token = (0, core_1.getInput)('github_token', { required: false }) || process.env.GITHUB_TOKEN;
    return {
        environment,
        commitSha,
        token,
        maxHistorySize,
        isActiveDeployment,
    };
}
const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!, $maxHistorySize: Int!,) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: $maxHistorySize, orderBy: {field: CREATED_AT, direction: DESC}) {
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
            maxHistorySize: input.maxHistorySize,
        });
        return response.repository.deployments.nodes;
    });
}
function hasDeployment(input, deployments) {
    for (const deployment of deployments)
        if (deployment.commitOid === input.commitSha) {
            if (input.isActiveDeployment)
                return deployment.state === 'ACTIVE';
            return true;
        }
    return false;
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBeUU7QUFDekUsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUE7WUFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNyRCxJQUFBLFdBQUksRUFBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDdEQsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUNoRCw0QkFBNEI7WUFDNUIsSUFBQSxnQkFBUyxFQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQzFDLElBQUEsZ0JBQVMsRUFBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUNyQyxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUMxQixJQUFBLGdCQUFTLEVBQUMsaURBQWlELENBQUMsQ0FBQTtRQUM5RCxDQUFDO0lBQ0gsQ0FBQztDQUFBO0FBRUQsU0FBUyxjQUFjO0lBQ3JCLE1BQU0sV0FBVyxHQUFHLElBQUEsZUFBUSxFQUFDLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0lBQzdELElBQUEsV0FBSSxFQUFDLCtCQUErQixXQUFXLEVBQUUsQ0FBQyxDQUFBO0lBQ2xELE1BQU0sU0FBUyxHQUFHLElBQUEsZUFBUSxFQUFDLFlBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxJQUFJLGdCQUFPLENBQUMsR0FBRyxDQUFBO0lBQzFFLElBQUEsV0FBSSxFQUFDLDZCQUE2QixTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxJQUFBLGVBQVEsRUFBQyxrQkFBa0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3JGLElBQUEsV0FBSSxFQUFDLGtDQUFrQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQ25ELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFBLGVBQVEsRUFBQyxzQkFBc0IsRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFBO0lBQ2xHLElBQUEsV0FBSSxFQUFDLHNDQUFzQyxrQkFBa0IsRUFBRSxDQUFDLENBQUE7SUFDaEUsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsY0FBYyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUF1QixDQUFBO0lBRWpHLE9BQU87UUFDTCxXQUFXO1FBQ1gsU0FBUztRQUNULEtBQUs7UUFDTCxjQUFjO1FBQ2Qsa0JBQWtCO0tBQ25CLENBQUE7QUFDSCxDQUFDO0FBRUQsTUFBTSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7O0NBV2IsQ0FBQTtBQUVELFNBQWUsb0JBQW9CLENBQUMsS0FBa0I7O1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1lBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztZQUM5QixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7U0FDckMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUE7SUFDOUMsQ0FBQztDQUFBO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBa0IsRUFBRSxXQUE2QjtJQUN0RSxLQUFLLE1BQU0sVUFBVSxJQUFJLFdBQVc7UUFDbEMsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUM3QyxJQUFJLEtBQUssQ0FBQyxrQkFBa0I7Z0JBQzFCLE9BQU8sVUFBVSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUE7WUFFdEMsT0FBTyxJQUFJLENBQUE7UUFDYixDQUFDO0lBR0gsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLEdBQUcsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtnZXRJbnB1dCwgc2V0T3V0cHV0LCBpbmZvLCBlcnJvciwgc2V0RmFpbGVkfSBmcm9tICdAYWN0aW9ucy9jb3JlJ1xuaW1wb3J0IHtjb250ZXh0LCBnZXRPY3Rva2l0fSBmcm9tICdAYWN0aW9ucy9naXRodWInXG5pbXBvcnQge0RlcGxveW1lbnRJbmZvLCBQYXJzZWRJbnB1dCwgUXVlcnlSZXNwb25zZX0gZnJvbSAnLi90eXBlcydcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKVxuICAgIGNvbnN0IGRlcGxveW1lbnRzID0gYXdhaXQgZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQpXG4gICAgaW5mbyhgUXVlcnkgUmVzcG9uc2U6ICR7SlNPTi5zdHJpbmdpZnkoZGVwbG95bWVudHMpfWApXG4gICAgY29uc3QgcmVzdWx0ID0gaGFzRGVwbG95bWVudChpbnB1dCwgZGVwbG95bWVudHMpXG4gICAgLy8gZGVwcmVjYXRlZCwgdG8gYmUgcmVtb3ZlZFxuICAgIHNldE91dHB1dCgnaGFzX2FjdGl2ZV9kZXBsb3ltZW50JywgcmVzdWx0KVxuICAgIHNldE91dHB1dCgnaGFzX2RlcGxveW1lbnQnLCByZXN1bHQpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpXG4gICAgc2V0RmFpbGVkKCdGYWlsZWQgdG8gY2hlY2sgdGhlIGRlcGxveW1lbnRzIGZvciBlbnZpcm9ubWVudCcpXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2VkSW5wdXQoKTogUGFyc2VkSW5wdXQge1xuICBjb25zdCBlbnZpcm9ubWVudCA9IGdldElucHV0KCdlbnZpcm9ubWVudCcsIHtyZXF1aXJlZDogdHJ1ZX0pXG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbZW52aXJvbm1lbnRdOiAke2Vudmlyb25tZW50fWApXG4gIGNvbnN0IGNvbW1pdFNoYSA9IGdldElucHV0KCdjb21taXRfc2hhJywge3JlcXVpcmVkOiBmYWxzZX0pIHx8IGNvbnRleHQuc2hhXG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbY29tbWl0U2hhXTogJHtjb21taXRTaGF9YClcbiAgY29uc3QgbWF4SGlzdG9yeVNpemUgPSBwYXJzZUludChnZXRJbnB1dCgnbWF4X2hpc3Rvcnlfc2l6ZScsIHtyZXF1aXJlZDogZmFsc2V9KSkgfHwgMlxuICBpbmZvKGBQYXJzZWQgSW5wdXQgW21heEhpc3RvcnlTaXplXTogJHtjb21taXRTaGF9YClcbiAgY29uc3QgaXNBY3RpdmVEZXBsb3ltZW50ID0gSlNPTi5wYXJzZShnZXRJbnB1dCgnaXNfYWN0aXZlX2RlcGxveW1lbnQnLCB7cmVxdWlyZWQ6IGZhbHNlfSkpIHx8IHRydWVcbiAgaW5mbyhgUGFyc2VkIElucHV0IFtpc0FjdGl2ZURlcGxveW1lbnRdOiAke2lzQWN0aXZlRGVwbG95bWVudH1gKVxuICBjb25zdCB0b2tlbiA9IGdldElucHV0KCdnaXRodWJfdG9rZW4nLCB7cmVxdWlyZWQ6IGZhbHNlfSkgfHwgKHByb2Nlc3MuZW52LkdJVEhVQl9UT0tFTiBhcyBzdHJpbmcpXG5cbiAgcmV0dXJuIHtcbiAgICBlbnZpcm9ubWVudCxcbiAgICBjb21taXRTaGEsXG4gICAgdG9rZW4sXG4gICAgbWF4SGlzdG9yeVNpemUsXG4gICAgaXNBY3RpdmVEZXBsb3ltZW50LFxuICB9XG59XG5cbmNvbnN0IHF1ZXJ5ID0gYFxucXVlcnkgZGVwbG95RGV0YWlscygkb3duZXI6IFN0cmluZyEsICRuYW1lOiBTdHJpbmchLCAkZW52aXJvbm1lbnQ6IFN0cmluZyEsICRtYXhIaXN0b3J5U2l6ZTogSW50ISwpIHtcbiAgcmVwb3NpdG9yeShvd25lcjogJG93bmVyLCBuYW1lOiAkbmFtZSkge1xuICAgIGRlcGxveW1lbnRzKGVudmlyb25tZW50czogWyRlbnZpcm9ubWVudF0sIGZpcnN0OiAkbWF4SGlzdG9yeVNpemUsIG9yZGVyQnk6IHtmaWVsZDogQ1JFQVRFRF9BVCwgZGlyZWN0aW9uOiBERVNDfSkge1xuICAgICAgbm9kZXMge1xuICAgICAgICBjb21taXRPaWRcbiAgICAgICAgc3RhdGVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmBcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQ6IFBhcnNlZElucHV0KTogUHJvbWlzZTxEZXBsb3ltZW50SW5mb1tdPiB7XG4gIGNvbnN0IG9jdG9raXQgPSBnZXRPY3Rva2l0KGlucHV0LnRva2VuLCB7fSlcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBvY3Rva2l0LmdyYXBocWw8UXVlcnlSZXNwb25zZT4ocXVlcnksIHtcbiAgICBvd25lcjogY29udGV4dC5yZXBvLm93bmVyLFxuICAgIG5hbWU6IGNvbnRleHQucmVwby5yZXBvLFxuICAgIGVudmlyb25tZW50OiBpbnB1dC5lbnZpcm9ubWVudCxcbiAgICBtYXhIaXN0b3J5U2l6ZTogaW5wdXQubWF4SGlzdG9yeVNpemUsXG4gIH0pXG5cbiAgcmV0dXJuIHJlc3BvbnNlLnJlcG9zaXRvcnkuZGVwbG95bWVudHMubm9kZXNcbn1cblxuZnVuY3Rpb24gaGFzRGVwbG95bWVudChpbnB1dDogUGFyc2VkSW5wdXQsIGRlcGxveW1lbnRzOiBEZXBsb3ltZW50SW5mb1tdKTogYm9vbGVhbiB7XG4gIGZvciAoY29uc3QgZGVwbG95bWVudCBvZiBkZXBsb3ltZW50cylcbiAgICBpZiAoZGVwbG95bWVudC5jb21taXRPaWQgPT09IGlucHV0LmNvbW1pdFNoYSkge1xuICAgICAgaWYgKGlucHV0LmlzQWN0aXZlRGVwbG95bWVudClcbiAgICAgICAgcmV0dXJuIGRlcGxveW1lbnQuc3RhdGUgPT09ICdBQ1RJVkUnXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbnJ1bigpXG4iXX0=