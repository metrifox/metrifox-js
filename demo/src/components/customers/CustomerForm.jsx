import { FormGroup, FormRow, FormInput, FormSelect } from '../common/FormElements';
import InlineTabNavigation from '../common/InlineTabNavigation';

const CustomerForm = ({
                          customerForm,
                          onChange,
                          isEditMode = false,
                          activeTab,
                          onTabChange
                      }) => {
    const tabs = [
        { id: 'basic', label: 'Basic Information' },
        { id: 'preferences', label: 'Preferences' },
        { id: 'address', label: 'Address Information' }
    ];

    const copyBillingToShipping = () => {
        onChange({
            target: {
                name: 'shipping_fields',
                value: {
                    shipping_address_line1: customerForm.address_line1,
                    shipping_address_line2: customerForm.address_line2,
                    shipping_city: customerForm.city,
                    shipping_state: customerForm.state,
                    shipping_country: customerForm.country,
                    shipping_zip_code: customerForm.zip_code
                }
            }
        });
    };

    const renderBasicFields = () => (
        <div className="form-section">
            <FormSelect
                label="Customer Type"
                id="customer_type"
                value={customerForm.customer_type}
                onChange={onChange}
                disabled={isEditMode}
                options={[
                    { value: 'INDIVIDUAL', label: 'Individual' },
                    { value: 'BUSINESS', label: 'Business' }
                ]}
                help={isEditMode ? "Customer type cannot be changed after creation" : ""}
            />

            <FormRow>
                <FormInput
                    label="Primary Email"
                    id="primary_email"
                    type="email"
                    value={customerForm.primary_email}
                    onChange={onChange}
                    placeholder="customer@example.com"
                    required
                />
                <FormInput
                    label="Primary Phone"
                    id="primary_phone"
                    type="tel"
                    value={customerForm.primary_phone}
                    onChange={onChange}
                    placeholder="+1234567890"
                />
            </FormRow>

            {customerForm.customer_type === 'INDIVIDUAL' ? (
                <>
                    <FormRow>
                        <FormInput
                            label="First Name"
                            id="first_name"
                            value={customerForm.first_name}
                            onChange={onChange}
                            placeholder="John"
                        />
                        <FormInput
                            label="Middle Name"
                            id="middle_name"
                            value={customerForm.middle_name}
                            onChange={onChange}
                            placeholder="William"
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label="Last Name"
                            id="last_name"
                            value={customerForm.last_name}
                            onChange={onChange}
                            placeholder="Doe"
                        />
                        <FormInput
                            label="Date of Birth"
                            id="date_of_birth"
                            type="date"
                            value={customerForm.date_of_birth}
                            onChange={onChange}
                        />
                    </FormRow>
                </>
            ) : (
                <>
                    <FormRow>
                        <FormInput
                            label="Legal Name"
                            id="legal_name"
                            value={customerForm.legal_name}
                            onChange={onChange}
                            placeholder="Example Business LLC"
                        />
                        <FormInput
                            label="Display Name"
                            id="display_name"
                            value={customerForm.display_name}
                            onChange={onChange}
                            placeholder="Example Business"
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label="Legal Number"
                            id="legal_number"
                            value={customerForm.legal_number}
                            onChange={onChange}
                            placeholder="ABC123456789"
                        />
                        <FormInput
                            label="Tax ID Number"
                            id="tax_identification_number"
                            value={customerForm.tax_identification_number}
                            onChange={onChange}
                            placeholder="12-3456789"
                        />
                    </FormRow>
                    <FormRow>
                        <FormInput
                            label="Website URL"
                            id="website_url"
                            type="url"
                            value={customerForm.website_url}
                            onChange={onChange}
                            placeholder="https://example.com"
                        />
                        <FormInput
                            label="Account Manager"
                            id="account_manager"
                            value={customerForm.account_manager}
                            onChange={onChange}
                            placeholder="John Smith"
                        />
                    </FormRow>
                </>
            )}

            <FormInput
                label="Customer Key (Read-only)"
                id="customer_key"
                value={customerForm.customer_key}
                onChange={onChange}
                placeholder={customerForm.customer_key}
                readOnly
                help={isEditMode ? "Customer key cannot be changed after creation" : ""}
            />
        </div>
    );

    const renderPreferencesFields = () => (
        <div className="form-section">
            <FormInput
                label="Billing Email"
                id="billing_email"
                type="email"
                value={customerForm.billing_email}
                onChange={onChange}
                placeholder="billing@example.com"
            />

            <FormRow>
                <FormSelect
                    label="Language"
                    id="language"
                    value={customerForm.language}
                    onChange={onChange}
                    options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' },
                        { value: 'it', label: 'Italian' },
                        { value: 'pt', label: 'Portuguese' },
                        { value: 'zh', label: 'Chinese' },
                        { value: 'ja', label: 'Japanese' }
                    ]}
                />
                <FormSelect
                    label="Currency"
                    id="currency"
                    value={customerForm.currency}
                    onChange={onChange}
                    options={[
                        { value: 'USD', label: 'USD - US Dollar' },
                        { value: 'EUR', label: 'EUR - Euro' },
                        { value: 'GBP', label: 'GBP - British Pound' },
                        { value: 'CAD', label: 'CAD - Canadian Dollar' },
                        { value: 'AUD', label: 'AUD - Australian Dollar' },
                        { value: 'JPY', label: 'JPY - Japanese Yen' }
                    ]}
                />
            </FormRow>

            <FormRow>
                <FormSelect
                    label="Timezone"
                    id="timezone"
                    value={customerForm.timezone}
                    onChange={onChange}
                    options={[
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
                    ]}
                />
                <FormSelect
                    label="Tax Status"
                    id="tax_status"
                    value={customerForm.tax_status}
                    onChange={onChange}
                    options={[
                        { value: 'REVERSE_CHARGE', label: 'Reverse Charge' },
                        { value: 'TAX_EXEMPT', label: 'Tax Exempt' },
                        { value: 'TAXABLE', label: 'Taxable' }
                    ]}
                />
            </FormRow>
        </div>
    );

    const renderAddressFields = () => (
        <div className="form-section">
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600 }}>
                Billing Address
            </h4>

            <FormInput
                label="Address Line 1"
                id="address_line1"
                value={customerForm.address_line1}
                onChange={onChange}
                placeholder="123 Main Street"
            />

            <FormInput
                label="Address Line 2"
                id="address_line2"
                value={customerForm.address_line2}
                onChange={onChange}
                placeholder="Apt 4B, Suite 100"
            />

            <FormRow>
                <FormInput
                    label="City"
                    id="city"
                    value={customerForm.city}
                    onChange={onChange}
                    placeholder="New York"
                />
                <FormInput
                    label="State/Province"
                    id="state"
                    value={customerForm.state}
                    onChange={onChange}
                    placeholder="NY"
                />
            </FormRow>

            <FormRow>
                <FormInput
                    label="Country"
                    id="country"
                    value={customerForm.country}
                    onChange={onChange}
                    placeholder="US"
                />
                <FormInput
                    label="ZIP/Postal Code"
                    id="zip_code"
                    value={customerForm.zip_code}
                    onChange={onChange}
                    placeholder="10001"
                />
            </FormRow>

            <div style={{
                margin: '32px 0 20px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                    Shipping Address
                </h4>
                <button
                    type="button"
                    onClick={copyBillingToShipping}
                    className="action-btn"
                    style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                >
                    Copy from Billing
                </button>
            </div>

            <FormInput
                label="Address Line 1"
                id="shipping_address_line1"
                value={customerForm.shipping_address_line1}
                onChange={onChange}
                placeholder="123 Main Street"
            />

            <FormInput
                label="Address Line 2"
                id="shipping_address_line2"
                value={customerForm.shipping_address_line2}
                onChange={onChange}
                placeholder="Apt 4B, Suite 100"
            />

            <FormRow>
                <FormInput
                    label="City"
                    id="shipping_city"
                    value={customerForm.shipping_city}
                    onChange={onChange}
                    placeholder="New York"
                />
                <FormInput
                    label="State/Province"
                    id="shipping_state"
                    value={customerForm.shipping_state}
                    onChange={onChange}
                    placeholder="NY"
                />
            </FormRow>

            <FormRow>
                <FormInput
                    label="Country"
                    id="shipping_country"
                    value={customerForm.shipping_country}
                    onChange={onChange}
                    placeholder="US"
                />
                <FormInput
                    label="ZIP/Postal Code"
                    id="shipping_zip_code"
                    value={customerForm.shipping_zip_code}
                    onChange={onChange}
                    placeholder="10001"
                />
            </FormRow>
        </div>
    );

    return (
        <>
            <InlineTabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />

            <div className="customer-form">
                {activeTab === 'basic' && renderBasicFields()}
                {activeTab === 'preferences' && renderPreferencesFields()}
                {activeTab === 'address' && renderAddressFields()}
            </div>
        </>
    );
};

export default CustomerForm;