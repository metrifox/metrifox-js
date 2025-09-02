import { BaseClient } from "../../core/base_client";
import {
    CustomerCreateRequest,
    CustomerUpdateRequest,
    CustomerListRequest,
    CustomerListResponse,
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

    async list(params?: CustomerListRequest): Promise<CustomerListResponse> {
        const queryParams = new URLSearchParams();
        
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.search_term) queryParams.append('search_term', params.search_term);
        if (params?.customer_type) queryParams.append('customer_type', params.customer_type);
        if (params?.date_created) queryParams.append('date_created', params.date_created);

        const queryString = queryParams.toString();
        const endpoint = queryString ? `customers?${queryString}` : 'customers';
        
        return this.makeRequest(endpoint);
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
