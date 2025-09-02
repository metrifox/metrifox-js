export interface MetrifoxConfig {
    apiKey?: string;
    baseUrl?: string;
    webAppBaseUrl?: string;
}

export class BaseClient {
    protected apiKey: string;
    protected baseUrl: string;
    protected webBaseUrl: string;

    constructor(config: MetrifoxConfig) {
        this.apiKey = config.apiKey || this.getApiKeyFromEnvironment();
        this.baseUrl = config.baseUrl || "https://api.metrifox.com/api/v1/";
        this.webBaseUrl = config.webAppBaseUrl || "https://app.metrifox.com";

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
        } = {}
    ): Promise<any> {
        const { method = 'GET', body, params, isFormData = false } = options;

        const url = new URL(endpoint, this.baseUrl);
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