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

export enum TaxStatus {
  TAXABLE = "TAXABLE",
  TAX_EXEMPT = "TAX_EXEMPT",
  REVERSE_CHARGE = "REVERSE_CHARGE"
}

// Utility DTOs
export interface EmailAddress {
  email: string;
  is_primary?: boolean;
}

export interface PhoneNumber {
  phone_number: string;
  country_code: string;
  is_primary?: boolean;
}

export interface Address {
  country?: string;
  address_line_one?: string;
  address_line_two?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone_number?: string;
}

export interface BillingConfig {
  preferred_payment_gateway?: string;
  preferred_payment_method?: string;
  billing_email?: string;
  billing_address?: string;
  payment_reminder_days?: number;
}

export interface TaxIdentification {
  type: string;
  number: string;
  country?: string;
}

export interface ContactPerson {
  first_name?: string;
  last_name?: string;
  email_address?: string;
  designation?: string;
  department?: string;
  is_primary?: boolean;
  phone_number?: string;
}

export interface PaymentTerm {
  type: string;
  value: string;
}


type CustomerType = 'BUSINESS' | 'INDIVIDUAL';

export interface CustomerCreateRequest {
  // Core fields
  customer_key: string; // required field
  customer_type: CustomerType;
  primary_email: string; // required field
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
  billing_email?: string;

  // Preferences
  timezone?: string;
  language?: string;
  currency?: string;
  tax_status?: string; // Note: Ruby DTO uses String, not number

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

  // Complex JSON fields - using proper types with defaults
  billing_configuration?: BillingConfig;
  tax_identifications?: Array<TaxIdentification>;
  contact_people?: Array<ContactPerson>;
  payment_terms?: Array<PaymentTerm>;
  metadata?: Record<string, any>;
}

export interface CustomerUpdateRequest {
  // Core fields
  customer_key: string; // required field
  customer_type?: CustomerType;
  primary_email?: string;
  primary_phone?: string;
  billing_email?: string;
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

  // Preferences
  timezone?: string;
  language?: string;
  currency?: string;
  tax_status?: string; // Note: Ruby DTO uses String, not number

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

  // Complex JSON fields - using proper types instead of generic Record
  billing_configuration?: BillingConfig;
  tax_identifications?: Array<TaxIdentification>;
  contact_people?: Array<ContactPerson>;
  payment_terms?: Array<PaymentTerm>;
  metadata?: Record<string, any>;
}

export interface CustomerDeleteRequest {
  customer_key: string;
}


export interface CustomerCSVSyncResponse {
  statusCode: number;
  message?: string;
  data: {
    total_customers: number;
    successful_upload_count: number;
    failed_upload_count: number;
    customers_added: Array<{
      row: number;
      customer_key: string;
      data: any;
    }>;
    customers_failed: Array<{
      row: number;
      customer_key: string;
      error: string;
    }>;
  }
  errors?: any;
  meta?: any;
}

export interface APIResponse {
  statusCode: number;
  message?: string;
  data?: any;
  errors?: any;
  meta?: any;
}

export interface EmbedConfig {
  container: string | HTMLElement;
  productKey: string;
}