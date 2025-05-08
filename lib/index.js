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
    if (deployments.length === 0) {
        return false;
    }
    const latest = deployments.shift();
    if (latest && latest.commitOid === commitSha && latest.state === 'ACTIVE') {
        return true;
    }
    const secondLast = deployments.shift();
    if (latest && secondLast) {
        return (latest.commitOid === commitSha &&
            secondLast.commitOid === commitSha &&
            latest.state === 'IN_PROGRESS' &&
            secondLast.state === 'ACTIVE');
    }
    return false;
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBNEU7QUFDNUUsNENBQXNEO0FBR3RELFNBQWUsR0FBRzs7UUFDaEIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUM7WUFDL0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RCxJQUFBLFdBQUksRUFBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdkQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNqRSxJQUFBLGdCQUFTLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBQSxnQkFBUyxFQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDL0QsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELFNBQVMsY0FBYztJQUNyQixNQUFNLFdBQVcsR0FBRyxJQUFBLGVBQVEsRUFBQyxhQUFhLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRSxJQUFBLFdBQUksRUFBQywrQkFBK0IsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNuRCxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQVEsRUFBQyxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxnQkFBTyxDQUFDLEdBQUcsQ0FBQztJQUM3RSxJQUFBLFdBQUksRUFBQyw2QkFBNkIsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQVEsRUFBQyxjQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQXVCLENBQUM7SUFFcEcsT0FBTztRQUNMLFdBQVc7UUFDWCxTQUFTO1FBQ1QsS0FBSztLQUNOLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7O0NBV2IsQ0FBQztBQUVGLFNBQWUsb0JBQW9CLENBQUMsS0FBa0I7O1FBQ3BELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBZ0IsS0FBSyxFQUFFO1lBQzNELEtBQUssRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLO1lBQ3pCLElBQUksRUFBRSxnQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUM7UUFFSCxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUMvQyxDQUFDO0NBQUE7QUFFRCxTQUFTLG1CQUFtQixDQUFDLFNBQWlCLEVBQUUsV0FBNkI7SUFDM0UsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQUEsT0FBTyxLQUFLLENBQUM7SUFBQSxDQUFDO0lBRTdDLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO1FBQUEsT0FBTyxJQUFJLENBQUM7SUFBQSxDQUFDO0lBRXpGLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QyxJQUFJLE1BQU0sSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUN6QixPQUFPLENBQ0wsTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQzlCLFVBQVUsQ0FBQyxTQUFTLEtBQUssU0FBUztZQUNsQyxNQUFNLENBQUMsS0FBSyxLQUFLLGFBQWE7WUFDOUIsVUFBVSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsbUVBQW1FO0FBQ25FLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0SW5wdXQsIHNldE91dHB1dCwgaW5mbywgZXJyb3IsIHNldEZhaWxlZCB9IGZyb20gJ0BhY3Rpb25zL2NvcmUnO1xuaW1wb3J0IHsgY29udGV4dCwgZ2V0T2N0b2tpdCB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1Yic7XG5pbXBvcnQgeyBEZXBsb3ltZW50SW5mbywgUGFyc2VkSW5wdXQsIFF1ZXJ5UmVzcG9uc2UgfSBmcm9tICcuL3R5cGVzJztcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKTtcbiAgICBjb25zdCBkZXBsb3ltZW50cyA9IGF3YWl0IGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0KTtcbiAgICBpbmZvKGBRdWVyeSBSZXNwb25zZTogJHtKU09OLnN0cmluZ2lmeShkZXBsb3ltZW50cyl9YCk7XG4gICAgY29uc3QgcmVzdWx0ID0gaGFzQWN0aXZlRGVwbG95bWVudChpbnB1dC5jb21taXRTaGEsIGRlcGxveW1lbnRzKTtcbiAgICBzZXRPdXRwdXQoJ2hhc19hY3RpdmVfZGVwbG95bWVudCcsIHJlc3VsdCk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuICAgIHNldEZhaWxlZCgnRmFpbGVkIHRvIGNoZWNrIHRoZSBkZXBsb3ltZW50cyBmb3IgZW52aXJvbm1lbnQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQYXJzZWRJbnB1dCgpOiBQYXJzZWRJbnB1dCB7XG4gIGNvbnN0IGVudmlyb25tZW50ID0gZ2V0SW5wdXQoJ2Vudmlyb25tZW50JywgeyByZXF1aXJlZDogdHJ1ZSB9KTtcbiAgaW5mbyhgUGFyc2VkIElucHV0IFtlbnZpcm9ubWVudF06ICR7ZW52aXJvbm1lbnR9YCk7XG4gIGNvbnN0IGNvbW1pdFNoYSA9IGdldElucHV0KCdjb21taXRfc2hhJywgeyByZXF1aXJlZDogZmFsc2UgfSkgfHwgY29udGV4dC5zaGE7XG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbY29tbWl0U2hhXTogJHtjb21taXRTaGF9YCk7XG4gIGNvbnN0IHRva2VuID0gZ2V0SW5wdXQoJ2dpdGh1Yl90b2tlbicsIHsgcmVxdWlyZWQ6IGZhbHNlIH0pIHx8IChwcm9jZXNzLmVudi5HSVRIVUJfVE9LRU4gYXMgc3RyaW5nKTtcblxuICByZXR1cm4ge1xuICAgIGVudmlyb25tZW50LFxuICAgIGNvbW1pdFNoYSxcbiAgICB0b2tlbixcbiAgfTtcbn1cblxuY29uc3QgcXVlcnkgPSBgXG5xdWVyeSBkZXBsb3lEZXRhaWxzKCRvd25lcjogU3RyaW5nISwgJG5hbWU6IFN0cmluZyEsICRlbnZpcm9ubWVudDogU3RyaW5nISkge1xuICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgZGVwbG95bWVudHMoZW52aXJvbm1lbnRzOiBbJGVudmlyb25tZW50XSwgZmlyc3Q6IDIsIG9yZGVyQnk6IHtmaWVsZDogQ1JFQVRFRF9BVCwgZGlyZWN0aW9uOiBERVNDfSkge1xuICAgICAgbm9kZXMge1xuICAgICAgICBjb21taXRPaWRcbiAgICAgICAgc3RhdGVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmA7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0OiBQYXJzZWRJbnB1dCk6IFByb21pc2U8RGVwbG95bWVudEluZm9bXT4ge1xuICBjb25zdCBvY3Rva2l0ID0gZ2V0T2N0b2tpdChpbnB1dC50b2tlbiwge30pO1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG9jdG9raXQuZ3JhcGhxbDxRdWVyeVJlc3BvbnNlPihxdWVyeSwge1xuICAgIG93bmVyOiBjb250ZXh0LnJlcG8ub3duZXIsXG4gICAgbmFtZTogY29udGV4dC5yZXBvLnJlcG8sXG4gICAgZW52aXJvbm1lbnQ6IGlucHV0LmVudmlyb25tZW50LFxuICB9KTtcblxuICByZXR1cm4gcmVzcG9uc2UucmVwb3NpdG9yeS5kZXBsb3ltZW50cy5ub2Rlcztcbn1cblxuZnVuY3Rpb24gaGFzQWN0aXZlRGVwbG95bWVudChjb21taXRTaGE6IHN0cmluZywgZGVwbG95bWVudHM6IERlcGxveW1lbnRJbmZvW10pOiBib29sZWFuIHtcbiAgaWYgKGRlcGxveW1lbnRzLmxlbmd0aCA9PT0gMCkge3JldHVybiBmYWxzZTt9XG5cbiAgY29uc3QgbGF0ZXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKTtcbiAgaWYgKGxhdGVzdCAmJiBsYXRlc3QuY29tbWl0T2lkID09PSBjb21taXRTaGEgJiYgbGF0ZXN0LnN0YXRlID09PSAnQUNUSVZFJykge3JldHVybiB0cnVlO31cblxuICBjb25zdCBzZWNvbmRMYXN0ID0gZGVwbG95bWVudHMuc2hpZnQoKTtcbiAgaWYgKGxhdGVzdCAmJiBzZWNvbmRMYXN0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGxhdGVzdC5jb21taXRPaWQgPT09IGNvbW1pdFNoYSAmJlxuICAgICAgc2Vjb25kTGFzdC5jb21taXRPaWQgPT09IGNvbW1pdFNoYSAmJlxuICAgICAgbGF0ZXN0LnN0YXRlID09PSAnSU5fUFJPR1JFU1MnICYmXG4gICAgICBzZWNvbmRMYXN0LnN0YXRlID09PSAnQUNUSVZFJyk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZmxvYXRpbmctcHJvbWlzZXNcbnJ1bigpO1xuIl19