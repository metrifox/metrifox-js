// Metrifox JavaScript SDK
// Official library for usage tracking and access control

// Type declaration for process in browser environments
declare const process: any;

export interface MetrifoxConfig {
  apiKey?: string;
  baseUrl?: string;
}

export interface AccessCheckRequest {
  featureKey: string;
  customerKey: string;
}

export interface AccessResponse {
  message: string;
  canAccess: boolean;
  customerId: string;
  featureKey: string;
  requiredQuantity: number;
  usedQuantity: number;
  includedUsage: number;
  nextResetAt: number;
  quota: number;
  unlimited: boolean;
  carryoverQuantity: number;
  balance: number;
}

export interface UsageEventRequest {
  customerKey: string;
  eventName: string;
  amount?: number; // Optional, defaults to 1
}

export interface UsageEventResponse {
  message: string;
  eventName: string;
  customerKey: string;
}

export interface EmbedConfig {
  container: string | HTMLElement;
  tenantId: string;
  productId: string;
}

export class MetrifoxError extends Error {
  public status: number;
  public statusText: string;
  public details: any;

  constructor(
    message: string,
    status: number,
    statusText: string,
    details: any = null
  ) {
    super(message);
    this.name = "MetrifoxError";
    this.status = status;
    this.statusText = statusText;
    this.details = details;
  }

  public getDisplayMessage(): string {
    if (this.details?.error) {
      return this.details.error;
    }
    if (this.details?.message) {
      return this.details.message;
    }
    return this.message;
  }
}

class MetrifoxSDK {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: MetrifoxConfig = {}) {
    // Auto-detect API key from multiple sources
    this.apiKey = config.apiKey || this.getApiKeyFromEnvironment();

    this.baseUrl =
      config.baseUrl || "https://metrifox-api.staging.useyala.com/api/v1/";

    if (!this.apiKey) {
      throw new Error(
        "Metrifox API key is required. Set METRIFOX_API_KEY environment variable (Node.js) or VITE_METRIFOX_API_KEY (Vite) or pass apiKey in config."
      );
    }
  }

  /**
   * Auto-detect API key from environment variables in different environments
   */
  private getApiKeyFromEnvironment(): string {
    // Try to access global variables that bundlers might set
    const globalThis =
      typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
        ? global
        : {};

    // Node.js environment
    if (typeof process !== "undefined" && process.env?.METRIFOX_API_KEY) {
      return process.env.METRIFOX_API_KEY;
    }

    // Check if Vite has injected the env var as a global
    if ((globalThis as any).__VITE_METRIFOX_API_KEY__) {
      return (globalThis as any).__VITE_METRIFOX_API_KEY__;
    }

    // Webpack/Create React App environment
    if (
      typeof process !== "undefined" &&
      process.env?.REACT_APP_METRIFOX_API_KEY
    ) {
      return process.env.REACT_APP_METRIFOX_API_KEY;
    }

    return "";
  }

  /**
   * Check if a customer has access to a specific feature
   */
  async checkAccess(request: AccessCheckRequest): Promise<AccessResponse> {
    const url = new URL("usage/access", this.baseUrl);
    url.searchParams.append("feature_key", request.featureKey);
    url.searchParams.append("customer_key", request.customerKey);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  /**
   * Record a usage event
   */
  async recordUsage(request: UsageEventRequest): Promise<UsageEventResponse> {
    const url = new URL("usage/events", this.baseUrl);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_key: request.customerKey,
        event_name: request.eventName,
        amount: request.amount ?? 1, // Default to 1 if not provided
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Usage recording failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Embed product list/checkout into a container on host page.
   */
  embedCheckout(config: EmbedConfig) {
    const { container, tenantId, productId } = config;
    if (!config.container) {
      throw new Error(
        'embedCheckout: "container" is required and must be a DOM node or selector.'
      );
    }

    let containerEl = null;

    // Allow passing either a selector string or an actual DOM node
    if (typeof container === "string") {
      containerEl = document.querySelector(container);
      if (!containerEl) {
        throw new Error(
          `embedCheckout: No element found for selector "${container}"`
        );
      }
    } else if (container instanceof HTMLElement) {
      containerEl = container;
    } else {
      throw new Error(
        'embedCheckout: "container" must be a DOM element or selector string.'
      );
    }

    // Clear previous iframe (avoids duplicates in React re-renders)
    containerEl.innerHTML = "";

    const iframe = document.createElement("iframe");

    iframe.src = `http://localhost:3000/tenants/${config.tenantId}/products/${config.productId}?iframe-embed=true`;
    iframe.width = "100%";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.setAttribute("scrolling", "no");

    window.addEventListener("message", (event) => {
      if (event.data?.type === "IFRAME_HEIGHT") {
        iframe.style.height = event.data.height + "px";
      }
    });

    containerEl.appendChild(iframe);
  }

  /**
   * Update API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Update base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }
}

// Default export - initialized SDK instance
let defaultSDK: MetrifoxSDK | null = null;

/**
 * Initialize the default Metrifox SDK instance
 */
export function init(config: MetrifoxConfig = {}): MetrifoxSDK {
  defaultSDK = new MetrifoxSDK(config);
  return defaultSDK;
}

/**
 * Get the default SDK instance (initializes with environment variables if not already initialized)
 */
function getDefaultSDK(): MetrifoxSDK {
  if (!defaultSDK) {
    defaultSDK = new MetrifoxSDK();
  }
  return defaultSDK;
}

/**
 * Convenience function to check access using the default SDK instance
 */
export async function checkAccess(
  request: AccessCheckRequest
): Promise<AccessResponse> {
  return getDefaultSDK().checkAccess(request);
}

/**
 * Convenience function to record usage using the default SDK instance
 */
export async function recordUsage(
  request: UsageEventRequest
): Promise<UsageEventResponse> {
  return getDefaultSDK().recordUsage(request);
}

export function embedCheckout(options: EmbedConfig) {
  return getDefaultSDK().embedCheckout(options);
}

// Named exports
export { MetrifoxSDK };
export default MetrifoxSDK;
