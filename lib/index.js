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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBaUQ7QUFDakQsNENBQW1EO0FBR25ELFNBQWUsR0FBRzs7UUFDaEIsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUE7UUFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNyRCxNQUFNLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO1FBQy9ELElBQUEsZ0JBQVMsRUFBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0NBQUE7QUFFRCxTQUFTLGNBQWM7SUFDckIsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFRLEVBQUMsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7SUFDN0QsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFRLEVBQUMsV0FBVyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUksZ0JBQU8sQ0FBQyxHQUFHLENBQUE7SUFDeEUsTUFBTSxLQUFLLEdBQUcsSUFBQSxlQUFRLEVBQUMsY0FBYyxFQUFFLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLElBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUF1QixDQUFBO0lBRWpHLE9BQU87UUFDTCxXQUFXO1FBQ1gsUUFBUTtRQUNSLEtBQUs7S0FDTixDQUFBO0FBQ0gsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFHOzs7Ozs7Ozs7Ozs7O0NBYWIsQ0FBQTtBQUVELFNBQWUsb0JBQW9CLENBQUMsS0FBa0I7O1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1lBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFBO0lBQzlDLENBQUM7Q0FBQTtBQUVELFNBQVMsbUJBQW1CLENBQUMsUUFBZ0IsRUFBRSxXQUE2QjtJQUMxRSxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUMxQixPQUFPLEtBQUssQ0FBQTtJQUVkLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNsQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsS0FBSyxRQUFRLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxRQUFRO1FBQ2xGLE9BQU8sSUFBSSxDQUFBO0lBRWIsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3RDLElBQUksTUFBTSxJQUFJLFVBQVU7UUFDdEIsT0FBTyxDQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxLQUFLLFFBQVE7WUFDekMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEtBQUssUUFBUTtZQUM3QyxNQUFNLENBQUMsS0FBSyxLQUFLLGFBQWE7WUFDOUIsVUFBVSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQTtJQUVsQyxPQUFPLEtBQUssQ0FBQTtBQUNkLENBQUM7QUFFRCxtRUFBbUU7QUFDbkUsR0FBRyxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2dldElucHV0LCBzZXRPdXRwdXR9IGZyb20gJ0BhY3Rpb25zL2NvcmUnXG5pbXBvcnQge2NvbnRleHQsIGdldE9jdG9raXR9IGZyb20gJ0BhY3Rpb25zL2dpdGh1YidcbmltcG9ydCB7RGVwbG95bWVudEluZm8sIFBhcnNlZElucHV0LCBRdWVyeVJlc3BvbnNlfSBmcm9tICcuL3R5cGVzJ1xuXG5hc3luYyBmdW5jdGlvbiBydW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKVxuICBjb25zdCBkZXBsb3ltZW50cyA9IGF3YWl0IGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0KVxuICBjb25zdCByZXN1bHQgPSBoYXNBY3RpdmVEZXBsb3ltZW50KGlucHV0LmNvbW1pdElkLCBkZXBsb3ltZW50cylcbiAgc2V0T3V0cHV0KCdoYXNfYWN0aXZlX2RlcGxveW1lbnQnLCByZXN1bHQpXG59XG5cbmZ1bmN0aW9uIGdldFBhcnNlZElucHV0KCk6IFBhcnNlZElucHV0IHtcbiAgY29uc3QgZW52aXJvbm1lbnQgPSBnZXRJbnB1dCgnZW52aXJvbm1lbnQnLCB7cmVxdWlyZWQ6IHRydWV9KVxuICBjb25zdCBjb21taXRJZCA9IGdldElucHV0KCdjb21taXRfaWQnLCB7cmVxdWlyZWQ6IGZhbHNlfSkgfHwgY29udGV4dC5zaGFcbiAgY29uc3QgdG9rZW4gPSBnZXRJbnB1dCgnZ2l0aHViX3Rva2VuJywge3JlcXVpcmVkOiBmYWxzZX0pIHx8IChwcm9jZXNzLmVudi5HSVRIVUJfVE9LRU4gYXMgc3RyaW5nKVxuXG4gIHJldHVybiB7XG4gICAgZW52aXJvbm1lbnQsXG4gICAgY29tbWl0SWQsXG4gICAgdG9rZW4sXG4gIH1cbn1cblxuY29uc3QgcXVlcnkgPSBgXG5xdWVyeSBkZXBsb3lEZXRhaWxzKCRvd25lcjogU3RyaW5nISwgJG5hbWU6IFN0cmluZyEsICRlbnZpcm9ubWVudDogU3RyaW5nISkge1xuICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgZGVwbG95bWVudHMoZW52aXJvbm1lbnRzOiBbJGVudmlyb25tZW50XSwgZmlyc3Q6IDIsIG9yZGVyQnk6IHtmaWVsZDogQ1JFQVRFRF9BVCwgZGlyZWN0aW9uOiBERVNDfSkge1xuICAgICAgbm9kZXMge1xuICAgICAgICBjb21taXQge1xuICAgICAgICAgIGFiYnJldmlhdGVkT2lkXG4gICAgICAgIH1cbiAgICAgICAgc3RhdGVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmBcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQ6IFBhcnNlZElucHV0KTogUHJvbWlzZTxEZXBsb3ltZW50SW5mb1tdPiB7XG4gIGNvbnN0IG9jdG9raXQgPSBnZXRPY3Rva2l0KGlucHV0LnRva2VuLCB7fSlcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBvY3Rva2l0LmdyYXBocWw8UXVlcnlSZXNwb25zZT4ocXVlcnksIHtcbiAgICBvd25lcjogY29udGV4dC5yZXBvLm93bmVyLFxuICAgIG5hbWU6IGNvbnRleHQucmVwby5yZXBvLFxuICB9KVxuXG4gIHJldHVybiByZXNwb25zZS5yZXBvc2l0b3J5LmRlcGxveW1lbnRzLm5vZGVzXG59XG5cbmZ1bmN0aW9uIGhhc0FjdGl2ZURlcGxveW1lbnQoY29tbWl0SWQ6IHN0cmluZywgZGVwbG95bWVudHM6IERlcGxveW1lbnRJbmZvW10pOiBib29sZWFuIHtcbiAgaWYgKGRlcGxveW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gZmFsc2VcblxuICBjb25zdCBsYXRlc3QgPSBkZXBsb3ltZW50cy5zaGlmdCgpXG4gIGlmIChsYXRlc3QgJiYgbGF0ZXN0LmNvbW1pdC5hYmJyZXZpYXRlZE9pZCA9PT0gY29tbWl0SWQgJiYgbGF0ZXN0LnN0YXRlID09PSAnQUNUSVZFJylcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIGNvbnN0IHNlY29uZExhc3QgPSBkZXBsb3ltZW50cy5zaGlmdCgpXG4gIGlmIChsYXRlc3QgJiYgc2Vjb25kTGFzdClcbiAgICByZXR1cm4gKFxuICAgICAgbGF0ZXN0LmNvbW1pdC5hYmJyZXZpYXRlZE9pZCA9PT0gY29tbWl0SWQgJiZcbiAgICAgIHNlY29uZExhc3QuY29tbWl0LmFiYnJldmlhdGVkT2lkID09PSBjb21taXRJZCAmJlxuICAgICAgbGF0ZXN0LnN0YXRlID09PSAnSU5fUFJPR1JFU1MnICYmXG4gICAgICBzZWNvbmRMYXN0LnN0YXRlID09PSAnQUNUSVZFJylcblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xucnVuKClcbiJdfQ==