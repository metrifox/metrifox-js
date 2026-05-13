import { BaseClient } from "../../core/base_client";
import {
    CreditAllocationListResponse,
    CreditAllocationResponse,
    WalletListResponse
} from "../../utils/interface";

export class WalletsModule extends BaseClient {
    async list(customerKey: string): Promise<WalletListResponse> {
        return this.makeRequest("credit_systems/v2/wallets", {
            method: "GET",
            params: { customer_key: customerKey }
        });
    }

    async listCreditAllocations(
        walletId: string,
        options: { status?: string } = {}
    ): Promise<CreditAllocationListResponse> {
        const params: Record<string, string> = {};
        if (options.status) params.status = options.status;

        return this.makeRequest(`credit_systems/v2/wallets/${walletId}/credit-allocations`, {
            method: "GET",
            params
        });
    }

    async getCreditAllocation(allocationId: string): Promise<CreditAllocationResponse> {
        return this.makeRequest(`credit_systems/v2/credit-allocations/${allocationId}`, {
            method: "GET"
        });
    }
}
