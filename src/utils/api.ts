import {
  AccessCheckRequest,
  AccessResponse,
  CustomerCreateRequest,
  CustomerCSVSyncResponse,
  CustomerDeleteRequest,
  APIResponse,
  CustomerUpdateRequest,
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

export async function customerCreateRequest(
    baseUrl: string,
    apiKey: string,
    request: CustomerCreateRequest
): Promise<APIResponse> {
  try {
    const url = new URL("/api/v1/customers/new", baseUrl);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) throw new Error("Failed to Create Customer");

    return response.json();
  } catch (error) {
    console.log("ERROR LOGGED", error)
    throw error;
  }
}

export async function customerUpdateRequest(
    baseUrl: string,
    apiKey: string,
    request: CustomerUpdateRequest
): Promise<APIResponse> {
  try {
    const url = new URL(`/api/v1/customers/${request.customer_key}`, baseUrl);
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });

    if (!response.ok) throw new Error("Failed to UPDATE Customer");

    return response.json();
  } catch (error) {
    console.log("ERROR LOGGED", error)
    throw error;
  }
}

export async function customerDeleteRequest(
    baseUrl: string,
    apiKey: string,
    request: CustomerDeleteRequest
): Promise<APIResponse> {
  try {
    const url = new URL(`/api/v1/customers/${request.customer_key}`, baseUrl);
    console.log("URL", url)
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Failed to DELETE Customer");

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
  const url = new URL("/api/v1/customers/csv-upload", baseUrl);

  const formData = new FormData();
  formData.append('csv', file);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to upload CSV");

  return response.json();
}

