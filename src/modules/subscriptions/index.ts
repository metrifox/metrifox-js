import { BaseClient } from "../../core/base_client";
import { APIResponse, BulkAssignPlanRequest } from "../../utils/interface";

export class SubscriptionsModule extends BaseClient {
    async getBillingHistory(subscriptionId: string): Promise<APIResponse> {
        return this.makeRequest(`subscriptions/${subscriptionId}/billing-history`);
    }

    async getEntitlementsSummary(subscriptionId: string): Promise<APIResponse> {
        return this.makeRequest(`subscriptions/${subscriptionId}/v2/entitlements-summary`);
    }

    async getEntitlementsUsage(subscriptionId: string): Promise<APIResponse> {
        return this.makeRequest(`subscriptions/${subscriptionId}/v2/entitlements-usage`);
    }

    async bulkAssignPlan(request: BulkAssignPlanRequest): Promise<APIResponse> {
        return this.makeRequest("subscriptions/bulk-assign-plan", {
            method: "POST",
            body: request
        });
    }
}
