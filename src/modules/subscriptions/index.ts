import { BaseClient } from "../../core/base_client";
import { APIResponse } from "../../utils/interface";

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
}
