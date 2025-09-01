import { BaseClient } from "../../core/base-client";
import {
    CustomerCreateRequest,
    CustomerUpdateRequest,
    APIResponse,
    CustomerDetailsResponse,
    CustomerCSVSyncResponse
} from "../../utils/interface";

export class CustomersModule extends BaseClient {
    async create(request: CustomerCreateRequest): Promise<APIResponse> {
        return this.makeRequest("customers/new", {
            method: "POST",
            body: request
        });
    }

    async update(customerKey: string, request: CustomerUpdateRequest): Promise<APIResponse> {
        return this.makeRequest(`customers/${customerKey}`, {
            method: "PATCH",
            body: request
        });
    }

    async get(customerKey: string): Promise<APIResponse> {
        return this.makeRequest(`customers/${customerKey}`);
    }

    async delete(customerKey: string): Promise<APIResponse> {
        return this.makeRequest(`customers/${customerKey}`, {
            method: "DELETE"
        });
    }

    async getDetails(customerKey: string): Promise<CustomerDetailsResponse> {
        return this.makeRequest(`customers/${customerKey}/details`);
    }

    async uploadCsv(file: File): Promise<CustomerCSVSyncResponse> {
        const formData = new FormData();
        formData.append('csv', file);

        return this.makeRequest("customers/csv-upload", {
            method: "POST",
            body: formData,
            isFormData: true
        });
    }
}
