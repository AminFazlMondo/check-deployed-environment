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
exports.hasActiveDeployment = hasActiveDeployment;
exports.getCurrentlyDeployedCommit = getCurrentlyDeployedCommit;
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
    return activeDeployment ? activeDeployment.commitOid : '';
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUF5RUEsa0RBZ0JDO0FBRUQsZ0VBR0M7QUE5RkQsd0NBQW1HO0FBQ25HLDRDQUFzRDtBQUd0RCxTQUFlLEdBQUc7O1FBQ2hCLElBQUksQ0FBQztZQUNILE1BQU0sS0FBSyxHQUFHLGNBQWMsRUFBRSxDQUFDO1lBQy9CLE1BQU0sV0FBVyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEQsSUFBQSxZQUFLLEVBQUMsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sTUFBTSxHQUFHLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDakUsSUFBQSxnQkFBUyxFQUFDLHVCQUF1QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzNDLElBQUEsWUFBSyxFQUFDLDBCQUEwQixNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLElBQUEscUJBQWMsRUFBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVoRCxNQUFNLHVCQUF1QixHQUFHLDBCQUEwQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3hFLElBQUEsZ0JBQVMsRUFBQywyQkFBMkIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1lBQ2hFLElBQUEsWUFBSyxFQUFDLDhCQUE4Qix1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDL0QsSUFBQSxxQkFBYyxFQUFDLDJCQUEyQixFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDdkUsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBQSxnQkFBUyxFQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDL0QsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELFNBQVMsY0FBYztJQUNyQixNQUFNLFdBQVcsR0FBRyxJQUFBLGVBQVEsRUFBQyxhQUFhLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoRSxJQUFBLFdBQUksRUFBQywrQkFBK0IsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNuRCxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQVEsRUFBQyxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxnQkFBTyxDQUFDLEdBQUcsQ0FBQztJQUM3RSxJQUFBLFdBQUksRUFBQyw2QkFBNkIsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQVEsRUFBQyxjQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQXVCLENBQUM7SUFDcEcsTUFBTSwwQkFBMEIsR0FBRyxjQUFjLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekYsSUFBQSxXQUFJLEVBQUMsOENBQThDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztJQUVqRixPQUFPO1FBQ0wsV0FBVztRQUNYLFNBQVM7UUFDVCxLQUFLO1FBQ0wsMEJBQTBCO0tBQzNCLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBWTtJQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFBLGVBQVEsRUFBQyxJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNsRCxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFL0IsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzVDLENBQUM7QUFFRCxNQUFNLEtBQUssR0FBRzs7Ozs7Ozs7Ozs7Q0FXYixDQUFDO0FBRUYsU0FBZSxvQkFBb0IsQ0FBQyxLQUFrQjs7UUFDcEQsTUFBTSxPQUFPLEdBQUcsSUFBQSxtQkFBVSxFQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFnQixLQUFLLEVBQUU7WUFDM0QsS0FBSyxFQUFFLGdCQUFPLENBQUMsSUFBSSxDQUFDLEtBQUs7WUFDekIsSUFBSSxFQUFFLGdCQUFPLENBQUMsSUFBSSxDQUFDLElBQUk7WUFDdkIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLDBCQUEwQixFQUFFLEtBQUssQ0FBQywwQkFBMEI7U0FDN0QsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7SUFDL0MsQ0FBQztDQUFBO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxXQUE2QjtJQUNsRixJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFBQSxPQUFPLEtBQUssQ0FBQztJQUFBLENBQUM7SUFFN0MsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFLENBQUM7UUFBQSxPQUFPLElBQUksQ0FBQztJQUFBLENBQUM7SUFFekYsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLElBQUksTUFBTSxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ3pCLE9BQU8sQ0FDTCxNQUFNLENBQUMsU0FBUyxLQUFLLFNBQVM7WUFDOUIsVUFBVSxDQUFDLFNBQVMsS0FBSyxTQUFTO1lBQ2xDLE1BQU0sQ0FBQyxLQUFLLEtBQUssYUFBYTtZQUM5QixVQUFVLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxTQUFnQiwwQkFBMEIsQ0FBQyxXQUE2QjtJQUN0RSxNQUFNLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUM7SUFDdkUsT0FBTyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDNUQsQ0FBQztBQUVELG1FQUFtRTtBQUNuRSxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldElucHV0LCBzZXRPdXRwdXQsIGluZm8sIGVycm9yLCBzZXRGYWlsZWQsIGRlYnVnLCBleHBvcnRWYXJpYWJsZSB9IGZyb20gJ0BhY3Rpb25zL2NvcmUnO1xuaW1wb3J0IHsgY29udGV4dCwgZ2V0T2N0b2tpdCB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1Yic7XG5pbXBvcnQgeyBEZXBsb3ltZW50SW5mbywgUGFyc2VkSW5wdXQsIFF1ZXJ5UmVzcG9uc2UgfSBmcm9tICcuL3R5cGVzJztcblxuYXN5bmMgZnVuY3Rpb24gcnVuKCk6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IGlucHV0ID0gZ2V0UGFyc2VkSW5wdXQoKTtcbiAgICBjb25zdCBkZXBsb3ltZW50cyA9IGF3YWl0IGdldExhdGVzdERlcGxveW1lbnRzKGlucHV0KTtcbiAgICBkZWJ1ZyhgUXVlcnkgUmVzcG9uc2U6ICR7SlNPTi5zdHJpbmdpZnkoZGVwbG95bWVudHMpfWApO1xuICAgIGNvbnN0IHJlc3VsdCA9IGhhc0FjdGl2ZURlcGxveW1lbnQoaW5wdXQuY29tbWl0U2hhLCBkZXBsb3ltZW50cyk7XG4gICAgc2V0T3V0cHV0KCdoYXNfYWN0aXZlX2RlcGxveW1lbnQnLCByZXN1bHQpO1xuICAgIGRlYnVnKGBIYXMgQWN0aXZlIERlcGxveW1lbnQ6ICR7cmVzdWx0fWApO1xuICAgIGV4cG9ydFZhcmlhYmxlKCdIQVNfQUNUSVZFX0RFUExPWU1FTlQnLCByZXN1bHQpO1xuXG4gICAgY29uc3QgY3VycmVudGx5RGVwbG95ZWRDb21taXQgPSBnZXRDdXJyZW50bHlEZXBsb3llZENvbW1pdChkZXBsb3ltZW50cyk7XG4gICAgc2V0T3V0cHV0KCdjdXJyZW50bHlfZGVwbG95ZWRfY29tbWl0JywgY3VycmVudGx5RGVwbG95ZWRDb21taXQpO1xuICAgIGRlYnVnKGBDdXJyZW50bHkgRGVwbG95ZWQgQ29tbWl0OiAke2N1cnJlbnRseURlcGxveWVkQ29tbWl0fWApO1xuICAgIGV4cG9ydFZhcmlhYmxlKCdDVVJSRU5UTFlfREVQTE9ZRURfQ09NTUlUJywgY3VycmVudGx5RGVwbG95ZWRDb21taXQpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBlcnJvcihKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICBzZXRGYWlsZWQoJ0ZhaWxlZCB0byBjaGVjayB0aGUgZGVwbG95bWVudHMgZm9yIGVudmlyb25tZW50Jyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UGFyc2VkSW5wdXQoKTogUGFyc2VkSW5wdXQge1xuICBjb25zdCBlbnZpcm9ubWVudCA9IGdldElucHV0KCdlbnZpcm9ubWVudCcsIHsgcmVxdWlyZWQ6IHRydWUgfSk7XG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbZW52aXJvbm1lbnRdOiAke2Vudmlyb25tZW50fWApO1xuICBjb25zdCBjb21taXRTaGEgPSBnZXRJbnB1dCgnY29tbWl0X3NoYScsIHsgcmVxdWlyZWQ6IGZhbHNlIH0pIHx8IGNvbnRleHQuc2hhO1xuICBpbmZvKGBQYXJzZWQgSW5wdXQgW2NvbW1pdFNoYV06ICR7Y29tbWl0U2hhfWApO1xuICBjb25zdCB0b2tlbiA9IGdldElucHV0KCdnaXRodWJfdG9rZW4nLCB7IHJlcXVpcmVkOiBmYWxzZSB9KSB8fCAocHJvY2Vzcy5lbnYuR0lUSFVCX1RPS0VOIGFzIHN0cmluZyk7XG4gIGNvbnN0IG51bWJlck9mRGVwbG95bWVudHNUb0NoZWNrID0gZ2V0TnVtYmVySW5wdXQoJ251bWJlcl9vZl9kZXBsb3ltZW50c190b19jaGVjaycpIHx8IDU7XG4gIGluZm8oYFBhcnNlZCBJbnB1dCBbbnVtYmVyT2ZEZXBsb3ltZW50c1RvQ2hlY2tdOiAke251bWJlck9mRGVwbG95bWVudHNUb0NoZWNrfWApO1xuXG4gIHJldHVybiB7XG4gICAgZW52aXJvbm1lbnQsXG4gICAgY29tbWl0U2hhLFxuICAgIHRva2VuLFxuICAgIG51bWJlck9mRGVwbG95bWVudHNUb0NoZWNrLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXJJbnB1dChuYW1lOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBjb25zdCB2YWx1ZSA9IGdldElucHV0KG5hbWUsIHsgcmVxdWlyZWQ6IGZhbHNlIH0pO1xuICBjb25zdCBwYXJzZWQgPSBwYXJzZUludCh2YWx1ZSk7XG5cbiAgcmV0dXJuIGlzTmFOKHBhcnNlZCkgPyB1bmRlZmluZWQgOiBwYXJzZWQ7XG59XG5cbmNvbnN0IHF1ZXJ5ID0gYFxucXVlcnkgZGVwbG95RGV0YWlscygkb3duZXI6IFN0cmluZyEsICRuYW1lOiBTdHJpbmchLCAkZW52aXJvbm1lbnQ6IFN0cmluZyEsICRudW1iZXJPZkRlcGxveW1lbnRzVG9DaGVjazogSW50ISkge1xuICByZXBvc2l0b3J5KG93bmVyOiAkb3duZXIsIG5hbWU6ICRuYW1lKSB7XG4gICAgZGVwbG95bWVudHMoZW52aXJvbm1lbnRzOiBbJGVudmlyb25tZW50XSwgZmlyc3Q6ICRudW1iZXJPZkRlcGxveW1lbnRzVG9DaGVjaywgb3JkZXJCeToge2ZpZWxkOiBDUkVBVEVEX0FULCBkaXJlY3Rpb246IERFU0N9KSB7XG4gICAgICBub2RlcyB7XG4gICAgICAgIGNvbW1pdE9pZFxuICAgICAgICBzdGF0ZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuYDtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0TGF0ZXN0RGVwbG95bWVudHMoaW5wdXQ6IFBhcnNlZElucHV0KTogUHJvbWlzZTxEZXBsb3ltZW50SW5mb1tdPiB7XG4gIGNvbnN0IG9jdG9raXQgPSBnZXRPY3Rva2l0KGlucHV0LnRva2VuLCB7fSk7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb2N0b2tpdC5ncmFwaHFsPFF1ZXJ5UmVzcG9uc2U+KHF1ZXJ5LCB7XG4gICAgb3duZXI6IGNvbnRleHQucmVwby5vd25lcixcbiAgICBuYW1lOiBjb250ZXh0LnJlcG8ucmVwbyxcbiAgICBlbnZpcm9ubWVudDogaW5wdXQuZW52aXJvbm1lbnQsXG4gICAgbnVtYmVyT2ZEZXBsb3ltZW50c1RvQ2hlY2s6IGlucHV0Lm51bWJlck9mRGVwbG95bWVudHNUb0NoZWNrLFxuICB9KTtcblxuICByZXR1cm4gcmVzcG9uc2UucmVwb3NpdG9yeS5kZXBsb3ltZW50cy5ub2Rlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0FjdGl2ZURlcGxveW1lbnQoY29tbWl0U2hhOiBzdHJpbmcsIGRlcGxveW1lbnRzOiBEZXBsb3ltZW50SW5mb1tdKTogYm9vbGVhbiB7XG4gIGlmIChkZXBsb3ltZW50cy5sZW5ndGggPT09IDApIHtyZXR1cm4gZmFsc2U7fVxuXG4gIGNvbnN0IGxhdGVzdCA9IGRlcGxveW1lbnRzWzBdO1xuICBpZiAobGF0ZXN0ICYmIGxhdGVzdC5jb21taXRPaWQgPT09IGNvbW1pdFNoYSAmJiBsYXRlc3Quc3RhdGUgPT09ICdBQ1RJVkUnKSB7cmV0dXJuIHRydWU7fVxuXG4gIGNvbnN0IHNlY29uZExhc3QgPSBkZXBsb3ltZW50c1sxXTtcbiAgaWYgKGxhdGVzdCAmJiBzZWNvbmRMYXN0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGxhdGVzdC5jb21taXRPaWQgPT09IGNvbW1pdFNoYSAmJlxuICAgICAgc2Vjb25kTGFzdC5jb21taXRPaWQgPT09IGNvbW1pdFNoYSAmJlxuICAgICAgbGF0ZXN0LnN0YXRlID09PSAnSU5fUFJPR1JFU1MnICYmXG4gICAgICBzZWNvbmRMYXN0LnN0YXRlID09PSAnQUNUSVZFJyk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDdXJyZW50bHlEZXBsb3llZENvbW1pdChkZXBsb3ltZW50czogRGVwbG95bWVudEluZm9bXSk6IHN0cmluZyB7XG4gIGNvbnN0IGFjdGl2ZURlcGxveW1lbnQgPSBkZXBsb3ltZW50cy5maW5kKChkKSA9PiBkLnN0YXRlID09PSAnQUNUSVZFJyk7XG4gIHJldHVybiBhY3RpdmVEZXBsb3ltZW50ID8gYWN0aXZlRGVwbG95bWVudC5jb21taXRPaWQgOiAnJztcbn1cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xucnVuKCk7XG4iXX0=