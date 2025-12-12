import { METER_BASE_URL, API_BASE_URL, WEB_BASE_URL } from "../utils/constants";

export interface MetrifoxConfig {
    apiKey?: string;
    baseUrl?: string;
    webAppBaseUrl?: string;
}

export class BaseClient {
    protected apiKey: string;
    protected baseUrl: string;
    protected meterBaseUrl: string;
    protected webBaseUrl: string;

    constructor(config: MetrifoxConfig) {
        this.apiKey = config.apiKey || this.getApiKeyFromEnvironment();
        this.baseUrl = config.baseUrl || API_BASE_URL;
        this.meterBaseUrl = METER_BASE_URL;
        this.webBaseUrl = config.webAppBaseUrl || WEB_BASE_URL;

        if (!this.apiKey) throw new Error("API key required");
    }

    private getApiKeyFromEnvironment(): string {
        const globalThis = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
        return (
            process?.env?.METRIFOX_API_KEY ||
            (globalThis as any).__VITE_METRIFOX_API_KEY__ ||
            process?.env?.REACT_APP_METRIFOX_API_KEY ||
            ""
        );
    }

    protected async makeRequest(
        endpoint: string,
        options: {
            method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
            body?: any;
            params?: Record<string, string>;
            isFormData?: boolean;
            useMeterBaseUrl?: boolean;
        } = {}
    ): Promise<any> {
        const { method = 'GET', body, params, isFormData = false, useMeterBaseUrl = false } = options;

        const baseUrl = useMeterBaseUrl ? this.meterBaseUrl : this.baseUrl;
        const url = new URL(endpoint, baseUrl);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const headers: Record<string, string> = {
            "x-api-key": this.apiKey,
        };

        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }

        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        if (body) {
            fetchOptions.body = isFormData ? body : JSON.stringify(body);
        }

        const response = await fetch(url.toString(), fetchOptions);

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }
}