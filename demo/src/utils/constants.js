// Application constants

export const CUSTOMER_TYPES = {
    INDIVIDUAL: 'INDIVIDUAL',
    BUSINESS: 'BUSINESS'
};

export const TAX_STATUS_OPTIONS = [
    { value: 'REVERSE_CHARGE', label: 'Reverse Charge' },
    { value: 'TAX_EXEMPT', label: 'Tax Exempt' },
    { value: 'TAXABLE', label: 'Taxable' }
];

export const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' }
];

export const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' }
];

export const TIMEZONE_OPTIONS = [
    { value: '', label: 'Select Timezone' },
    { value: 'America/New_York', label: 'Eastern Time (EST/EDT)' },
    { value: 'America/Chicago', label: 'Central Time (CST/CDT)' },
    { value: 'America/Denver', label: 'Mountain Time (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT)' },
    { value: 'America/Toronto', label: 'Toronto' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Europe/Berlin', label: 'Berlin' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Australia/Sydney', label: 'Sydney' }
];

export const SYNC_STATUS = {
    SYNCED: 'synced',
    PENDING: 'pending',
    ERROR: 'error'
};

export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
};

export const FORM_TABS = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'address', label: 'Address Information' }
];

export const CSV_HEADERS = [
    'customer_type',
    'primary_email',
    'primary_phone',
    'legal_name',
    'display_name',
    'legal_number',
    'tax_identification_number',
    'logo_url',
    'website_url',
    'account_manager',
    'first_name',
    'middle_name',
    'last_name',
    'date_of_birth',
    'customer_key',
    'billing_email',
    'timezone',
    'language',
    'currency',
    'tax_status',
    'address_line1',
    'address_line2',
    'city',
    'state',
    'country',
    'zip_code',
    'shipping_address_line1',
    'shipping_address_line2',
    'shipping_city',
    'shipping_state',
    'shipping_country',
    'shipping_zip_code'
];