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

type CustomerType = 'BUSINESS' | 'INDIVIDUAL';

export interface CustomerSyncRequest {
  event_name: EventType;
  data?: {
    // Core fields
    customer_key: string;
    customer_type: CustomerType;
    primary_email: string;
    primary_phone?: string;

    // Business fields
    legal_name?: string;
    display_name?: string;
    legal_number?: string;
    tax_identification_number?: string;
    logo_url?: string;
    website_url?: string;
    account_manager?: string;

    // Individual fields
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string; // ISO date string format

    // Shared identifiers
    billing_email?: string;

    // Preferences
    timezone?: string;
    language?: string;
    currency?: string;
    tax_status?: number;

    // Address fields
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;

    // Shipping address fields
    shipping_address_line1?: string;
    shipping_address_line2?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_country?: string;
    shipping_zip_code?: string;

    // Complex JSON fields
    billing_configuration?: Record<string, any>;
    tax_identifications?: Array<Record<string, any>>;
    contact_people?: Array<Record<string, any>>;
    payment_terms?: Record<string, any>;
    metadata?: Record<string, any>;
  };
}

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

export interface CustomerCSVSyncResponse {
  statusCode: number;
  message?: string;
  data: {
    last_synced_at: String;
    total_customers: number;
    successful_sync_count: number;
    sync_failure_count: number;
    successfully_synced_customers: Array<{
      row: number;
      customer_key: string;
      data: any;
    }>;
    failed_sync_customers: Array<{
      row: number;
      customer_key: string;
      error: string;
    }>;
  }
  errors?: any;
  meta?: any;
}

export interface EmbedConfig {
  container: string | HTMLElement;
  productKey: string;
}