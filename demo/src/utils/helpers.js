// Helper utility functions

export const generateCustomerKey = () => {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 8);
    return `cust-${timestamp}-${randomPart}`;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
};

export const buildApiPayload = (formData) => {
    const payload = {
        customer_key: formData.customer_key || generateCustomerKey(),
        customer_type: formData.customer_type,
        primary_email: formData.primary_email,
    };

    // Add optional fields only if they have values
    const optionalFields = [
        'primary_phone', 'legal_name', 'display_name', 'legal_number',
        'tax_identification_number', 'logo_url', 'website_url', 'account_manager',
        'first_name', 'middle_name', 'last_name', 'date_of_birth',
        'billing_email', 'timezone', 'language', 'currency', 'tax_status',
        'address_line1', 'address_line2', 'city', 'state', 'country', 'zip_code',
        'shipping_address_line1', 'shipping_address_line2', 'shipping_city',
        'shipping_state', 'shipping_country', 'shipping_zip_code'
    ];

    optionalFields.forEach(field => {
        if (formData[field]) {
            payload[field] = formData[field];
        }
    });

    return payload;
};

export const getStatusBadgeConfig = (status) => {
    const statusConfig = {
        synced: { class: 'status-synced', text: 'Synced' },
        pending: { class: 'status-pending', text: 'Pending' },
        error: { class: 'status-error', text: 'Error' }
    };
    return statusConfig[status] || statusConfig.pending;
};

export const getCustomerDisplayName = (customer) => {
    if (customer.customer_type === 'INDIVIDUAL') {
        return `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unnamed';
    }
    return customer.display_name || customer.legal_name || 'Unnamed Business';
};

export const downloadTemplate = () => {
    const headers = [
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

    const sample = [
        'BUSINESS,contact@acmecorp.com,+1-555-0101,Acme Corporation,Acme Corp,ABC123456789,12-3456789,,https://acmecorp.com,Sarah Johnson,,,,,ACME_CORP_001,billing@acmecorp.com,America/New_York,en,USD,TAXABLE,123 Business Ave,Suite 100,New York,NY,US,10001,123 Business Ave,Suite 100,New York,NY,US,10001',
        'INDIVIDUAL,john.smith@email.com,+1-555-1234,,,,,,,,John,David,Smith,1985-03-15,JOHN_SMITH_006,john.smith@email.com,America/New_York,en,USD,TAXABLE,789 Maple Street,,Springfield,IL,US,62701,789 Maple Street,,Springfield,IL,US,62701'
    ];

    const csvContent = [headers.join(','), ...sample].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers-template.csv';
    a.click();
    URL.revokeObjectURL(url);
};