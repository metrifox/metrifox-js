import { BaseClient } from "../../core/base_client";
import { CheckoutConfig, EmbedConfig } from "../../utils/interface";
import { createIframe } from "../../utils/embed-iframe";

export class CheckoutModule extends BaseClient {
  private async getCheckoutKey(): Promise<string> {
    const response = await this.makeRequest("auth/checkout-username");
    return response?.data?.checkout_username;
  }

  async embed(config: EmbedConfig): Promise<void> {
    const checkoutKey = await this.getCheckoutKey();
    if (!checkoutKey) {
      throw new Error(
        "Checkout Key could not be retrieved. Ensure the API key is valid"
      );
    }

    createIframe(
      config.container,
      `${this.webBaseUrl}/${checkoutKey}/pricing/${config.productKey}?iframe-embed=true`
    );
  }

  async url(config: CheckoutConfig): Promise<string> {
    const params: Record<string, string> = {
      offering_key: config.offeringKey,
    };

    if (config.billingInterval) {
      params.billing_interval = config.billingInterval;
    }

    if (config.customerKey) {
      params.customer_key = config.customerKey;
    }

    const response = await this.makeRequest("products/offerings/generate-checkout-url", {
      method: "GET",
      params,
    });

    return response?.data?.checkout_url;
  }
}
