import { BaseClient } from "../../core/base_client";
import {
    AccessCheckRequest,
    AccessResponse,
    ListUsageEventsParams,
    QuantityPriceRequest,
    QuantityPriceResponse,
    UsageEventListResponse,
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

    async listEvents(params: ListUsageEventsParams = {}): Promise<UsageEventListResponse> {
        const queryParams: Record<string, string> = {};
        if (params.customerKey) queryParams.customer_key = params.customerKey;
        if (params.featureKey) queryParams.feature_key = params.featureKey;
        if (params.page !== undefined) queryParams.page = params.page.toString();
        if (params.perPage !== undefined) queryParams.per_page = params.perPage.toString();

        return this.makeRequest("usage/events", {
            method: "GET",
            params: queryParams,
            useMeterBaseUrl: true
        });
    }

    async quantityPrice(request: QuantityPriceRequest): Promise<QuantityPriceResponse> {
        return this.makeRequest("usage/quantity-price", {
            method: "GET",
            params: {
                customer_key: request.customerKey,
                feature_key: request.featureKey,
                quantity: request.quantity.toString(),
            },
        });
    }
}