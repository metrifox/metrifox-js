import { Edit2, Trash2, RefreshCw, User, Building, Plus } from 'lucide-react';

const CustomerTable = ({
                           customers,
                           loading,
                           onEdit,
                           onDelete,
                           onSync,
                           onCreateNew,
                           syncingCustomer,
                           deletingCustomer,
                           formatDate: externalFormatDate
                       }) => {
    // Use external formatDate if provided, otherwise use default
    const formatDate = externalFormatDate || ((dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString();
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            synced: { class: 'status-synced', text: 'Synced' },
            pending: { class: 'status-pending', text: 'Pending' },
            error: { class: 'status-error', text: 'Error' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    if (loading) {
        return (
            <div className="customer-list-container">
                <div className="list-header">
                    <h2 className="list-title">Loading customers...</h2>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner">
                        <RefreshCw size={24} className="spinning" />
                    </div>
                    <p>Fetching your customers from Metrifox...</p>
                </div>
            </div>
        );
    }

    if (customers.length === 0) {
        return (
            <div className="customer-list-container">
                <div className="list-header">
                    <h2 className="list-title">All Customers (0)</h2>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No customers yet</h3>
                    <p>Create your first customer to get started with Metrifox sync</p>
                    <button className="create-customer-btn" onClick={onCreateNew}>
                        <Plus size={20} />
                        Add Customer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="customer-list-container">
            <div className="list-header">
                <h2 className="list-title">All Customers ({customers.length})</h2>
            </div>

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
                                    onClick={() => onSync(customer)}
                                    disabled={syncingCustomer === customer.id}
                                    title="Sync with Metrifox"
                                >
                                    <RefreshCw size={14} className={syncingCustomer === customer.id ? 'spinning' : ''} />
                                </button>
                                <button
                                    className="action-btn edit-btn"
                                    onClick={() => onEdit(customer)}
                                    title="Edit Customer"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    className="action-btn delete-btn"
                                    onClick={() => onDelete(customer)}
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
        </div>
    );
};

export default CustomerTable;