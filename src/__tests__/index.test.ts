import MetrifoxSDK, { checkAccess, recordUsage, init } from "../index";
import {rejects} from "node:assert";

// Type declaration for Jest globals
declare var global: any;

// Mock fetch globally
global.fetch = jest.fn();

describe("MetrifoxSDK", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should create instance with API key", () => {
      const sdk = new MetrifoxSDK({ apiKey: "test-key" });
      expect(sdk).toBeInstanceOf(MetrifoxSDK);
    });

    it("should throw error when no API key provided", () => {
      expect(() => new MetrifoxSDK()).toThrow("API key required");
    });

    it("should use custom base URL when provided", () => {
      const sdk = new MetrifoxSDK({
        apiKey: "test-key",
        baseUrl: "https://custom.api.com",
      });
      expect(sdk).toBeInstanceOf(MetrifoxSDK);
    });
  });

  describe("checkAccess", () => {
    it("should make correct API call for access check", async () => {
      const mockResponse = {
        message: "Access checked",
        canAccess: true,
        customerId: "test-customer",
        featureKey: "test-feature",
        requiredQuantity: 1,
        usedQuantity: 0,
        includedUsage: 10,
        nextResetAt: 1234567890,
        quota: 100,
        unlimited: false,
        carryoverQuantity: 0,
        balance: 10,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });
      const result = await sdk.checkAccess({
        featureKey: "test-feature",
        customerKey: "test-customer",
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/usage/access?feature_key=test-feature&customer_key=test-customer",
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

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });

      await expect(
        sdk.checkAccess({
          featureKey: "test-feature",
          customerKey: "test-customer",
        })
      ).rejects.toThrow("Failed to check access");
    });
  });

  describe("recordUsage", () => {
    it("should make correct API call for usage recording", async () => {
      const mockResponse = {
        message: "Usage recorded",
        eventName: "test-event",
        customerKey: "test-customer",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });
      const result = await sdk.recordUsage({
        customerKey: "test-customer",
        eventName: "test-event",
        amount: 1,
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.metrifox.com/usage/events",
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

    it("should throw error on failed usage recording", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });

      await expect(
        sdk.recordUsage({
          customerKey: "test-customer",
          eventName: "test-event",
          amount: 1,
        })
      ).rejects.toThrow("Failed to record usage");
    });
  });

  describe("createCustomer", () => {
    it("should make correct API call for customer create sync", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Customer Sync Successful",
        data: {
          customer_key: "test-custome-key",
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

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });
      const result = await sdk.syncCustomer({
        event_name: "customer.created",
        data: {
          customer_key: "test-custome-key",
          primary_email: "test_customer@example.com",
          first_name: "Test",
          last_name: "Customer",
          primary_phone: "1234567890",
          customer_type: "INDIVIDUAL"
        }
      });

      expect(fetch).toHaveBeenCalledWith(
          "https://api.metrifox.com/api/v1/webhooks",
          {
            method: "POST",
            headers: {
              "x-api-key": "test-key",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_name: "customer.created",
              data: {
                customer_key: "test-custome-key",
                primary_email: "test_customer@example.com",
                first_name: "Test",
                last_name: "Customer",
                primary_phone: "1234567890",
                customer_type: "INDIVIDUAL"
              }
            }),
          }
      );

      expect(result).toEqual(mockResponse);
    });

    it("should make correct API call for customer update sync", async () => {
      const mockResponse = {
        statusCode: 200,
        message: "Customer Sync Successful",
        data: {
          customer_key: "test-custome-key",
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

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });
      const result = await sdk.syncCustomer({
        event_name: "customer.updated",
        data: {
          customer_key: "test-custome-key",
          primary_email: "updated_test_customer@example.com",
          first_name: "Updated Test",
          last_name: "Updated Customer",
          primary_phone: "0987654321",
          customer_type: "BUSINESS"
        }
      });

      expect(fetch).toHaveBeenCalledWith(
          "https://api.metrifox.com/api/v1/webhooks",
          {
            method: "POST",
            headers: {
              "x-api-key": "test-key",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_name: "customer.updated",
              data: {
                customer_key: "test-custome-key",
                primary_email: "updated_test_customer@example.com",
                first_name: "Updated Test",
                last_name: "Updated Customer",
                primary_phone: "0987654321",
                customer_type: "BUSINESS"
              }
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

      const sdk = new MetrifoxSDK({ apiKey: "test-key" });

      await expect(
          sdk.syncCustomer({
            event_name: "customer.updated",
            data: {
              customer_key: "test-custome-key",
              primary_email: "updated_test_customer@example.com",
              first_name: "Updated Test",
              last_name: "Updated Customer",
              primary_phone: "0987654321",
              customer_type: "BUSINESS"
            }
          })
      ).rejects.toThrow("Failed to Sync Customer");
    });
  });
  describe("convenience functions", () => {
    it("should initialize and use default SDK instance", async () => {
      const mockResponse = {
        message: "Access checked",
        canAccess: true,
        customerId: "test-customer",
        featureKey: "test-feature",
        requiredQuantity: 1,
        usedQuantity: 0,
        includedUsage: 10,
        nextResetAt: 1234567890,
        quota: 100,
        unlimited: false,
        carryoverQuantity: 0,
        balance: 10,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      init({ apiKey: "test-key" });

      const result = await checkAccess({
        featureKey: "test-feature",
        customerKey: "test-customer",
      });

      expect(result).toEqual(mockResponse);
    });
  });
});
