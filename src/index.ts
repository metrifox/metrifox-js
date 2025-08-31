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

export function deleteCustomer(request: any) {
  return getDefaultSDK().deleteCustomer(request);
}

export function getCustomerDetails(request: any) {
  return getDefaultSDK().getCustomerDetails(request);
}

export function uploadCustomersCsv(file: File) {
  return getDefaultSDK().uploadCustomersCsv(file);
}

export function embedCheckout(config: any) {
  return getDefaultSDK().embedCheckout(config);
}

export default MetrifoxSDK;
