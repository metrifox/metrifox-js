import {
  AccessCheckRequest,
  AccessResponse, CustomerCSVSyncResponse,
  CustomerSyncRequest,
  CustomerSyncResponse,
  UsageEventRequest,
  UsageEventResponse,
} from "./interface";

export async function fetchAccess(
  baseUrl: string,
  apiKey: string,
  request: AccessCheckRequest
): Promise<AccessResponse> {
  const url = new URL("usage/access", baseUrl);
  url.searchParams.append("feature_key", request.featureKey);
  url.searchParams.append("customer_key", request.customerKey);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to check access");

  return response.json();
}

export async function fetchUsage(
  baseUrl: string,
  apiKey: string,
  request: UsageEventRequest
): Promise<UsageEventResponse> {
  const url = new URL("usage/events", baseUrl);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_key: request.customerKey,
      event_name: request.eventName,
      amount: request.amount ?? 1,
    }),
  });

  if (!response.ok) throw new Error("Failed to record usage");

  return response.json();
}

export async function fetchTenantId(
  baseUrl: string,
  apiKey: string
): Promise<string> {
  const url = new URL("auth/get-tenant-id", baseUrl);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to get tenant id");

  const data = await response.json();
  return data?.data?.tenant_id;
}

export async function fetchCheckoutKey(
  baseUrl: string,
  apiKey: string
): Promise<string> {
  const url = new URL("auth/checkout-username", baseUrl);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to get tenant checkout settings");

  const data = await response.json();
  return data?.data?.checkout_username;
}

export async function synchronizeCustomer(
    baseUrl: string,
    apiKey: string,
    request: CustomerSyncRequest
): Promise<CustomerSyncResponse> {
  try {
    const url = new URL("/api/v1/webhooks", baseUrl);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) throw new Error("Failed to Sync Customer");

    return response.json();
  } catch (error) {
    console.log("ERROR LOGGED", error)
    throw error;
  }
}

export async function uploadCustomersCsv(
    baseUrl: string,
    apiKey: string,
    file: File
): Promise<CustomerCSVSyncResponse> {
  const url = new URL("/api/v1/webhooks", baseUrl);

  const formData = new FormData();
  formData.append("event_name", "customer.csv_uploaded");
  formData.append('file', file);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload CSV");

  return response.json();
}

