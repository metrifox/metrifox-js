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
            },
            useMeterBaseUrl: true
        });
    }

    async recordUsage(request: UsageEventRequest): Promise<UsageEventResponse> {
        const body: any = {
            customer_key: request.customerKey,
            event_id: request.eventId,
            quantity: request.quantity ?? 1,
        };

        // Use either event_name or feature_key
        if (request.eventName) {
            body.event_name = request.eventName;
        } else if (request.featureKey) {
            body.feature_key = request.featureKey;
        }

        // Add optional fields if they are provided
        if (request.creditUsed !== undefined) {
            body.credit_used = request.creditUsed;
        }
        if (request.timestamp !== undefined) {
            body.timestamp = request.timestamp;
        }
        if (request.metadata !== undefined) {
            body.metadata = request.metadata;
        }

        return this.makeRequest("usage/events", {
            method: "POST",
            body,
            useMeterBaseUrl: true
        });
    }
}