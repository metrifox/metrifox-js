import {
  AccessCheckRequest,
  AccessResponse,
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
