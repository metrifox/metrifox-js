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
      `${this.webBaseUrl}/${checkoutKey}/product/${config.productKey}?iframe-embed=true`
    );
  }

  async url(config: CheckoutConfig): Promise<string> {
    const checkoutKey = await this.getCheckoutKey();
    if (!checkoutKey) {
      throw new Error(
        "Checkout Key could not be retrieved. Ensure the API key is valid"
      );
    }

    const urlString = `${this.webBaseUrl}/${checkoutKey}/checkout/${config.offeringKey}`;
    const url = new URL(urlString);
    if (config.billingInterval) {
      url.searchParams.set("billing_period", config.billingInterval);
    }
    if (config.customerKey) {
      url.searchParams.set("customer", config.customerKey);
    }
    const checkoutUrl = url.toString();

    return checkoutUrl;
  }
}
