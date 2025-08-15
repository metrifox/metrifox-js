export interface MetrifoxConfig {
  apiKey?: string;
  baseUrl?: string;
  webAppBaseUrl?: string;
}

export interface AccessCheckRequest {
  featureKey: string;
  customerKey: string;
}

export interface AccessResponse {
  message: string;
  canAccess: boolean;
  customerId: string;
  featureKey: string;
  requiredQuantity: number;
  usedQuantity: number;
  includedUsage: number;
  nextResetAt: number;
  quota: number;
  unlimited: boolean;
  carryoverQuantity: number;
  balance: number;
}

export interface UsageEventRequest {
  customerKey: string;
  eventName: string;
  amount?: number; // Optional, defaults to 1
}

export interface UsageEventResponse {
  message: string;
  eventName: string;
  customerKey: string;
}

export interface EmbedConfig {
  container: string | HTMLElement;
  productKey: string;
}
