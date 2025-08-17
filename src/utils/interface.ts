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

type EventType = 'customer.created' | 'customer.updated' | 'customer.deleted';

export interface CustomerCreateUpdateRequest {
  event_name: Exclude<EventType, 'customer.deleted'>
  data?: {
    customer_key: string;
    primary_email?: string;
    customer_type: string;
    primary_phone?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    legal_name?: string;
  }
}

export interface CustomerDeleteRequest {
  event_name: Extract<EventType, 'customer.deleted'>
  data?: {
    customer_key: string;
  }
}

export type CustomerSyncRequest = CustomerCreateUpdateRequest | CustomerDeleteRequest;

export interface CustomerSyncResponse {
  statusCode: number;
  message?: string;
  data: {
    last_synced_at: string;
    metrifox_id: string;
    customer_key: string;
  }
  errors?: any;
  meta?: any;
}

export interface EmbedConfig {
  container: string | HTMLElement;
  productKey: string;
}