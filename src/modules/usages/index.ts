import { BaseClient } from "../../core/base_client";
import {
    AccessCheckRequest,
    AccessResponse,
    UsageEventRequest,
    UsageEventResponse
} from "../../utils/interface";

export class UsagesModule extends BaseClient {
    async checkAccess(request: AccessCheckRequest): Promise<AccessResponse> {
        const url = new URL("usage/access", this.meterBaseUrl);
        url.searchParams.append("feature_key", request.featureKey);
        url.searchParams.append("customer_key", request.customerKey);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: { "x-api-key": this.apiKey, "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to check access");

        return response.json();
    }

    async recordUsage(request: UsageEventRequest): Promise<UsageEventResponse> {
        const url = new URL("usage/events", this.meterBaseUrl);

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

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: { "x-api-key": this.apiKey, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Failed to record usage");

        return response.json();
    }
}