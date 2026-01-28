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
            (0, core_1.debug)(`Query Response: ${JSON.stringify(deployments)}`);
            const result = hasActiveDeployment(input.commitSha, deployments);
            (0, core_1.setOutput)('has_active_deployment', result);
            (0, core_1.debug)(`Has Active Deployment: ${result}`);
            (0, core_1.exportVariable)('HAS_ACTIVE_DEPLOYMENT', result);
            const currentlyDeployedCommit = getCurrentlyDeployedCommit(deployments);
            (0, core_1.setOutput)('currently_deployed_commit', currentlyDeployedCommit);
            (0, core_1.debug)(`Currently Deployed Commit: ${currentlyDeployedCommit}`);
            (0, core_1.exportVariable)('CURRENTLY_DEPLOYED_COMMIT', currentlyDeployedCommit);
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
    const numberOfDeploymentsToCheck = getNumberInput('number_of_deployments_to_check') || 5;
    (0, core_1.info)(`Parsed Input [numberOfDeploymentsToCheck]: ${numberOfDeploymentsToCheck}`);
    return {
        environment,
        commitSha,
        token,
        numberOfDeploymentsToCheck,
    };
}
function getNumberInput(name) {
    const value = (0, core_1.getInput)(name, { required: false });
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
}
const query = `
query deployDetails($owner: String!, $name: String!, $environment: String!, $numberOfDeploymentsToCheck: Int!) {
  repository(owner: $owner, name: $name) {
    deployments(environments: [$environment], first: $numberOfDeploymentsToCheck, orderBy: {field: CREATED_AT, direction: DESC}) {
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
            numberOfDeploymentsToCheck: input.numberOfDeploymentsToCheck,
        });
        return response.repository.deployments.nodes;
    });
}
function hasActiveDeployment(commitSha, deployments) {
    if (deployments.length === 0) {
        return false;
    }
    const latest = deployments[0];
    if (latest && latest.commitOid === commitSha && latest.state === 'ACTIVE') {
        return true;
    }
    const secondLast = deployments[1];
    if (latest && secondLast) {
        return (latest.commitOid === commitSha &&
            secondLast.commitOid === commitSha &&
            latest.state === 'IN_PROGRESS' &&
            secondLast.state === 'ACTIVE');
    }
    return false;
}
function getCurrentlyDeployedCommit(deployments) {
    const activeDeployment = deployments.find((d) => d.state === 'ACTIVE');
    return activeDeployment ? activeDeployment.commitOid : ' ';
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3Q0FBbUc7QUFDbkcsNENBQXNEO0FBR3RELFNBQWUsR0FBRzs7UUFDaEIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxLQUFLLEdBQUcsY0FBYyxFQUFFLENBQUM7WUFDL0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RCxJQUFBLFlBQUssRUFBQyxtQkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDeEQsTUFBTSxNQUFNLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUNqRSxJQUFBLGdCQUFTLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDM0MsSUFBQSxZQUFLLEVBQUMsMEJBQTBCLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDMUMsSUFBQSxxQkFBYyxFQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRWhELE1BQU0sdUJBQXVCLEdBQUcsMEJBQTBCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEUsSUFBQSxnQkFBUyxFQUFDLDJCQUEyQixFQUFFLHVCQUF1QixDQUFDLENBQUM7WUFDaEUsSUFBQSxZQUFLLEVBQUMsOEJBQThCLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUMvRCxJQUFBLHFCQUFjLEVBQUMsMkJBQTJCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUN2RSxDQUFDO1FBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFBLGdCQUFTLEVBQUMsaURBQWlELENBQUMsQ0FBQztRQUMvRCxDQUFDO0lBQ0gsQ0FB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QUFDZixDQUFDO0FBRUQsU0FBUywwQkFBMEIsQ0FBQyxXQUE2QjtJQUMvRCxNQUFNLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUM7SUFDdkUsT0FBTyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDN0QsQ0FBQztBQUVELG1FQUFtRTtBQUNuRSxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldElucHV0LCBzZXRPdXRwdXQsIGluZm8sIGVycm9yLCBzZXRGYWlsZWQsIGRlYnVnLCBleHBvcnRWYXJpYWJsZSB9IGZyb20gJ0BhY3Rpb25zL2NvcmUnO1xuaW1wb3J0IHsgY29udGV4dCwgZ2V0T2N0b2tpdCB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1Yic7XG5pbXBvcnQgeyBEZXBsb3ltZW50SW5mbywgUGFyc2VkSW5wdXQsIFF1ZXJ5UmVzcG9uc2UgfSBmcm9tICcuL3R5cGVzJztcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKTtcbiAgICBjb25zdCBkZXBsb3ltZW50cyA9IGF3YWl0IGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0KTtcbiAgICBkZWJ1ZyhgUXVlcnkgUmVzcG9uc2U6ICR7SlNPTi5zdHJpbmdpZnkoZGVwbG95bWVudHMpfWApO1xuICAgIGNvbnN0IHJlc3VsdCA9IGhhc0FjdGl2ZURlcGxveW1lbnQoaW5wdXQuY29tbWl0U2hhLCBkZXBsb3ltZW50cyk7XG4gICAgc2V0T3V0cHV0KCdoYXNfYWN0aXZlX2RlcGxveW1lbnQnLCByZXN1bHQpO1xuICAgIGRlYnVnKGBIYXMgQWN0aXZlIERlcGxveW1lbnQ6ICR7cmVzdWx0fWApO1xuICAgIGV4cG9ydFZhcmlhYmxlKCdIQVNfQUNUSVZFX0RFUExPWU1FTlQnLCByZXN1bHQpO1xuXG4gICAgY29uc3QgY3VycmVudGx5RGVwbG95ZWRDb21taXQgPSBnZXRDdXJyZW50bHlEZXBsb3llZENvbW1pdChkZXBsb3ltZW50cyk7XG4gICAgc2V0T3V0cHV0KCdjdXJyZW50bHlfZGVwbG95ZWRfY29tbWl0JywgY3VycmVudGx5RGVwbG95ZWRDb21taXQpO1xuICAgIGRlYnVnKGBDdXJyZW50bHkgRGVwbG95ZWQgQ29tbWl0OiAke2N1cnJlbnRseURlcGxveWVkQ29tbWl0fWApO1xuICAgIGV4cG9ydFZhcmlhYmxlKCdDVVJSRU5UTFlfREVQTE9ZRURfQ09NTUlUJywgY3VycmVudGx5RGVwbG95ZWRDb21taXQpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICBzZXRGYWlsZWQoJ0ZhaWxlZCB0byBjaGVjayB0aGUgZGVwbG95bWVudHMgZm9yIGVudmlyb25tZW50Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2VkSW5wdXQoKTogUGFyc2VkSW5wdXQge1xuICBjb25zdCBlbnZpcm9ubWVudCA9IGdldElucHV0KCdlbnZpcm9ubWVudCcsIHsgcmVxdWlyZWQ6IHRydWUgfSk7XG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbZW52aXJvbm1lbnRdOiAke2Vudmlyb25tZW50fWApO1xuICBjb25zdCBjb21taXRTaGEgPSBnZXRJbnB1dCgnY29tbWl0X3NoYScsIHsgcmVxdWlyZWQ6IGZhbHNlIH0pIHx8IGNvbnRleHQuc2hhO1xuICBpbmZvKGBQYXJzZWQgSW5wdXQgW2NvbW1pdFNoYV06ICR7Y29tbWl0U2hhfWApO1xuICBjb25zdCB0b2tlbiA9IGdldElucHV0KCdnaXRodWJfdG9rZW4nLCB7IHJlcXVpcmVkOiBmYWxzZSB9KSB8fCAocHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOIGFzIHN0cmluZyk7XG4gIGNvbnN0IG51bWJlck9mRGVwbG95bWVudHNUb0NoZWNrID0gZ2V0TnVtYmVySW5wdXQoJ251bWJlcl9vZl9kZXBsb3ltZW50c190b19jaGVjaycpIHx8IDU7XG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbbnVtYmVyT2ZEZXBsb3ltZW50c1RvQ2hlY2tdOiAke251bWJlck9mRGVwbG95bWVudHNUb0NoZWNrfWApO1xuXG4gIHJldHVybiB7XG4gICAgZW52aXJvbm1lbnQsXG4gICAgY29tbWl0U2hhLFxuICAgIHRva2VuLFxuICAgIG51bWJlck9mRGVwbG95bWVudHNUb0NoZWNrLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJJbnB1dChuYW1lOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBjb25zdCB2YWx1ZSA9IGdldElucHV0KG5hbWUsIHsgcmVxdWlyZWQ6IGZhbHNlIH0pO1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZUludCh2YWx1ZSk7XG5cbiAgcmV0dXJuIGlzTmFOKHBhcnNlZCkgPyB1bmRlZmluZWQgOiBwYXJzZWQ7XG59XG5cbmNvbnN0IHF1ZXJ5ID0gYFxucXVlcnkgZGVwbG95RGV0YWlscygkb3duZXI6IFN0cmluZyEsICRuYW1lOiBTdHJpbmchLCAkZW52aXJvbm1lbnQ6IFN0cmluZyEsICRudW1iZXJPZkRlcGxveW1lbnRzVG9DaGVjazogSW50ISkge1xuICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgZGVwbG95bWVudHMoZW52aXJvbm1lbnRzOiBbJGVudmlyb25tZW50XSwgZmlyc3Q6ICRudW1iZXJPZkRlcGxveW1lbnRzVG9DaGVjaywgb3JkZXJCeToge2ZpZWxkOiBDUkVBVEVEX0FULCBkaXJlY3Rpb246IERFU0N9KSB7XG4gICAgICBub2RlcyB7XG4gICAgICAgIGNvbW1pdE9pZFxuICAgICAgICBzdGF0ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuYDtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQ6IFBhcnNlZElucHV0KTogUHJvbWlzZTxEZXBsb3ltZW50SW5mb1tdPiB7XG4gIGNvbnN0IG9jdG9raXQgPSBnZXRPY3Rva2l0KGlucHV0LnRva2VuLCB7fSk7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb2N0b2tpdC5ncmFwaHFsPFF1ZXJ5UmVzcG9uc2U+KHF1ZXJ5LCB7XG4gICAgb3duZXI6IGNvbnRleHQucmVwby5vd25lcixcbiAgICBuYW1lOiBjb250ZXh0LnJlcG8ucmVwbyxcbiAgICBlbnZpcm9ubWVudDogaW5wdXQuZW52aXJvbm1lbnQsXG4gICAgbnVtYmVyT2ZEZXBsb3ltZW50c1RvQ2hlY2s6IGlucHV0Lm51bWJlck9mRGVwbG95bWVudHNUb0NoZWNrLFxuICB9KTtcblxuICByZXR1cm4gcmVzcG9uc2UucmVwb3NpdG9yeS5kZXBsb3ltZW50cy5ub2Rlcztcbn1cblxuZnVuY3Rpb24gaGFzQWN0aXZlRGVwbG95bWVudChjb21taXRTaGE6IHN0cmluZywgZGVwbG95bWVudHM6IERlcGxveW1lbnRJbmZvW10pOiBib29sZWFuIHtcbiAgaWYgKGRlcGxveW1lbnRzLmxlbmd0aCA9PT0gMCkge3JldHVybiBmYWxzZTt9XG5cbiAgY29uc3QgbGF0ZXN0ID0gZGVwbG95bWVudHNbMF07XG4gIGlmIChsYXRlc3QgJiYgbGF0ZXN0LmNvbW1pdE9pZCA9PT0gY29tbWl0U2hhICYmIGxhdGVzdC5zdGF0ZSA9PT0gJ0FDVElWRScpIHtyZXR1cm4gdHJ1ZTt9XG5cbiAgY29uc3Qgc2Vjb25kTGFzdCA9IGRlcGxveW1lbnRzWzFdO1xuICBpZiAobGF0ZXN0ICYmIHNlY29uZExhc3QpIHtcbiAgICByZXR1cm4gKFxuICAgICAgbGF0ZXN0LmNvbW1pdE9pZCA9PT0gY29tbWl0U2hhICYmXG4gICAgICBzZWNvbmRMYXN0LmNvbW1pdE9pZCA9PT0gY29tbWl0U2hhICYmXG4gICAgICBsYXRlc3Quc3RhdGUgPT09ICdJTl9QUk9HUkVTUycgJiZcbiAgICAgIHNlY29uZExhc3Quc3RhdGUgPT09ICdBQ1RJVkUnKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0Q3VycmVudGx5RGVwbG95ZWRDb21taXQoZGVwbG95bWVudHM6IERlcGxveW1lbnRJbmZvW10pOiBzdHJpbmcge1xuICBjb25zdCBhY3RpdmVEZXBsb3ltZW50ID0gZGVwbG95bWVudHMuZmluZCgoZCkgPT4gZC5zdGF0ZSA9PT0gJ0FDVElWRScpO1xuICByZXR1cm4gYWN0aXZlRGVwbG95bWVudCA/IGFjdGl2ZURlcGxveW1lbnQuY29tbWl0T2lkIDogJyAnO1xufVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXG5ydW4oKTtcbiJdfQ==