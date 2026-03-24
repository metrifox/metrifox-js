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
      ).rejects.toThrow("Request failed: 401 Unauthorized");
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
        eventId: "evt_test123",
        quantity: 1,
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
            event_id: "evt_test123",
            quantity: 1,
            event_name: "test-event",
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
        quantity: 5,
        creditUsed: 25,
        eventId: "evt_abc123",
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
            event_id: "evt_abc123",
            quantity: 5,
            event_name: "test-event",
            credit_used: 25,
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
        eventId: "evt_partial123",
        creditUsed: 10,
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
            event_id: "evt_partial123",
            quantity: 1, // Default value
            event_name: "test-event",
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
        eventId: "evt_minimal123",
        quantity: 2,
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
            event_id: "evt_minimal123",
            quantity: 2,
            event_name: "test-event",
            // No optional fields in body
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should make correct API call with featureKey instead of eventName", async () => {
      const mockResponse = {
        data: {
          customer_key: "test-customer",
          quantity: 1,
          feature_key: "feature_seats",
        },
        message: "Event received",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.usages.recordUsage({
        customerKey: "test-customer",
        featureKey: "feature_seats",
        eventId: "evt_feature123",
        quantity: 1,
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
            event_id: "evt_feature123",
            quantity: 1,
            feature_key: "feature_seats",
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
          eventId: "evt_fail123",
          quantity: 1,
        })
      ).rejects.toThrow("Request failed: 500 Internal Server Error");
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
      expect(typeof client.customers.bulkCreate).toBe('function');
    });

    it("should have checkout module for billing", async () => {
      expect(client.checkout).toBeDefined();
      expect(typeof client.checkout.embed).toBe('function');
      expect(typeof client.checkout.url).toBe('function');
    });

    it("should have subscriptions module for subscription management", async () => {
      expect(client.subscriptions).toBeDefined();
      expect(typeof client.subscriptions.getBillingHistory).toBe('function');
      expect(typeof client.subscriptions.getEntitlementsSummary).toBe('function');
      expect(typeof client.subscriptions.getEntitlementsUsage).toBe('function');
      expect(typeof client.subscriptions.bulkAssignPlan).toBe('function');
    });
  });

  describe("subscriptions", () => {
    it("should fetch billing history for a subscription", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Billing history fetched successfully",
        data: [
          {
            invoice_id: "inv_001",
            amount: 9900,
            currency: "USD",
            status: "paid",
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.subscriptions.getBillingHistory("sub_uuid_123");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/subscriptions/sub_uuid_123/billing-history",
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

    it("should fetch entitlements summary for a subscription", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Entitlements summary fetched successfully",
        data: [
          {
            feature_key: "api_calls",
            allowance: 10000,
            used: 3500,
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.subscriptions.getEntitlementsSummary("sub_uuid_123");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/subscriptions/sub_uuid_123/v2/entitlements-summary",
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

    it("should fetch entitlements usage for a subscription", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Entitlements usage fetched successfully",
        data: [
          {
            feature_key: "api_calls",
            purchased: 10000,
            used: 3500,
          },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.subscriptions.getEntitlementsUsage("sub_uuid_123");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/subscriptions/sub_uuid_123/v2/entitlements-usage",
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

    it("should throw error on failed billing history fetch", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      await expect(
        client.subscriptions.getBillingHistory("invalid-sub-id")
      ).rejects.toThrow("Request failed: 404 Not Found");
    });
  });

  describe("customers.bulkCreate", () => {
    it("should make correct API call for bulk customer creation", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Bulk Customer Creation Completed",
        meta: {},
        data: {
          total: 2,
          successful_count: 2,
          failed_count: 0,
          customers_created: [
            {
              index: 0,
              customer_key: "acme_corp_001",
              data: {
                id: "764c80e3-ed59-44a5-ba07-7ee5ba547774",
                customer_type: "BUSINESS",
                primary_email: "contact@acmecorp.com",
                display_name: "Acme Corp"
              }
            },
            {
              index: 1,
              customer_key: "jane_doe_001",
              data: {
                id: "864c80e3-ed59-44a5-ba07-7ee5ba547775",
                customer_type: "INDIVIDUAL",
                primary_email: "jane@example.com",
                display_name: "Jane Doe"
              }
            }
          ],
          customers_failed: []
        },
        errors: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.customers.bulkCreate({
        customers: [
          {
            customer_type: "BUSINESS",
            customer_key: "acme_corp_001",
            primary_email: "contact@acmecorp.com",
            legal_name: "Acme Corporation",
            display_name: "Acme Corp"
          },
          {
            customer_type: "INDIVIDUAL",
            customer_key: "jane_doe_001",
            primary_email: "jane@example.com",
            first_name: "Jane",
            last_name: "Doe"
          }
        ]
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/customers/bulk-create",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customers: [
              {
                customer_type: "BUSINESS",
                customer_key: "acme_corp_001",
                primary_email: "contact@acmecorp.com",
                legal_name: "Acme Corporation",
                display_name: "Acme Corp"
              },
              {
                customer_type: "INDIVIDUAL",
                customer_key: "jane_doe_001",
                primary_email: "jane@example.com",
                first_name: "Jane",
                last_name: "Doe"
              }
            ]
          }),
        }
      );

      expect(result).toEqual(mockResponse);
      expect(result.data.successful_count).toBe(2);
      expect(result.data.failed_count).toBe(0);
      expect(result.data.customers_created).toHaveLength(2);
    });

    it("should handle partial failures in bulk creation", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Bulk Customer Creation Completed",
        meta: {},
        data: {
          total: 2,
          successful_count: 1,
          failed_count: 1,
          customers_created: [
            {
              index: 0,
              customer_key: "acme_corp_001",
              data: {
                id: "764c80e3-ed59-44a5-ba07-7ee5ba547774",
                customer_type: "BUSINESS",
                primary_email: "contact@acmecorp.com",
                display_name: "Acme Corp"
              }
            }
          ],
          customers_failed: [
            {
              index: 1,
              customer_key: "jane_doe_001",
              error: "Primary email has already been used"
            }
          ]
        },
        errors: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.customers.bulkCreate({
        customers: [
          {
            customer_type: "BUSINESS",
            customer_key: "acme_corp_001",
            primary_email: "contact@acmecorp.com",
            legal_name: "Acme Corporation",
            display_name: "Acme Corp"
          },
          {
            customer_type: "INDIVIDUAL",
            customer_key: "jane_doe_001",
            primary_email: "jane@example.com",
            first_name: "Jane",
            last_name: "Doe"
          }
        ]
      });

      expect(result.data.successful_count).toBe(1);
      expect(result.data.failed_count).toBe(1);
      expect(result.data.customers_failed[0].error).toBe("Primary email has already been used");
    });

    it("should throw error on failed bulk creation request", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      await expect(
        client.customers.bulkCreate({
          customers: []
        })
      ).rejects.toThrow("Request failed: 400 Bad Request");
    });
  });

  describe("subscriptions.bulkAssignPlan", () => {
    it("should make correct API call for bulk plan assignment", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Bulk Plan Assignment Completed",
        meta: {},
        data: {
          succeeded: [
            { customer_key: "cust_001", subscription_id: "sub_001" },
            { customer_key: "cust_002", subscription_id: "sub_002" }
          ],
          failed: []
        },
        errors: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.subscriptions.bulkAssignPlan({
        customer_keys: ["cust_001", "cust_002"],
        plan_key: "pro-plan",
        billing_interval: "monthly"
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/subscriptions/bulk-assign-plan",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_keys: ["cust_001", "cust_002"],
            plan_key: "pro-plan",
            billing_interval: "monthly"
          }),
        }
      );

      expect(result).toEqual(mockResponse);
      expect(result.data.succeeded).toHaveLength(2);
      expect(result.data.failed).toHaveLength(0);
    });

    it("should make correct API call with all optional parameters", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Bulk Plan Assignment Completed",
        meta: {},
        data: {
          succeeded: [{ customer_key: "cust_001", subscription_id: "sub_001" }],
          failed: []
        },
        errors: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.subscriptions.bulkAssignPlan({
        customer_keys: ["cust_001"],
        plan_key: "pro-plan",
        billing_interval: "yearly",
        currency_code: "EUR",
        items: [{ feature_key: "api_calls", quantity: 10000 }],
        skip_invoice: true
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/api/v1/subscriptions/bulk-assign-plan",
        {
          method: "POST",
          headers: {
            "x-api-key": "test-key",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_keys: ["cust_001"],
            plan_key: "pro-plan",
            billing_interval: "yearly",
            currency_code: "EUR",
            items: [{ feature_key: "api_calls", quantity: 10000 }],
            skip_invoice: true
          }),
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle partial failures in bulk plan assignment", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Bulk Plan Assignment Completed",
        meta: {},
        data: {
          succeeded: [
            { customer_key: "cust_001", subscription_id: "sub_001" }
          ],
          failed: [
            { customer_key: "cust_002", error: "Customer already has an active subscription" }
          ]
        },
        errors: {}
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.subscriptions.bulkAssignPlan({
        customer_keys: ["cust_001", "cust_002"],
        plan_key: "pro-plan"
      });

      expect(result.data.succeeded).toHaveLength(1);
      expect(result.data.failed).toHaveLength(1);
      expect(result.data.failed[0].error).toBe("Customer already has an active subscription");
    });

    it("should throw error on failed bulk plan assignment request", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      });

      await expect(
        client.subscriptions.bulkAssignPlan({
          customer_keys: ["cust_001"],
          plan_key: "pro-plan"
        })
      ).rejects.toThrow("Request failed: 401 Unauthorized");
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
