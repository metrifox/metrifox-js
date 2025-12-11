import { init, MetrifoxClient } from "../index";

// Type declaration for Jest globals
declare var global: any;

// Mock fetch globally
global.fetch = jest.fn();

describe("Metrifox SDK", () => {
  let client: MetrifoxClient;

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    client = init({ apiKey: "test-key" });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("initialization", () => {
    it("should create client instance with API key", () => {
      const testClient = init({ apiKey: "test-key" });
      expect(testClient).toBeDefined();
      expect(testClient.usages).toBeDefined();
      expect(testClient.customers).toBeDefined();
      expect(testClient.checkout).toBeDefined();
    });

    it("should use custom base URL when provided", () => {
      const testClient = init({
        apiKey: "test-key",
        baseUrl: "https://custom.api.com",
      });
      expect(testClient).toBeDefined();
    });
  });

  describe("checkAccess", () => {
    it("should make correct API call for access check", async () => {
      const mockResponse = {
        data: {
          customer_key: "test-customer",
          feature_key: "test-feature",
          requested_quantity: 1,
          can_access: true,
          unlimited: false,
          balance: 10,
          used_quantity: 0,
          entitlement_active: true,
          prepaid: false,
          wallet_balance: 0,
          message: "Feature found",
        },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.usages.checkAccess({
        featureKey: "test-feature",
        customerKey: "test-customer",
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api-meter.metrifox.com/api/v1/usage/access?feature_key=test-feature&customer_key=test-customer",
        {
          method: "GET",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw error on failed API call", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      await expect(
        client.usages.checkAccess({
          featureKey: "test-feature",
          customerKey: "test-customer",
        })
      ).rejects.toThrow("Failed to check access");
    });
  });

  describe("recordUsage", () => {
    it("should make correct API call for usage recording", async () => {
      const mockResponse = {
        data: {
          customer_key: "test-customer",
          quantity: 1,
          feature_key: "test-feature",
        },
        message: "Event received",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.usages.recordUsage({
        customerKey: "test-customer",
        eventName: "test-event",
        amount: 1,
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api-meter.metrifox.com/api/v1/usage/events",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_key: "test-customer",
            event_name: "test-event",
            amount: 1,
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should make correct API call with all optional fields", async () => {
      const mockResponse = {
        data: {
          customer_key: "test-customer",
          quantity: 5,
          feature_key: "test-feature",
        },
        message: "Event received",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.usages.recordUsage({
        customerKey: "test-customer",
        eventName: "test-event",
        amount: 5,
        credit_used: 25,
        event_id: "evt_abc123",
        timestamp: 1640995200000,
        metadata: { feature_type: "premium", session_id: "sess_xyz789" },
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api-meter.metrifox.com/api/v1/usage/events",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_key: "test-customer",
            event_name: "test-event",
            amount: 5,
            credit_used: 25,
            event_id: "evt_abc123",
            timestamp: 1640995200000,
            metadata: { feature_type: "premium", session_id: "sess_xyz789" },
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should make correct API call with partial optional fields", async () => {
      const mockResponse = {
        data: {
          customer_key: "test-customer",
          quantity: 1,
          feature_key: "test-feature",
        },
        message: "Event received",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.usages.recordUsage({
        customerKey: "test-customer",
        eventName: "test-event",
        credit_used: 10,
        metadata: { source: "api" },
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api-meter.metrifox.com/api/v1/usage/events",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_key: "test-customer",
            event_name: "test-event",
            amount: 1, // Default value
            credit_used: 10,
            metadata: { source: "api" },
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should not include undefined optional fields in request body", async () => {
      const mockResponse = {
        data: {
          customer_key: "test-customer",
          quantity: 2,
          feature_key: "test-feature",
        },
        message: "Event received",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.usages.recordUsage({
        customerKey: "test-customer",
        eventName: "test-event",
        amount: 2,
        // Optional fields not provided - should not appear in body
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api-meter.metrifox.com/api/v1/usage/events",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_key: "test-customer",
            event_name: "test-event",
            amount: 2,
            // No optional fields in body
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw error on failed usage recording", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
        client.usages.recordUsage({
          customerKey: "test-customer",
          eventName: "test-event",
          amount: 1,
        })
      ).rejects.toThrow("Failed to record usage");
    });
  });

  describe("customer management", () => {
    it("should make correct API call for customer creation", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Customer Sync Successful",
        data: {
          customer_key: "test-customer-key",
          metrifox_id: "metrifox-id",
          last_synced_at: "2025-08-17T15:49:50+01:00",
        },
        errors: {},
        meta: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.customers.create({
        customer_key: "test-customer-key",
        primary_email: "test_customer@example.com",
        first_name: "Test",
        last_name: "Customer",
        primary_phone: "1234567890",
        customer_type: "INDIVIDUAL"
      });

      expect(fetch).toHaveBeenCalledWith(
          "https://api.metrifox.com/api/v1/customers/new",
          {
            method: "POST",
            headers: {
              "x-api-key": "test-key",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_key: "test-customer-key",
              primary_email: "test_customer@example.com",
              first_name: "Test",
              last_name: "Customer",
              primary_phone: "1234567890",
              customer_type: "INDIVIDUAL"
            }),
          }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should make correct API call for customer update", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Customer Sync Successful",
        data: {
          customer_key: "test-customer-key",
          metrifox_id: "metrifox-id",
          last_synced_at: "2025-08-17T15:49:50+01:00",
        },
        errors: {},
        meta: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.customers.update("test-customer-key", {
        primary_email: "updated_test_customer@example.com",
        first_name: "Updated Test",
        last_name: "Updated Customer",
        primary_phone: "0987654321",
        customer_type: "BUSINESS"
      });

      expect(fetch).toHaveBeenCalledWith(
          "https://api.metrifox.com/api/v1/customers/test-customer-key",
          {
            method: "PATCH",
            headers: {
              "x-api-key": "test-key",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              primary_email: "updated_test_customer@example.com",
              first_name: "Updated Test",
              last_name: "Updated Customer",
              primary_phone: "0987654321",
              customer_type: "BUSINESS"
            }),
          }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw error on failed customer update", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(
          client.customers.update("test-customer-key", {
            primary_email: "updated_test_customer@example.com",
            first_name: "Updated Test",
            last_name: "Updated Customer",
            primary_phone: "0987654321",
            customer_type: "BUSINESS"
          })
      ).rejects.toThrow("Request failed: 500 Internal Server Error");
    });
  });

  describe("checkActiveSubscription", () => {
    it("should check if customer has active subscription", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Active Subscription Check Successful",
        data: {
          has_active_subscription: true
        },
        errors: {},
        meta: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.customers.checkActiveSubscription("test-customer-key");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/customers/test-customer-key/check-active-subscription",
        {
          method: "GET",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toBe(true);
    });

    it("should return false when customer has no active subscription", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Active Subscription Check Successful",
        data: {
          has_active_subscription: false
        },
        errors: {},
        meta: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.customers.checkActiveSubscription("test-customer-key");

      expect(result).toBe(false);
    });

    it("should throw error on failed subscription check", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        client.customers.checkActiveSubscription("invalid-customer")
      ).rejects.toThrow("Request failed: 404 Not Found");
    });
  });

  describe("client modules", () => {
    it("should have usages module for usage tracking", async () => {
      expect(client.usages).toBeDefined();
      expect(typeof client.usages.checkAccess).toBe('function');
      expect(typeof client.usages.recordUsage).toBe('function');
    });

    it("should have customers module for customer management", async () => {
      expect(client.customers).toBeDefined();
      expect(typeof client.customers.create).toBe('function');
      expect(typeof client.customers.update).toBe('function');
      expect(typeof client.customers.list).toBe('function');
      expect(typeof client.customers.get).toBe('function');
      expect(typeof client.customers.delete).toBe('function');
    });

    it("should have checkout module for billing", async () => {
      expect(client.checkout).toBeDefined();
      expect(typeof client.checkout.embed).toBe('function');
      expect(typeof client.checkout.url).toBe('function');
    });
  });

  describe("checkout.url", () => {
    it("should generate checkout URL via API endpoint", async () => {
      const mockResponse = {
        data: {
          checkout_url: "https://app.metrifox.com/test-checkout/checkout/test-offering?billing_period=monthly&customer=test-customer"
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.checkout.url({
        offeringKey: "test-offering",
        billingInterval: "monthly",
        customerKey: "test-customer",
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/products/offerings/generate-checkout-url?offering_key=test-offering&billing_interval=monthly&customer_key=test-customer",
        {
          method: "GET",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toEqual(mockResponse.data.checkout_url);
    });

    it("should generate checkout URL without optional parameters", async () => {
      const mockResponse = {
        data: {
          checkout_url: "https://app.metrifox.com/test-checkout/checkout/test-offering"
        }
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.checkout.url({
        offeringKey: "test-offering",
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/products/offerings/generate-checkout-url?offering_key=test-offering",
        {
          method: "GET",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
        }
      );

      expect(result).toEqual(mockResponse.data.checkout_url);
    });

    it("should throw error on failed checkout URL generation", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(
        client.checkout.url({
          offeringKey: "test-offering",
        })
      ).rejects.toThrow("Request failed: 400 Bad Request");
    });
  });
});
