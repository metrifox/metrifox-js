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
        const body: any = {
            customer_key: request.customerKey,
            event_name: request.eventName,
            amount: request.amount ?? 1,
        };

        // Add optional fields if they are provided
        if (request.credit_used !== undefined) {
            body.credit_used = request.credit_used;
        }
        if (request.event_id !== undefined) {
            body.event_id = request.event_id;
        }
        if (request.timestamp !== undefined) {
            body.timestamp = request.timestamp;
        }
        if (request.metadata !== undefined) {
            body.metadata = request.metadata;
        }

        return this.makeRequest("usage/events", {
            method: "POST",
            body
        });
    }
}