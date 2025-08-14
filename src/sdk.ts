import {
  MetrifoxConfig,
  AccessCheckRequest,
  AccessResponse,
  UsageEventRequest,
  UsageEventResponse,
  EmbedConfig,
} from "./utils/interface";
import {
  fetchAccess,
  fetchUsage,
  fetchCheckoutKey,
} from "./utils/api";
import { createIframe } from "./utils/embed-iframe";

export class MetrifoxSDK {
  private apiKey: string;
  private baseUrl: string;
  private webBaseUrl: string;

  constructor(config: MetrifoxConfig = {}) {
    this.apiKey = config.apiKey || this.getApiKeyFromEnvironment();
    this.baseUrl =
      config.baseUrl || "https://metrifox-api.staging.useyala.com/api/v1/";
    this.webBaseUrl =
      config.webAppBaseUrl || "https://frontend-v3.staging.useyala.com";

    if (!this.apiKey) throw new Error("API key required");
  }

  private getApiKeyFromEnvironment(): string {
    const globalThis =
      typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
        ? global
        : {};
    return (
      process?.env?.METRIFOX_API_KEY ||
      (globalThis as any).__VITE_METRIFOX_API_KEY__ ||
      process?.env?.REACT_APP_METRIFOX_API_KEY ||
      ""
    );
  }

  checkAccess(request: AccessCheckRequest): Promise<AccessResponse> {
    return fetchAccess(this.baseUrl, this.apiKey, request);
  }

  recordUsage(request: UsageEventRequest): Promise<UsageEventResponse> {
    return fetchUsage(this.baseUrl, this.apiKey, request);
  }

  getCheckoutKey(): Promise<string> {
    return fetchCheckoutKey(this.baseUrl, this.apiKey);
  }

  async embedCheckout(config: EmbedConfig) {
    const checkoutKey = await this.getCheckoutKey();
    if (!checkoutKey)
      throw new Error(
        "embed-iframe: Checkout Key could not be retrieved. Ensure the API key is valid"
      );

    createIframe(
      config.container,
      `${this.webBaseUrl}/${checkoutKey}/product/${config.productKey}?iframe-embed=true`
    );
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}
