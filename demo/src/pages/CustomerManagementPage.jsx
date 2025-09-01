import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, X, User, Building } from 'lucide-react';
import Modal from '../components/common/Modal';
import CustomerForm from '../components/customers/CustomerForm';
import CustomerTable from '../components/customers/CustomerTable';

const CustomerManagementPage = () => {
    const [message, setMessage] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        limit_value: 50,
        total_count: 0,
        total_pages: 0,
        next_page: null,
        prev_page: null
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [customerForm, setCustomerForm] = useState(getEmptyForm());
    const [customerResponse, setCustomerResponse] = useState(null);
    const [syncingCustomer, setSyncingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);

    // Fetch customers from API
    const fetchCustomers = async (page = 1, search = '') => {
        try {
            setLoading(true);
            const client = window.metrifoxClient;
            const response = await client.customers.list({
                page,
                per_page: pagination.limit_value,
                search_term: search || undefined
            });

            if (response.statusCode === 200) {
                // Map API response to local format
                const mappedCustomers = response.data.map(customer => ({
                    id: customer.id,
                    customer_key: customer.customer_key,
                    customer_type: customer.customer_type,
                    primary_email: customer.primary_email,
                    primary_phone: customer.primary_phone,
                    first_name: customer.first_name,
                    middle_name: customer.middle_name,
                    last_name: customer.last_name,
                    legal_name: customer.legal_name,
                    display_name: customer.display_name,
                    created_at: customer.created_at,
                    updated_at: customer.updated_at,
                    metrifoxId: customer.id, // Use the actual customer ID as metrifox ID
                    syncStatus: 'synced' // All customers from API are synced
                }));

                setCustomers(mappedCustomers);
                setPagination(response.meta);
                showMessage(`Loaded ${mappedCustomers.length} customers`, 'success');
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            showMessage(`Failed to load customers: ${error.message}`, 'error');
            // Fallback to empty array on error
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    // Load customers on component mount
    useEffect(() => {
        fetchCustomers();
    }, []);
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
        if (name === 'shipping_fields') {
            // Handle bulk shipping field updates
            setCustomerForm(prev => ({
                ...prev,
                ...value
            }));
        } else {
            setCustomerForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
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
            const client = window.metrifoxClient;
            const customerData = buildApiPayload();
            const response = await client.customers.create(customerData);

            setCustomerResponse(response);
            showMessage('Customer created and synced successfully!', 'success');
            
            // Refresh customer list to show the new customer
            await fetchCustomers();

        } catch (error) {
            console.error('Create customer error:', error);
            showMessage(`Error creating customer: ${error.message}`, 'error');
            throw error;
        }
    };

    const updateExistingCustomer = async () => {
        try {
            const client = window.metrifoxClient;
            const customerData = buildApiPayload();
            const response = await client.customers.update(customerData.customer_key, customerData);

            setCustomerResponse(response);
            showMessage('Customer updated and synced successfully!', 'success');
            
            // Refresh customer list to show updated data
            await fetchCustomers();

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

            const response = await window.metrifoxClient.customers.update(customer.customer_key, customerData);

            showMessage(`Customer ${customer.customer_key} synced successfully!`, 'success');
            
            // Refresh customer list to show updated sync status
            await fetchCustomers();
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
            await window.metrifoxClient.customers.delete(customer.customer_key);
            showMessage(`Customer ${customer.customer_key} deleted successfully!`, 'success');
            
            // Refresh customer list to remove deleted customer
            await fetchCustomers();
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
            <CustomerTable
                customers={customers}
                loading={loading}
                onEdit={openEditModal}
                onSync={syncCustomer}
                onDelete={deleteCustomer}
                syncingCustomer={syncingCustomer}
                deletingCustomer={deletingCustomer}
                formatDate={formatDate}
                onCreateNew={openCreateModal}
            />

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={isEditMode ? 'Update Customer' : 'Create New Customer'}
                footer={
                    <>
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
                    </>
                }
            >
                <CustomerForm
                    customerForm={customerForm}
                    onChange={handleCustomerInputChange}
                    isEditMode={isEditMode}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                
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
            </Modal>
        </div>
    );
};

export default CustomerManagementPage;