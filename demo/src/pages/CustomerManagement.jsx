import { useState } from 'react';
import { createCustomer, updateCustomer, deleteCustomer as SDKDeleteCustomer } from 'metrifox-js';
import { Plus, Edit2, Trash2, RefreshCw, X, User, Building } from 'lucide-react';

const CustomerManagement = () => {
    const [message, setMessage] = useState(null);
    const [customers, setCustomers] = useState([
        // Mock data - in real app this would come from your database
        {
            id: 1,
            customer_key: 'cust-70ce1e52',
            primary_email: 'jane.doe@example.com',
            customer_type: 'INDIVIDUAL',
            first_name: 'Jane',
            last_name: 'Doe',
            primary_phone: '+1234567890',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            currency: 'USD',
            language: 'en',
            tax_status: 'TAXABLE',
            metrifoxId: 'mf_cust_123',
            syncStatus: 'synced'
        },
        {
            id: 2,
            customer_key: 'cust-business-457',
            primary_email: 'ceo@example-business.com',
            customer_type: 'BUSINESS',
            legal_name: 'Example Business LLC',
            display_name: 'Example Business',
            primary_phone: '+1987654321',
            created_at: '2024-01-10T08:15:00Z',
            updated_at: null,
            currency: 'USD',
            language: 'en',
            tax_status: 'REVERSE_CHARGE',
            metrifoxId: null,
            syncStatus: 'pending'
        }
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [customerForm, setCustomerForm] = useState(getEmptyForm());
    const [customerResponse, setCustomerResponse] = useState(null);
    const [syncingCustomer, setSyncingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    function getEmptyForm() {
        return {
            // Core fields
            customer_type: 'INDIVIDUAL',
            customer_key: '',
            primary_email: '',
            primary_phone: '',

            // Business fields
            legal_name: '',
            display_name: '',
            legal_number: '',
            tax_identification_number: '',
            logo_url: '',
            website_url: '',
            account_manager: '',

            // Individual fields
            first_name: '',
            middle_name: '',
            last_name: '',
            date_of_birth: '',

            // Shared fields
            billing_email: '',

            // Preferences
            timezone: '',
            language: 'en',
            currency: 'USD',
            tax_status: 'TAXABLE',

            // Address fields
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            country: '',
            zip_code: '',

            // Shipping address fields
            shipping_address_line1: '',
            shipping_address_line2: '',
            shipping_city: '',
            shipping_state: '',
            shipping_country: '',
            shipping_zip_code: ''
        };
    }

    function mapCustomerToForm(customer) {
        return {
            customer_type: customer.customer_type,
            customer_key: customer.customer_key,
            primary_email: customer.primary_email || '',
            primary_phone: customer.primary_phone || '',
            first_name: customer.first_name || '',
            middle_name: customer.middle_name || '',
            last_name: customer.last_name || '',
            date_of_birth: customer.date_of_birth || '',
            legal_name: customer.legal_name || '',
            display_name: customer.display_name || '',
            legal_number: customer.legal_number || '',
            tax_identification_number: customer.tax_identification_number || '',
            logo_url: customer.logo_url || '',
            website_url: customer.website_url || '',
            account_manager: customer.account_manager || '',
            billing_email: customer.billing_email || '',
            timezone: customer.timezone || '',
            language: customer.language || 'en',
            currency: customer.currency || 'USD',
            tax_status: customer.tax_status || 'TAXABLE',
            address_line1: customer.address_line1 || '',
            address_line2: customer.address_line2 || '',
            city: customer.city || '',
            state: customer.state || '',
            country: customer.country || '',
            zip_code: customer.zip_code || '',
            shipping_address_line1: customer.shipping_address_line1 || '',
            shipping_address_line2: customer.shipping_address_line2 || '',
            shipping_city: customer.shipping_city || '',
            shipping_state: customer.shipping_state || '',
            shipping_country: customer.shipping_country || '',
            shipping_zip_code: customer.shipping_zip_code || ''
        };
    }

    const showMessage = (msg, type = 'info') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // Generate auto customer key
    const generateCustomerKey = () => {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substr(2, 8);
        return `cust-${timestamp}-${randomPart}`;
    };

    const resetForm = () => {
        setCustomerForm(getEmptyForm());
        setEditingCustomer(null);
        setIsEditMode(false);
        setCustomerResponse(null);
        setActiveTab('basic');
    };

    const openCreateModal = () => {
        resetForm();
        // Auto-generate customer key for new customers
        setCustomerForm(prev => ({
            ...prev,
            customer_key: generateCustomerKey()
        }));
        setModalOpen(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setIsEditMode(true);
        setCustomerForm(mapCustomerToForm(customer));
        setModalOpen(true);
        setActiveTab('basic');
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeout(() => resetForm(), 150); // Small delay for smooth close animation
    };

    const handleCustomerInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const copyBillingToShipping = () => {
        setCustomerForm(prev => ({
            ...prev,
            shipping_address_line1: prev.address_line1,
            shipping_address_line2: prev.address_line2,
            shipping_city: prev.city,
            shipping_state: prev.state,
            shipping_country: prev.country,
            shipping_zip_code: prev.zip_code
        }));
    };

    const buildApiPayload = () => {
        const payload = {
            customer_key: customerForm.customer_key || `cust-${Date.now()}`,
            customer_type: customerForm.customer_type,
            primary_email: customerForm.primary_email,
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
            if (customerForm[field]) {
                payload[field] = customerForm[field];
            }
        });

        return payload;
    };

    const createNewCustomer = async () => {
        try {
            const customerData = buildApiPayload();
            const response = await createCustomer(customerData);

            // Map API response to local state format
            const newCustomer = {
                id: Date.now(),
                ...response.data, // API response data
                metrifoxId: response.data.id,
                syncStatus: 'synced'
            };

            setCustomers(prev => [newCustomer, ...prev]);
            setCustomerResponse(response);
            showMessage('Customer created and synced successfully!', 'success');

        } catch (error) {
            console.error('Create customer error:', error);
            showMessage(`Error creating customer: ${error.message}`, 'error');
            throw error;
        }
    };

    const updateExistingCustomer = async () => {
        try {
            const customerData = buildApiPayload();
            const response = await updateCustomer(customerData.customer_key, customerData);

            // Update local customers list with response data
            setCustomers(prev => prev.map(c =>
                c.id === editingCustomer.id
                    ? {
                        ...c,
                        ...response.data, // Merge API response
                        updated_at: new Date().toISOString(),
                        syncStatus: 'synced'
                    }
                    : c
            ));

            setCustomerResponse(response);
            showMessage('Customer updated and synced successfully!', 'success');

        } catch (error) {
            console.error('Update customer error:', error);
            showMessage(`Error updating customer: ${error.message}`, 'error');
            throw error;
        }
    };

    const saveCustomer = async () => {
        try {
            if (isEditMode) {
                await updateExistingCustomer();
            } else {
                await createNewCustomer();
            }

            // Don't close modal immediately so user can see the response
            // closeModal();
        } catch (error) {
            // Error is already handled in the respective functions
        }
    };

    const syncCustomer = async (customer) => {
        setSyncingCustomer(customer.id);
        try {
            const customerData = {
                customer_key: customer.customer_key,
                customer_type: customer.customer_type,
                primary_email: customer.primary_email
            };

            if (customer.customer_type === 'INDIVIDUAL') {
                if (customer.first_name) customerData.first_name = customer.first_name;
                if (customer.last_name) customerData.last_name = customer.last_name;
            } else {
                if (customer.legal_name) customerData.legal_name = customer.legal_name;
                if (customer.display_name) customerData.display_name = customer.display_name;
            }

            if (customer.primary_phone) customerData.primary_phone = customer.primary_phone;

            const response = await updateCustomer(customer.customer_key, customerData);

            setCustomers(prev => prev.map(c =>
                c.id === customer.id
                    ? {
                        ...c,
                        ...response.data,
                        updated_at: new Date().toISOString(),
                        syncStatus: 'synced'
                    }
                    : c
            ));

            showMessage(`Customer ${customer.customer_key} synced successfully!`, 'success');
        } catch (error) {
            console.error(error);
            showMessage(`Failed to sync customer ${customer.customer_key}: ${error.message}`, 'error');
        } finally {
            setSyncingCustomer(null);
        }
    };

    const deleteCustomer = async (customer) => {
        if (!window.confirm(`Are you sure you want to delete customer "${customer.customer_key}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingCustomer(customer.id);
        try {
            await SDKDeleteCustomer({ customer_key: customer.customer_key });
            setCustomers(prev => prev.filter(c => c.customer_key !== customer.customer_key));
            showMessage(`Customer ${customer.customer_key} deleted successfully!`, 'success');
        } catch (error) {
            console.error(error);
            showMessage(`Failed to delete customer ${customer.customer_key}: ${error.message}`, 'error');
        } finally {
            setDeletingCustomer(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            synced: { class: 'status-synced', text: 'Synced' },
            pending: { class: 'status-pending', text: 'Pending' },
            error: { class: 'status-error', text: 'Error' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    const renderBasicFields = () => (
        <div className="form-section">
            <div className="form-group">
                <label htmlFor="customer_type">Customer Type</label>
                <select
                    id="customer_type"
                    name="customer_type"
                    value={customerForm.customer_type}
                    onChange={handleCustomerInputChange}
                    className="form-select"
                    disabled={isEditMode}
                >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                </select>
                {isEditMode && (
                    <small className="form-help">Customer type cannot be changed after creation</small>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="primary_email">Primary Email *</label>
                    <input
                        type="email"
                        id="primary_email"
                        name="primary_email"
                        value={customerForm.primary_email}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="customer@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="primary_phone">Primary Phone</label>
                    <input
                        type="tel"
                        id="primary_phone"
                        name="primary_phone"
                        value={customerForm.primary_phone}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="+1234567890"
                    />
                </div>
            </div>

            {customerForm.customer_type === 'INDIVIDUAL' ? (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={customerForm.first_name}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="John"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle_name">Middle Name</label>
                            <input
                                type="text"
                                id="middle_name"
                                name="middle_name"
                                value={customerForm.middle_name}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="William"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={customerForm.last_name}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                value={customerForm.date_of_birth}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="legal_name">Legal Name</label>
                            <input
                                type="text"
                                id="legal_name"
                                name="legal_name"
                                value={customerForm.legal_name}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="Example Business LLC"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="display_name">Display Name</label>
                            <input
                                type="text"
                                id="display_name"
                                name="display_name"
                                value={customerForm.display_name}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="Example Business"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="legal_number">Legal Number</label>
                            <input
                                type="text"
                                id="legal_number"
                                name="legal_number"
                                value={customerForm.legal_number}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="ABC123456789"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tax_identification_number">Tax ID Number</label>
                            <input
                                type="text"
                                id="tax_identification_number"
                                name="tax_identification_number"
                                value={customerForm.tax_identification_number}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="12-3456789"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="website_url">Website URL</label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url"
                                value={customerForm.website_url}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="account_manager">Account Manager</label>
                            <input
                                type="text"
                                id="account_manager"
                                name="account_manager"
                                value={customerForm.account_manager}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="John Smith"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="form-group">
                <label htmlFor="customer_key">
                    Customer Key (Read-only)
                </label>
                <input
                    type="text"
                    id="customer_key"
                    name="customer_key"
                    value={customerForm.customer_key}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder={customerForm.customer_key}
                    readOnly={true}
                />
                {isEditMode && (
                    <small className="form-help">Customer key cannot be changed after creation</small>
                )}
            </div>
        </div>
    );

    const renderPreferencesFields = () => (
        <div className="form-section">
            <div className="form-group">
                <label htmlFor="billing_email">Billing Email</label>
                <input
                    type="email"
                    id="billing_email"
                    name="billing_email"
                    value={customerForm.billing_email}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="billing@example.com"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="language">Language</label>
                    <select
                        id="language"
                        name="language"
                        value={customerForm.language}
                        onChange={handleCustomerInputChange}
                        className="form-select"
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="currency">Currency</label>
                    <select
                        id="currency"
                        name="currency"
                        value={customerForm.currency}
                        onChange={handleCustomerInputChange}
                        className="form-select"
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="timezone">Timezone</label>
                    <select
                        id="timezone"
                        name="timezone"
                        value={customerForm.timezone}
                        onChange={handleCustomerInputChange}
                        className="form-select"
                    >
                        <option value="">Select Timezone</option>
                        <option value="America/New_York">Eastern Time (EST/EDT)</option>
                        <option value="America/Chicago">Central Time (CST/CDT)</option>
                        <option value="America/Denver">Mountain Time (MST/MDT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                        <option value="America/Toronto">Toronto</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Europe/Berlin">Berlin</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Australia/Sydney">Sydney</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="tax_status">Tax Status</label>
                    <select
                        id="tax_status"
                        name="tax_status"
                        value={customerForm.tax_status}
                        onChange={handleCustomerInputChange}
                        className="form-select"
                    >
                        <option value="REVERSE_CHARGE">Reverse Charge</option>
                        <option value="TAX_EXEMPT">Tax Exempt</option>
                        <option value="TAXABLE">Taxable</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderAddressFields = () => (
        <div className="form-section">
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600 }}>Billing Address</h4>

            <div className="form-group">
                <label htmlFor="address_line1">Address Line 1</label>
                <input
                    type="text"
                    id="address_line1"
                    name="address_line1"
                    value={customerForm.address_line1}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="123 Main Street"
                />
            </div>

            <div className="form-group">
                <label htmlFor="address_line2">Address Line 2</label>
                <input
                    type="text"
                    id="address_line2"
                    name="address_line2"
                    value={customerForm.address_line2}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="Apt 4B, Suite 100"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={customerForm.city}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="New York"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State/Province</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={customerForm.state}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="NY"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={customerForm.country}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="US"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="zip_code">ZIP/Postal Code</label>
                    <input
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        value={customerForm.zip_code}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="10001"
                    />
                </div>
            </div>

            <div style={{ margin: '32px 0 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Shipping Address</h4>
                <button
                    type="button"
                    onClick={copyBillingToShipping}
                    className="action-btn"
                    style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '6px' }}
                >
                    Copy from Billing
                </button>
            </div>

            <div className="form-group">
                <label htmlFor="shipping_address_line1">Address Line 1</label>
                <input
                    type="text"
                    id="shipping_address_line1"
                    name="shipping_address_line1"
                    value={customerForm.shipping_address_line1}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="123 Main Street"
                />
            </div>

            <div className="form-group">
                <label htmlFor="shipping_address_line2">Address Line 2</label>
                <input
                    type="text"
                    id="shipping_address_line2"
                    name="shipping_address_line2"
                    value={customerForm.shipping_address_line2}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="Apt 4B, Suite 100"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="shipping_city">City</label>
                    <input
                        type="text"
                        id="shipping_city"
                        name="shipping_city"
                        value={customerForm.shipping_city}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="New York"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shipping_state">State/Province</label>
                    <input
                        type="text"
                        id="shipping_state"
                        name="shipping_state"
                        value={customerForm.shipping_state}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="NY"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="shipping_country">Country</label>
                    <input
                        type="text"
                        id="shipping_country"
                        name="shipping_country"
                        value={customerForm.shipping_country}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="US"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shipping_zip_code">ZIP/Postal Code</label>
                    <input
                        type="text"
                        id="shipping_zip_code"
                        name="shipping_zip_code"
                        value={customerForm.shipping_zip_code}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="10001"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="customer-management">
            {/* Toast Notification */}
            {message && (
                <div className={`toast ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>Customer Management</h1>
                    <p>Sync your existing customers with Metrifox to enable usage tracking and billing</p>
                </div>
                <button className="create-customer-btn" onClick={openCreateModal}>
                    <Plus size={20} />
                    Add Customer
                </button>
            </div>

            {/* Customer List */}
            <div className="customer-list-container">
                <div className="list-header">
                    <h2 className="list-title">All Customers ({customers.length})</h2>
                </div>

                {customers.length > 0 ? (
                    <div className="customers-table">
                        <div className="table-header">
                            <div>Customer</div>
                            <div>Type</div>
                            <div>Customer Key</div>
                            <div>Status</div>
                            <div>Last Updated</div>
                            <div>Actions</div>
                        </div>

                        {customers.map((customer) => (
                            <div key={customer.id} className="table-row">
                                <div className="table-cell customer-info">
                                    <div className="customer-name">
                                        {customer.customer_type === 'INDIVIDUAL'
                                            ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unnamed'
                                            : customer.display_name || customer.legal_name || 'Unnamed Business'
                                        }
                                    </div>
                                    <div className="customer-email">{customer.primary_email}</div>
                                </div>
                                <div className="table-cell">
                                    <span className={`type-badge ${customer.customer_type === 'INDIVIDUAL' ? 'type-individual' : 'type-business'}`}>
                                        {customer.customer_type === 'INDIVIDUAL' ? <User size={10} /> : <Building size={10} />}
                                        {customer.customer_type}
                                    </span>
                                </div>
                                <div className="table-cell">
                                    <div className="customer-key">{customer.customer_key}</div>
                                </div>
                                <div className="table-cell">
                                    {getStatusBadge(customer.syncStatus)}
                                </div>
                                <div className="table-cell">
                                    <div className="sync-date">{formatDate(customer.updated_at || customer.created_at)}</div>
                                    {customer.metrifoxId && (
                                        <div className="metrifox-id">ID: {customer.metrifoxId}</div>
                                    )}
                                </div>
                                <div className="table-cell actions">
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn sync-btn"
                                            onClick={() => syncCustomer(customer)}
                                            disabled={syncingCustomer === customer.id}
                                            title="Sync with Metrifox"
                                        >
                                            <RefreshCw size={14} className={syncingCustomer === customer.id ? 'spinning' : ''} />
                                        </button>
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => openEditModal(customer)}
                                            title="Edit Customer"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => deleteCustomer(customer)}
                                            disabled={deletingCustomer === customer.id}
                                            title="Delete Customer"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>No customers yet</h3>
                        <p>Create your first customer to get started with Metrifox sync</p>
                        <button className="create-customer-btn" onClick={openCreateModal}>
                            <Plus size={20} />
                            Add Customer
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {isEditMode ? 'Update Customer' : 'Create New Customer'}
                            </h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Tab Navigation */}
                            <div className="tab-navigation">
                                <button
                                    className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('basic')}
                                >
                                    Basic Information
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('preferences')}
                                >
                                    Preferences
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('address')}
                                >
                                    Address Information
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="customer-form">
                                {activeTab === 'basic' && renderBasicFields()}
                                {activeTab === 'preferences' && renderPreferencesFields()}
                                {activeTab === 'address' && renderAddressFields()}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                            <button
                                onClick={saveCustomer}
                                className="save-btn"
                                disabled={!customerForm.primary_email}
                            >
                                {isEditMode ? 'Update' : 'Create'} & Sync
                            </button>
                        </div>

                        {/* Response Panel */}
                        {customerResponse && (
                            <div className="response-section">
                                <h3 className="section-title">API Response</h3>
                                <div className="response-box">
                                    <div><strong>Status:</strong> {customerResponse.statusCode || 'Success'}</div>
                                    <div><strong>Message:</strong> {customerResponse.message || 'Operation completed successfully'}</div>
                                    {customerResponse.data && (
                                        <>
                                            {customerResponse.data.id && (
                                                <div><strong>Metrifox ID:</strong> {customerResponse.data.id}</div>
                                            )}
                                            {customerResponse.data.customer_key && (
                                                <div><strong>Customer Key:</strong> {customerResponse.data.customer_key}</div>
                                            )}
                                            {customerResponse.data.updated_at && (
                                                <div><strong>Last Updated:</strong> {formatDate(customerResponse.data.updated_at)}</div>
                                            )}
                                        </>
                                    )}
                                    {customerResponse.error && (
                                        <div><strong className="error-text">Error:</strong> <span className="error-text">{customerResponse.error}</span></div>
                                    )}
                                    <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb'}}>
                                        <button
                                            className="cancel-btn"
                                            onClick={closeModal}
                                            style={{fontSize: '0.75rem', padding: '6px 12px'}}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;