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

export function embedCheckout(config: any) {
  return getDefaultSDK().embedCheckout(config);
}

export default MetrifoxSDK;
