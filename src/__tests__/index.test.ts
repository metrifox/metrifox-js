import MetrifoxSDK, { checkAccess, recordUsage, init } from "../index";

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
      expect(() => new MetrifoxSDK()).toThrow("Metrifox API key is required");
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
      ).rejects.toThrow("Access check failed: 401 Unauthorized");
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
      ).rejects.toThrow("Usage recording failed: 500 Internal Server Error");
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
