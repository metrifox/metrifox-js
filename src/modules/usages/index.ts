import { BaseClient } from "../../core/base_client";
import {
    AccessCheckRequest,
    AccessResponse,
    UsageEventRequest,
    UsageEventResponse
} from "../../utils/interface";

export class UsagesModule extends BaseClient {
    async checkAccess(request: AccessCheckRequest): Promise<AccessResponse> {
        return this.makeRequest("usage/access", {
            params: {
                feature_key: request.featureKey,
                customer_key: request.customerKey
            }
        });
    }

    async recordUsage(request: UsageEventRequest): Promise<UsageEventResponse> {
        return this.makeRequest("usage/events", {
            method: "POST",
            body: {
                customer_key: request.customerKey,
                event_name: request.eventName,
                amount: request.amount ?? 1,
            }
        });
    }
}