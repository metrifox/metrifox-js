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
  can_access: boolean;
  customer_key: string;
  feature_key: string;
  used_quantity: number;
  quota: number;
  balance: number;
  next_reset_at: number;
  message: string;
  required_quantity: number;
  included_usage: number;
  unlimited: boolean;
  carryover_quantity: number;
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
  REVERSE_CHARGE = "REVERSE_CHARGE",
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

type CustomerType = "BUSINESS" | "INDIVIDUAL";

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

export interface CustomerGetRequest {
  customer_key: string;
}

export interface CustomerDetailsRequest {
  customer_key: string;
}

export interface CustomerSubscription {
  id: string;
  status: string;
  starts_at: string;
  ends_at: string | null;
  renews_at: string;
  plan_name: string;
  product_name: string;
  currency_code: string;
  created_at: string;
  next_billing_date: string;
  next_billing_amount: number;
  current_billing_period_start: string;
  current_billing_period_end: string;
}

export interface CustomerEntitlement {
  id: string;
  name: string;
  used_quantity: number;
  carryover_quantity: number;
  quota: string | number; // Can be "unlimited" or a number
  included_usage: number;
  reset_interval: string;
  next_reset_at: string;
}

export interface CustomerWallet {
  id: string;
  name: string;
  balance: number;
}

export interface CustomerDetailsData {
  metrifox_id: string;
  customer_key: string;
  subscriptions: CustomerSubscription[];
  entitlements: CustomerEntitlement[];
  wallets: CustomerWallet[];
}

export interface CustomerDetailsResponse {
  statusCode: number;
  message: string;
  meta: Record<string, any>;
  data: CustomerDetailsData;
  errors: Record<string, any>;
}


export interface CustomerListItem {
  id: string;
  customer_key: string;
  customer_type: "INDIVIDUAL" | "BUSINESS";
  primary_email: string;
  primary_phone?: string;
  legal_name?: string;
  display_name?: string;
  legal_number?: string;
  tax_identification_number?: string;
  logo_url?: string;
  website_url?: string;
  account_manager?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  full_name: string;
  billing_email: string;
  timezone?: string;
  language?: string;
  currency: string;
  tax_status: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_zip_code?: string;
  created_at: string;
  updated_at: string;
  phone_numbers: any[];
  email_addresses: any[];
  billing_configuration: {
    preferred_payment_gateway?: string;
    preferred_payment_method?: string;
    billing_email?: string;
    billing_address?: string;
    payment_reminder_days?: number;
  };
  tax_identifications: any[];
  contact_people: any[];
  payment_terms: any[];
  metadata: Record<string, any>;
  date_of_birth?: string;
  documents: any[];
}

export interface CustomerListRequest {
  page?: number;
  per_page?: number;
  search_term?: string;
  customer_type?: "INDIVIDUAL" | "BUSINESS";
  date_created?: string;
}

export interface CustomerListResponse {
  statusCode: number;
  message: string;
  data: CustomerListItem[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit_value: number;
    next_page: number | null;
    prev_page: number | null;
    "first_page?": boolean;
    "last_page?": boolean;
    "out_of_range?": boolean;
  };
  errors?: any;
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
  };
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
