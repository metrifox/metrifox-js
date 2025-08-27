import { useState } from 'react';
import { synchronizeCustomer } from 'metrifox-js';
import { Plus, Edit2, Trash2, RefreshCw, X, User, Building } from 'lucide-react';

const CustomerManagement = () => {
    const [message, setMessage] = useState(null);
    const [customers, setCustomers] = useState([
        // Mock data - in real app this would come from your database
        {
            id: 1,
            customerKey: 'cust-70ce1e52',
            primaryEmail: 'jane.doe@example.com',
            customerType: 'INDIVIDUAL',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            lastSyncedAt: '2024-01-15T10:30:00Z',
            metrifoxId: 'mf_cust_123',
            syncStatus: 'synced'
        },
        {
            id: 2,
            customerKey: 'cust-business-457',
            primaryEmail: 'ceo@example-business.com',
            customerType: 'BUSINESS',
            legalName: 'Example Business LLC',
            displayName: 'Example Business',
            phone: '+1987654321',
            lastSyncedAt: null,
            metrifoxId: null,
            syncStatus: 'pending'
        }
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [customerForm, setCustomerForm] = useState({
        // Core fields
        customerType: 'INDIVIDUAL',
        customerKey: '',
        primaryEmail: '',
        primaryPhone: '',

        // Business fields
        legalName: '',
        displayName: '',
        legalNumber: '',
        taxIdentificationNumber: '',
        logoUrl: '',
        websiteUrl: '',
        accountManager: '',

        // Individual fields
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',

        // Shared fields
        billingEmail: '',

        // Preferences
        timezone: '',
        language: 'en',
        currency: 'USD',
        taxStatus: 1,

        // Address fields
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',

        // Shipping address fields
        shippingAddressLine1: '',
        shippingAddressLine2: '',
        shippingCity: '',
        shippingState: '',
        shippingCountry: '',
        shippingZipCode: ''
    });

    const [customerResponse, setCustomerResponse] = useState(null);
    const [syncingCustomer, setSyncingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    const showMessage = (msg, type = 'info') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const resetForm = () => {
        setCustomerForm({
            customerType: 'INDIVIDUAL',
            customerKey: '',
            primaryEmail: '',
            primaryPhone: '',
            legalName: '',
            displayName: '',
            legalNumber: '',
            taxIdentificationNumber: '',
            logoUrl: '',
            websiteUrl: '',
            accountManager: '',
            firstName: '',
            middleName: '',
            lastName: '',
            dateOfBirth: '',
            billingEmail: '',
            timezone: '',
            language: 'en',
            currency: 'USD',
            taxStatus: 1,
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            shippingAddressLine1: '',
            shippingAddressLine2: '',
            shippingCity: '',
            shippingState: '',
            shippingCountry: '',
            shippingZipCode: ''
        });
        setEditingCustomer(null);
        setCustomerResponse(null);
        setActiveTab('basic');
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setCustomerForm({
            customerType: customer.customerType,
            customerKey: customer.customerKey,
            primaryEmail: customer.primaryEmail,
            primaryPhone: customer.phone || '',
            firstName: customer.firstName || '',
            middleName: customer.middleName || '',
            lastName: customer.lastName || '',
            dateOfBirth: customer.dateOfBirth || '',
            legalName: customer.legalName || '',
            displayName: customer.displayName || '',
            legalNumber: customer.legalNumber || '',
            taxIdentificationNumber: customer.taxIdentificationNumber || '',
            logoUrl: customer.logoUrl || '',
            websiteUrl: customer.websiteUrl || '',
            accountManager: customer.accountManager || '',
            billingEmail: customer.billingEmail || '',
            timezone: customer.timezone || '',
            language: customer.language || 'en',
            currency: customer.currency || 'USD',
            taxStatus: customer.taxStatus || 1,
            addressLine1: customer.addressLine1 || '',
            addressLine2: customer.addressLine2 || '',
            city: customer.city || '',
            state: customer.state || '',
            country: customer.country || '',
            zipCode: customer.zipCode || '',
            shippingAddressLine1: customer.shippingAddressLine1 || '',
            shippingAddressLine2: customer.shippingAddressLine2 || '',
            shippingCity: customer.shippingCity || '',
            shippingState: customer.shippingState || '',
            shippingCountry: customer.shippingCountry || '',
            shippingZipCode: customer.shippingZipCode || ''
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
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
            shippingAddressLine1: prev.addressLine1,
            shippingAddressLine2: prev.addressLine2,
            shippingCity: prev.city,
            shippingState: prev.state,
            shippingCountry: prev.country,
            shippingZipCode: prev.zipCode
        }));
    };

    const saveCustomer = async () => {
        try {
            const customerData = {
                event_name: editingCustomer ? 'customer.updated' : 'customer.created',
                data: {
                    customer_key: customerForm.customerKey || `cust-${Date.now()}`,
                    customer_type: customerForm.customerType,
                    primary_email: customerForm.primaryEmail,
                }
            };

            // Add optional fields only if they have values
            const optionalFields = {
                primary_phone: customerForm.primaryPhone,
                legal_name: customerForm.legalName,
                display_name: customerForm.displayName,
                legal_number: customerForm.legalNumber,
                tax_identification_number: customerForm.taxIdentificationNumber,
                logo_url: customerForm.logoUrl,
                website_url: customerForm.websiteUrl,
                account_manager: customerForm.accountManager,
                first_name: customerForm.firstName,
                middle_name: customerForm.middleName,
                last_name: customerForm.lastName,
                date_of_birth: customerForm.dateOfBirth,
                billing_email: customerForm.billingEmail,
                timezone: customerForm.timezone,
                language: customerForm.language,
                currency: customerForm.currency,
                tax_status: customerForm.taxStatus,
                address_line1: customerForm.addressLine1,
                address_line2: customerForm.addressLine2,
                city: customerForm.city,
                state: customerForm.state,
                country: customerForm.country,
                zip_code: customerForm.zipCode,
                shipping_address_line1: customerForm.shippingAddressLine1,
                shipping_address_line2: customerForm.shippingAddressLine2,
                shipping_city: customerForm.shippingCity,
                shipping_state: customerForm.shippingState,
                shipping_country: customerForm.shippingCountry,
                shipping_zip_code: customerForm.shippingZipCode
            };

            Object.keys(optionalFields).forEach(key => {
                if (optionalFields[key]) {
                    customerData.data[key] = optionalFields[key];
                }
            });

            let response;
            if (editingCustomer) {
                response = await synchronizeCustomer(customerData);
                console.log("UPDATE RESPONSE FROM SDK CALL", response);

                // Update in local customers list
                setCustomers(prev => prev.map(c =>
                    c.id === editingCustomer.id
                        ? {
                            ...c,
                            ...customerData.data,
                            phone: customerData.data.primary_phone,
                            lastSyncedAt: new Date().toISOString(),
                            metrifoxId: response?.data?.metrifox_id || c.metrifoxId,
                            syncStatus: 'synced'
                        }
                        : c
                ));

                showMessage('Customer synced successfully!', 'success');
            } else {
                response = await synchronizeCustomer(customerData);

                const newCustomer = {
                    id: Date.now(),
                    ...customerData.data,
                    phone: customerData.data.primary_phone,
                    metrifoxId: response.data.metrifox_id,
                    syncStatus: 'synced',
                    lastSyncedAt: new Date().toISOString()
                };

                setCustomers(prev => [newCustomer, ...prev]);
                showMessage('Customer synced successfully!', 'success');
            }

            setCustomerResponse(response);
            closeModal();

        } catch (error) {
            console.error(error);
            showMessage(`Error: ${error.message}`, 'error');
        }
    };

    const syncCustomer = async (customer) => {
        setSyncingCustomer(customer.id);
        try {
            const customerData = {
                event_name: 'customer.updated',
                data: {
                    customer_key: customer.customerKey,
                    customer_type: customer.customerType,
                    primary_email: customer.primaryEmail
                }
            };

            if (customer.customerType === 'INDIVIDUAL') {
                if (customer.firstName) customerData.data.first_name = customer.firstName;
                if (customer.lastName) customerData.data.last_name = customer.lastName;
            } else {
                if (customer.legalName) customerData.data.legal_name = customer.legalName;
                if (customer.displayName) customerData.data.display_name = customer.displayName;
            }

            if (customer.phone) customerData.data.primary_phone = customer.phone;

            const response = await synchronizeCustomer(customerData);

            setCustomers(prev => prev.map(c =>
                c.id === customer.id
                    ? {
                        ...c,
                        lastSyncedAt: new Date().toISOString(),
                        metrifoxId: response?.data?.metrifox_id,
                        syncStatus: 'synced'
                    }
                    : c
            ));

            showMessage(`Customer ${customer.customerKey} synced successfully!`, 'success');
        } catch (error) {
            console.error(error);
            showMessage(`Failed to sync customer ${customer.customerKey}`, 'error');
        } finally {
            setSyncingCustomer(null);
        }
    };

    const deleteCustomer = async (customer) => {
        if (!window.confirm(`Are you sure you want to delete customer "${customer.customerKey}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingCustomer(customer.id);
        try {
            await synchronizeCustomer({ event_name: 'customer.deleted', data: { customer_key: customer.customerKey } });
            setCustomers(prev => prev.filter(c => c.id !== customer.id));
            showMessage(`Customer ${customer.customerKey} deleted successfully!`, 'success');
        } catch (error) {
            console.error(error);
            showMessage(`Failed to delete customer ${customer.customerKey}`, 'error');
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
                <label htmlFor="customerType">Customer Type</label>
                <select
                    id="customerType"
                    name="customerType"
                    value={customerForm.customerType}
                    onChange={handleCustomerInputChange}
                    className="form-select"
                >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                </select>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="primaryEmail">Primary Email *</label>
                    <input
                        type="email"
                        id="primaryEmail"
                        name="primaryEmail"
                        value={customerForm.primaryEmail}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="customer@example.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="primaryPhone">Primary Phone</label>
                    <input
                        type="tel"
                        id="primaryPhone"
                        name="primaryPhone"
                        value={customerForm.primaryPhone}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="+1234567890"
                    />
                </div>
            </div>

            {customerForm.customerType === 'INDIVIDUAL' ? (
                <>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={customerForm.firstName}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="John"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middleName">Middle Name</label>
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                value={customerForm.middleName}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="William"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={customerForm.lastName}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={customerForm.dateOfBirth}
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
                            <label htmlFor="legalName">Legal Name</label>
                            <input
                                type="text"
                                id="legalName"
                                name="legalName"
                                value={customerForm.legalName}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="Example Business LLC"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="displayName">Display Name</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={customerForm.displayName}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="Example Business"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="legalNumber">Legal Number</label>
                            <input
                                type="text"
                                id="legalNumber"
                                name="legalNumber"
                                value={customerForm.legalNumber}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="ABC123456789"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="taxIdentificationNumber">Tax ID Number</label>
                            <input
                                type="text"
                                id="taxIdentificationNumber"
                                name="taxIdentificationNumber"
                                value={customerForm.taxIdentificationNumber}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="12-3456789"
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="websiteUrl">Website URL</label>
                            <input
                                type="url"
                                id="websiteUrl"
                                name="websiteUrl"
                                value={customerForm.websiteUrl}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="accountManager">Account Manager</label>
                            <input
                                type="text"
                                id="accountManager"
                                name="accountManager"
                                value={customerForm.accountManager}
                                onChange={handleCustomerInputChange}
                                className="form-input"
                                placeholder="John Smith"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="form-group">
                <label htmlFor="customerKey">
                    Customer Key {editingCustomer ? '(Read-only)' : '(Optional)'}
                </label>
                <input
                    type="text"
                    id="customerKey"
                    name="customerKey"
                    value={customerForm.customerKey}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder={editingCustomer ? customerForm.customerKey : "Leave empty for auto-generation"}
                    readOnly={!!editingCustomer}
                />
            </div>
        </div>
    );

    const renderPreferencesFields = () => (
        <div className="form-section">
            <div className="form-group">
                <label htmlFor="billingEmail">Billing Email</label>
                <input
                    type="email"
                    id="billingEmail"
                    name="billingEmail"
                    value={customerForm.billingEmail}
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
                    <label htmlFor="taxStatus">Tax Status</label>
                    <select
                        id="taxStatus"
                        name="taxStatus"
                        value={customerForm.taxStatus}
                        onChange={handleCustomerInputChange}
                        className="form-select"
                    >
                        <option value={1}>Taxable</option>
                        <option value={0}>Tax Exempt</option>
                        <option value={2}>Reverse Charge</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderAddressFields = () => (
        <div className="form-section">
            <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', fontWeight: 600 }}>Billing Address</h4>

            <div className="form-group">
                <label htmlFor="addressLine1">Address Line 1</label>
                <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={customerForm.addressLine1}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="123 Main Street"
                />
            </div>

            <div className="form-group">
                <label htmlFor="addressLine2">Address Line 2</label>
                <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={customerForm.addressLine2}
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
                    <label htmlFor="zipCode">ZIP/Postal Code</label>
                    <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={customerForm.zipCode}
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
                <label htmlFor="shippingAddressLine1">Address Line 1</label>
                <input
                    type="text"
                    id="shippingAddressLine1"
                    name="shippingAddressLine1"
                    value={customerForm.shippingAddressLine1}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="123 Main Street"
                />
            </div>

            <div className="form-group">
                <label htmlFor="shippingAddressLine2">Address Line 2</label>
                <input
                    type="text"
                    id="shippingAddressLine2"
                    name="shippingAddressLine2"
                    value={customerForm.shippingAddressLine2}
                    onChange={handleCustomerInputChange}
                    className="form-input"
                    placeholder="Apt 4B, Suite 100"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="shippingCity">City</label>
                    <input
                        type="text"
                        id="shippingCity"
                        name="shippingCity"
                        value={customerForm.shippingCity}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="New York"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shippingState">State/Province</label>
                    <input
                        type="text"
                        id="shippingState"
                        name="shippingState"
                        value={customerForm.shippingState}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="NY"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="shippingCountry">Country</label>
                    <input
                        type="text"
                        id="shippingCountry"
                        name="shippingCountry"
                        value={customerForm.shippingCountry}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="US"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shippingZipCode">ZIP/Postal Code</label>
                    <input
                        type="text"
                        id="shippingZipCode"
                        name="shippingZipCode"
                        value={customerForm.shippingZipCode}
                        onChange={handleCustomerInputChange}
                        className="form-input"
                        placeholder="10001"
                    />
                </div>
            </div>
        </div>
    );

    // Update the return statement in CustomerManagement component to use CSS classes instead of Tailwind

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
                    <h1 className="page-title">Customer Management</h1>
                    <p className="page-subtitle">
                        Sync your existing customers with Metrifox to enable usage tracking and billing
                    </p>
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
                            <div>Last Synced</div>
                            <div>Actions</div>
                        </div>

                        {customers.map((customer) => (
                            <div key={customer.id} className="table-row">
                                <div className="table-cell customer-info">
                                    <div className="customer-name">
                                        {customer.customerType === 'INDIVIDUAL'
                                            ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unnamed'
                                            : customer.displayName || customer.legalName || 'Unnamed Business'
                                        }
                                    </div>
                                    <div className="customer-email">{customer.primaryEmail}</div>
                                </div>
                                <div className="table-cell">
                                <span className={`type-badge ${customer.customerType === 'INDIVIDUAL' ? 'type-individual' : 'type-business'}`}>
                                    {customer.customerType === 'INDIVIDUAL' ? <User size={10} /> : <Building size={10} />}
                                    {customer.customerType}
                                </span>
                                </div>
                                <div className="table-cell">
                                    <div className="customer-key">{customer.customerKey}</div>
                                </div>
                                <div className="table-cell">
                                    {getStatusBadge(customer.syncStatus)}
                                </div>
                                <div className="table-cell">
                                    <div className="sync-date">{formatDate(customer.lastSyncedAt)}</div>
                                    {customer.metrifoxId && (
                                        <div className="metrifox-id">{customer.metrifoxId}</div>
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

            {/* Modal - continue with CSS classes instead of Tailwind... */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingCustomer ? 'Update Customer' : 'Create New Customer'}
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
                                disabled={!customerForm.primaryEmail}
                            >
                                {editingCustomer ? 'Update' : 'Create'} & Sync
                            </button>
                        </div>

                        {/* Response Panel */}
                        {customerResponse && (
                            <div className="response-section">
                                <h3 className="section-title">API Response</h3>
                                <div className="response-box">
                                    <div><strong>Status:</strong> {customerResponse.statusCode}</div>
                                    <div><strong>Message:</strong> {customerResponse.message}</div>
                                    {customerResponse.data && (
                                        <>
                                            {customerResponse.data.metrifox_id && (
                                                <div><strong>Metrifox ID:</strong> {customerResponse.data.metrifox_id}</div>
                                            )}
                                            {customerResponse.data.customer_key && (
                                                <div><strong>Customer Key:</strong> {customerResponse.data.customer_key}</div>
                                            )}
                                            {customerResponse.data.last_synced_at && (
                                                <div><strong>Synced At:</strong> {formatDate(customerResponse.data.last_synced_at)}</div>
                                            )}
                                        </>
                                    )}
                                    {customerResponse.error && (
                                        <div><strong className="error-text">Error:</strong> <span className="error-text">{customerResponse.error}</span></div>
                                    )}
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