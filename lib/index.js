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
        (0, core_1.info)(`Query Response: ${JSON.stringify(deployments)}`);
        const result = hasActiveDeployment(input.commitId, deployments);
        (0, core_1.setOutput)('has_active_deployment', result);
    });
}
function getParsedInput() {
    const environment = (0, core_1.getInput)('environment', { required: true });
    (0, core_1.info)(`Parsed Input [environment]: ${environment}`);
    const commitId = (0, core_1.getInput)('commit_id', { required: false }) || github_1.context.sha;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBdUQ7QUFDdkQsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUE7UUFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNyRCxJQUFBLFdBQUksRUFBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDdEQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUMvRCxJQUFBLGdCQUFTLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDNUMsQ0FBQztDQUFBO0FBRUQsU0FBUyxjQUFjO0lBQ3JCLE1BQU0sV0FBVyxHQUFHLElBQUEsZUFBUSxFQUFDLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0lBQzdELElBQUEsV0FBSSxFQUFDLCtCQUErQixXQUFXLEVBQUUsQ0FBQyxDQUFBO0lBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUEsZUFBUSxFQUFDLFdBQVcsRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxJQUFJLGdCQUFPLENBQUMsR0FBRyxDQUFBO0lBQ3hFLElBQUEsV0FBSSxFQUFDLDRCQUE0QixRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUEsZUFBUSxFQUFDLGNBQWMsRUFBRSxFQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxJQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBdUIsQ0FBQTtJQUVqRyxPQUFPO1FBQ0wsV0FBVztRQUNYLFFBQVE7UUFDUixLQUFLO0tBQ04sQ0FBQTtBQUNILENBQUM7QUFFRCxNQUFNLEtBQUssR0FBRzs7Ozs7Ozs7Ozs7OztDQWFiLENBQUE7QUFFRCxTQUFlLG9CQUFvQixDQUFDLEtBQWtCOztRQUNwRCxNQUFNLE9BQU8sR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMzQyxNQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQWdCLEtBQUssRUFBRTtZQUMzRCxLQUFLLEVBQUUsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSztZQUN6QixJQUFJLEVBQUUsZ0JBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUN2QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDL0IsQ0FBQyxDQUFBO1FBRUYsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUE7SUFDOUMsQ0FBQztDQUFBO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxRQUFnQixFQUFFLFdBQTZCO0lBQzFFLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQzFCLE9BQU8sS0FBSyxDQUFBO0lBRWQsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ2xDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFFBQVE7UUFDbEYsT0FBTyxJQUFJLENBQUE7SUFFYixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDdEMsSUFBSSxNQUFNLElBQUksVUFBVTtRQUN0QixPQUFPLENBQ0wsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUTtZQUN6QyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxRQUFRO1lBQzdDLE1BQU0sQ0FBQyxLQUFLLEtBQUssYUFBYTtZQUM5QixVQUFVLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFBO0lBRWxDLE9BQU8sS0FBSyxDQUFBO0FBQ2QsQ0FBQztBQUVELG1FQUFtRTtBQUNuRSxHQUFHLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2V0SW5wdXQsIHNldE91dHB1dCwgaW5mb30gZnJvbSAnQGFjdGlvbnMvY29yZSdcbmltcG9ydCB7Y29udGV4dCwgZ2V0T2N0b2tpdH0gZnJvbSAnQGFjdGlvbnMvZ2l0aHViJ1xuaW1wb3J0IHtEZXBsb3ltZW50SW5mbywgUGFyc2VkSW5wdXQsIFF1ZXJ5UmVzcG9uc2V9IGZyb20gJy4vdHlwZXMnXG5cbmFzeW5jIGZ1bmN0aW9uIHJ1bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgaW5wdXQgPSBnZXRQYXJzZWRJbnB1dCgpXG4gIGNvbnN0IGRlcGxveW1lbnRzID0gYXdhaXQgZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQpXG4gIGluZm8oYFF1ZXJ5IFJlc3BvbnNlOiAke0pTT04uc3RyaW5naWZ5KGRlcGxveW1lbnRzKX1gKVxuICBjb25zdCByZXN1bHQgPSBoYXNBY3RpdmVEZXBsb3ltZW50KGlucHV0LmNvbW1pdElkLCBkZXBsb3ltZW50cylcbiAgc2V0T3V0cHV0KCdoYXNfYWN0aXZlX2RlcGxveW1lbnQnLCByZXN1bHQpXG59XG5cbmZ1bmN0aW9uIGdldFBhcnNlZElucHV0KCk6IFBhcnNlZElucHV0IHtcbiAgY29uc3QgZW52aXJvbm1lbnQgPSBnZXRJbnB1dCgnZW52aXJvbm1lbnQnLCB7cmVxdWlyZWQ6IHRydWV9KVxuICBpbmZvKGBQYXJzZWQgSW5wdXQgW2Vudmlyb25tZW50XTogJHtlbnZpcm9ubWVudH1gKVxuICBjb25zdCBjb21taXRJZCA9IGdldElucHV0KCdjb21taXRfaWQnLCB7cmVxdWlyZWQ6IGZhbHNlfSkgfHwgY29udGV4dC5zaGFcbiAgaW5mbyhgUGFyc2VkIElucHV0IFtjb21taXRJZF06ICR7Y29tbWl0SWR9YClcbiAgY29uc3QgdG9rZW4gPSBnZXRJbnB1dCgnZ2l0aHViX3Rva2VuJywge3JlcXVpcmVkOiBmYWxzZX0pIHx8IChwcm9jZXNzLmVudi5HSVRIVUJfVE9LRU4gYXMgc3RyaW5nKVxuXG4gIHJldHVybiB7XG4gICAgZW52aXJvbm1lbnQsXG4gICAgY29tbWl0SWQsXG4gICAgdG9rZW4sXG4gIH1cbn1cblxuY29uc3QgcXVlcnkgPSBgXG5xdWVyeSBkZXBsb3lEZXRhaWxzKCRvd25lcjogU3RyaW5nISwgJG5hbWU6IFN0cmluZyEsICRlbnZpcm9ubWVudDogU3RyaW5nISkge1xuICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgZGVwbG95bWVudHMoZW52aXJvbm1lbnRzOiBbJGVudmlyb25tZW50XSwgZmlyc3Q6IDIsIG9yZGVyQnk6IHtmaWVsZDogQ1JFQVRFRF9BVCwgZGlyZWN0aW9uOiBERVNDfSkge1xuICAgICAgbm9kZXMge1xuICAgICAgICBjb21taXQge1xuICAgICAgICAgIGFiYnJldmlhdGVkT2lkXG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmBcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQ6IFBhcnNlZElucHV0KTogUHJvbWlzZTxEZXBsb3ltZW50SW5mb1tdPiB7XG4gIGNvbnN0IG9jdG9raXQgPSBnZXRPY3Rva2l0KGlucHV0LnRva2VuLCB7fSlcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBvY3Rva2l0LmdyYXBocWw8UXVlcnlSZXNwb25zZT4ocXVlcnksIHtcbiAgICBvd25lcjogY29udGV4dC5yZXBvLm93bmVyLFxuICAgIG5hbWU6IGNvbnRleHQucmVwby5yZXBvLFxuICAgIGVudmlyb25tZW50OiBpbnB1dC5lbnZpcm9ubWVudCxcbiAgfSlcblxuICByZXR1cm4gcmVzcG9uc2UucmVwb3NpdG9yeS5kZXBsb3ltZW50cy5ub2Rlc1xufVxuXG5mdW5jdGlvbiBoYXNBY3RpdmVEZXBsb3ltZW50KGNvbW1pdElkOiBzdHJpbmcsIGRlcGxveW1lbnRzOiBEZXBsb3ltZW50SW5mb1tdKTogYm9vbGVhbiB7XG4gIGlmIChkZXBsb3ltZW50cy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgY29uc3QgbGF0ZXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKVxuICBpZiAobGF0ZXN0ICYmIGxhdGVzdC5jb21taXQuYWJicmV2aWF0ZWRPaWQgPT09IGNvbW1pdElkICYmIGxhdGVzdC5zdGF0ZSA9PT0gJ0FDVElWRScpXG4gICAgcmV0dXJuIHRydWVcblxuICBjb25zdCBzZWNvbmRMYXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKVxuICBpZiAobGF0ZXN0ICYmIHNlY29uZExhc3QpXG4gICAgcmV0dXJuIChcbiAgICAgIGxhdGVzdC5jb21taXQuYWJicmV2aWF0ZWRPaWQgPT09IGNvbW1pdElkICYmXG4gICAgICBzZWNvbmRMYXN0LmNvbW1pdC5hYmJyZXZpYXRlZE9pZCA9PT0gY29tbWl0SWQgJiZcbiAgICAgIGxhdGVzdC5zdGF0ZSA9PT0gJ0lOX1BST0dSRVNTJyAmJlxuICAgICAgc2Vjb25kTGFzdC5zdGF0ZSA9PT0gJ0FDVElWRScpXG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbnJ1bigpXG4iXX0=