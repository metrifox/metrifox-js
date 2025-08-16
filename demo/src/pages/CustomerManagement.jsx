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
        customerType: 'INDIVIDUAL',
        primaryEmail: '',
        firstName: '',
        lastName: '',
        phone: '',
        legalName: '',
        displayName: '',
        customerKey: ''
    });

    const [customerResponse, setCustomerResponse] = useState(null);
    const [syncingCustomer, setSyncingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);

    const showMessage = (msg, type = 'info') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const resetForm = () => {
        setCustomerForm({
            customerType: 'INDIVIDUAL',
            primaryEmail: '',
            firstName: '',
            lastName: '',
            phone: '',
            legalName: '',
            displayName: '',
            customerKey: ''
        });
        setEditingCustomer(null);
        setCustomerResponse(null);
    };

    const openCreateModal = () => {
        resetForm();
        setModalOpen(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);
        setCustomerForm({
            customerType: customer.customerType,
            primaryEmail: customer.primaryEmail,
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            phone: customer.phone || '',
            legalName: customer.legalName || '',
            displayName: customer.displayName || '',
            customerKey: customer.customerKey
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

    const saveCustomer = async () => {
        try {
            const customerData = {
                event_name: editingCustomer ? 'customer.updated' : 'customer.created',
                data: {
                    primary_email: customerForm.primaryEmail,
                    customer_key: customerForm.customerKey,
                }
            };
            if (customerForm.firstName) customerData.data.first_name = customerForm.firstName;
            if (customerForm.lastName) customerData.data.last_name = customerForm.lastName;
            if (customerForm.legalName) customerData.data.legal_name = customerForm.legalName;
            if (customerForm.displayName) customerData.data.display_name = customerForm.displayName;
            if (customerForm.phone) customerData.data.primary_phone = customerForm.phone;
            if (customerForm.customerType) customerData.data.customer_type = customerForm.customerType;

            let response;
            if (editingCustomer) {
                response = await synchronizeCustomer(customerData);
                console.log("UPDATE RESPONSE FROM SDK CALL", response);

                // Update in local customers list
                setCustomers(prev => prev.map(c =>
                    c.id === editingCustomer.id
                        ? {
                            ...c,
                            customerKey: customerData.data.customer_key || c.customerKey,
                            primaryEmail: customerData.data.primary_email,
                            customerType: customerData.data.customer_type,
                            firstName: customerData.data.first_name,
                            lastName: customerData.data.last_name,
                            legalName: customerData.data.legal_name,
                            displayName: customerData.data.display_name,
                            phone: customerData.data.primary_phone,
                            lastSyncedAt: new Date().toISOString(),
                            metrifoxId: response?.data?.metrifox_id || c.metrifoxId,
                            syncStatus: 'synced'
                        }
                        : c
                ));

                showMessage('Customer Syned successfully!', 'success');
            } else {
                // Add to local customers list
                const newCustomer = {
                    event_name: editingCustomer ? 'customer.updated' : 'customer.created',
                    data: {
                        customer_key: customerData.data.customer_key || `cust-${Date.now()}`,
                        primary_email: customerData.data.primary_email,
                        customer_type: customerData.data.customer_type,
                        first_name: customerData.data.first_name,
                        last_name: customerData.data.last_name,
                        legal_name: customerData.data.legal_name,
                        display_name: customerData.data.display_name,
                        primary_phone: customerData.data.primary_phone
                    }
                };


                setCustomers(prev => [newCustomer, ...prev]);
                // Create new customer
                response = await synchronizeCustomer(customerData);
                console.log("SYNC RESPONSE FROM SDK CALL", response);
                showMessage('Customer Syned successfully!', 'success');
            }

            setCustomerResponse(response);
            closeModal();

        } catch (error) {
            console.error(error);
            showMessage(`${response.message}`, 'error');
        }
    };

    const syncCustomer = async (customer) => {
        setSyncingCustomer(customer.id);
        console.log("SYNCING CUSTOMER", customer)
        try {
            // Prepare customer data for sync
            const customerData = {
                event_name: 'customer.updated',
                data: {
                    primary_email: customer.primaryEmail,
                    customer_type: customer.customerType,
                    customer_key: customer.customerKey
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

            console.log("SYNC REQUEST PAYLOAD", customerData);

            const response = await synchronizeCustomer(customerData);
            console.log("SYNC RESPONSE", response);

            // Update customer in local state
            setCustomers(prev => prev.map(c =>
                c.id === customer.id
                    ? {
                        ...c,
                        lastSyncedAt: response?.data?.last_synced_at,
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
            // Delete from Metrifox
            await synchronizeCustomer({ event_name: 'customer.deleted', data: { customer_key: customer.customerKey } });
            console.log("DELETE RESPONSE", `Customer ${customer.customerKey} deleted`);

            // Remove from local customers list
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

    return (
        <div className="customer-management">
            {/* Toast Notification */}
            {message && (
                <div className={`toast ${message.type === 'success' ? 'success' : message.type === 'error' ? 'error' : 'info'}`}>
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
                            <div className="table-cell">Customer</div>
                            <div className="table-cell">Type</div>
                            <div className="table-cell">Customer Key</div>
                            <div className="table-cell">Status</div>
                            <div className="table-cell">Last Synced</div>
                            <div className="table-cell">Actions</div>
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
                                    <span className={`type-badge type-${customer.customerType === 'INDIVIDUAL' ? 'individual' : 'business'}`}>
                                        {customer.customerType === 'INDIVIDUAL' ? <User size={12} /> : <Building size={12} />}
                                        {customer.customerType}
                                    </span>
                                </div>
                                <div className="table-cell">
                                    <code className="customer-key">{customer.customerKey}</code>
                                </div>
                                <div className="table-cell">
                                    {getStatusBadge(customer.syncStatus)}
                                </div>
                                <div className="table-cell">
                                    <span className="sync-date">{formatDate(customer.lastSyncedAt)}</span>
                                </div>
                                <div className="table-cell actions">
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn sync-btn"
                                            onClick={() => syncCustomer(customer)}
                                            disabled={syncingCustomer === customer.id}
                                            title="Sync with Metrifox"
                                        >
                                            <RefreshCw size={16} className={syncingCustomer === customer.id ? 'spinning' : ''} />
                                        </button>
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => openEditModal(customer)}
                                            title="Edit Customer"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => deleteCustomer(customer)}
                                            disabled={deletingCustomer === customer.id}
                                            title="Delete Customer"
                                        >
                                            <Trash2 size={16} />
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
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingCustomer ? 'Update Customer' : 'Create New Customer'}
                            </h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="customer-form">
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

                                <div className="form-group">
                                    <label htmlFor="primaryEmail">Email *</label>
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

                                {customerForm.customerType === 'INDIVIDUAL' ? (
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
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}

                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={customerForm.phone}
                                        onChange={handleCustomerInputChange}
                                        className="form-input"
                                        placeholder="+1234567890"
                                    />
                                </div>

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
                                        <div className="error-text"><strong>Error:</strong> {customerResponse.error}</div>
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