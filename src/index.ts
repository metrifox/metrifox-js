import { MetrifoxSDK } from "./sdk";
export * from "./utils/interface";

let defaultSDK: MetrifoxSDK | null = null;

export function init(config = {}) {
  defaultSDK = new MetrifoxSDK(config);
  return defaultSDK;
}

function getDefaultSDK(): MetrifoxSDK {
  if (!defaultSDK) defaultSDK = new MetrifoxSDK();
  return defaultSDK;
}

export function checkAccess(request: any) {
  return getDefaultSDK().checkAccess(request);
}

export function recordUsage(request: any) {
  return getDefaultSDK().recordUsage(request);
}

export function createCustomer(request: any) {
  return getDefaultSDK().createCustomer(request);
}

export function updateCustomer(customerKey: string, request: any) {
  return getDefaultSDK().updateCustomer(customerKey, request);
}

export function deleteCustomer(customerKey: string) {
  return getDefaultSDK().deleteCustomer(customerKey);
}

export function getCustomer(customerKey: string) {
  return getDefaultSDK().getCustomer(customerKey);
}

export function getCustomerDetails(customerKey: string) {
  return getDefaultSDK().getCustomerDetails(customerKey);
}

export function uploadCustomersCsv(file: File) {
  return getDefaultSDK().uploadCustomersCsv(file);
}

export function embedCheckout(config: any) {
  return getDefaultSDK().embedCheckout(config);
}

export default MetrifoxSDK;
