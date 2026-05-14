export interface MetrifoxConfig {
  apiKey?: string;
  baseUrl?: string;
  webAppBaseUrl?: string;
  meterServiceBaseUrl?: string;
}

export interface AccessCheckRequest {
  featureKey: string;
  customerKey: string;
}

export interface AccessResponseData {
  customer_key: string;
  feature_key: string;
  requested_quantity: number;
  can_access: boolean;
  unlimited: boolean;
  balance: number;
  used_quantity: number;
  entitlement_active: boolean;
  prepaid: boolean;
  wallet_balance: number;
  message: string;
}

export interface AccessResponse {
  data: AccessResponseData;
}

export interface UsageEventRequest {
  customerKey: string;
  eventName?: string; // Either eventName or featureKey is required
  featureKey?: string; // Either eventName or featureKey is required
  eventId: string; // Required for idempotency
  quantity?: number; // Optional, defaults to 1
  creditUsed?: number; // Optional
  timestamp?: number; // Optional
  metadata?: Record<string, any>; // Optional, defaults to {}
}

export interface UsageEventResponseData {
  customer_key: string;
  quantity: number;
  feature_key: string;
}

export interface UsageEventResponse {
  data: UsageEventResponseData;
  message: string;
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
  // Core fields (required)
  customer_key: string; // required - unique identifier for the customer
  customer_type: CustomerType; // required - "INDIVIDUAL" or "BUSINESS"  
  primary_email: string; // required - primary contact email
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
  // Core fields (customer_key cannot be updated - it's used as the identifier)
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

export interface BulkCreateCustomersRequest {
  customers: CustomerCreateRequest[];
}

export interface BulkCreateCustomersResponse {
  statusCode: number;
  message?: string;
  data: {
    total: number;
    successful_count: number;
    failed_count: number;
    customers_created: Array<{
      index: number;
      customer_key: string;
      data: {
        id: string;
        customer_type: string;
        primary_email: string;
        display_name: string | null;
      };
    }>;
    customers_failed: Array<{
      index: number;
      customer_key: string;
      error: string;
    }>;
  };
  errors?: any;
  meta?: any;
}

export interface BulkAssignPlanRequest {
  customer_keys: string[];
  plan_key: string;
  billing_interval?: string;
  currency_code?: string;
  items?: Array<{
    feature_key?: string;
    credit_key?: string;
    quantity: number;
  }>;
  skip_invoice?: boolean;
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

export interface CheckoutConfig {
  offeringKey: string;
  billingInterval?: string;
  customerKey?: string;
}

export interface CardCollectionConfig {
  subscriptionId?: string;
  orderId?: string;
}

export interface ListUsageEventsParams {
  customerKey?: string;
  featureKey?: string;
  page?: number;
  perPage?: number;
}

export interface QuantityPriceRequest {
  customerKey: string;
  featureKey: string;
  quantity: number;
}

export interface AppliedTier {
  first_unit: number;
  last_unit: number;
  pricing_model: string;
  unit_price?: number | null;
  package_price?: number | null;
  package_size?: number | null;
  flat_fee?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  percentage?: number | null;
  total_unit_quantity?: number | null;
  units_consumed: number;
  tier_price: string;
}

export interface QuantityPriceResponseData {
  customer_key: string;
  feature_key: string;
  quantity: number;
  price: number;
  unit: string;
  applied_tiers: AppliedTier[];
}

export interface QuantityPriceResponse {
  message?: string;
  data: QuantityPriceResponseData;
}

export interface UsageEventListItem {
  id: string;
  event_id: string;
  customer_key: string;
  feature_key?: string;
  quantity: number;
  timestamp: number;
  credit_used?: number;
  event_name?: string;
  metadata: Record<string, any>;
}

export interface PaginationMeta {
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  total_count: number;
  total_pages: number;
  per_page: number;
}

export interface UsageEventListResponse {
  statusCode?: number;
  message?: string;
  data: UsageEventListItem[];
  meta: PaginationMeta;
  errors?: any;
}

export interface CreditTransaction {
  id: string;
  amount: number;
  created_at: string;
  quantity?: number;
  event_name?: string;
  usage_event_id?: string;
}

export interface CreditAllocation {
  id: string;
  amount: number;
  consumed: number;
  created_at: string;
  allocation_type: string;
  order_id?: string;
  invoice_id?: string;
  order_number?: string;
  valid_until?: string;
  transactions: CreditTransaction[];
}

export interface Wallet {
  id: string;
  name: string;
  credit_unit_singular: string;
  credit_unit_plural: string;
  credit_system_id: string;
  balance: number;
  allocations?: CreditAllocation[];
  credit_key: string;
  customer_key?: string;
  low_balance_threshold?: number;
  credit_attachment_id?: string;
  topup_link?: string;
}

export interface WalletListResponse {
  statusCode?: number;
  message?: string;
  data: Wallet[];
  errors?: any;
  meta?: any;
}

export interface CreditAllocationListResponse {
  statusCode?: number;
  message?: string;
  data: CreditAllocation[];
  meta?: PaginationMeta | any;
  errors?: any;
}

export interface CreditAllocationResponse {
  statusCode?: number;
  message?: string;
  data: CreditAllocation;
  errors?: any;
  meta?: any;
}
