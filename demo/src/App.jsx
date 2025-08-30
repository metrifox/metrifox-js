import { checkAccess, recordUsage, embedCheckout } from 'metrifox-js';
import { useEffect, useState, useRef } from 'react';
import './App.css';
import metrifoxLogo from './assets/metrifox_logo.svg';
import CustomerManagement from './pages/CustomerManagement';
import CsvUpload from './pages/CsvUpload';

const App = ({ customerKey = 'cust-70ce1e51', featureKey = 'feature_forms', eventName = 'form.created' }) => {
    const containerRef = useRef(null);
    const [accessResponse, setAccessResponse] = useState(null);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('forms');

    const createForm = async () => {
        try {
            const access = await checkAccess({
                featureKey: featureKey,
                customerKey: customerKey
            });
            setAccessResponse(access);

            if (access.canAccess) {
                setMessage('Form created successfully!');
                await recordUsage({
                    customerKey: customerKey,
                    eventName: eventName
                });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage('Access denied - quota exceeded');
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred');
            setTimeout(() => setMessage(null), 3000);
        }
    };

    useEffect(() => {
        if (containerRef.current && activeTab === 'checkout') {
            embedCheckout({
                productKey: "product_fitflex+_4bea",
                container: containerRef.current
            });
        }
    }, [activeTab, containerRef.current]);

    return (
        <div className="app-container">
            {message && (
                <div className={`toast ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <header className="app-header">
                <div className="header-content">
                    <img src={metrifoxLogo} alt="Metrifox" className="metrifox-logo" />
                    <h1 className="app-title">SDK Demo</h1>
                </div>
                <p className="app-subtitle">Test the Metrifox JavaScript SDK with real API calls</p>
            </header>

            <div className="tab-navigation">
                <button
                    className={`tab-button ${activeTab === 'forms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('forms')}
                >
                    Feature Access & Usage
                </button>
                <button
                    className={`tab-button ${activeTab === 'customers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('customers')}
                >
                    Customer Management
                </button>
                <button
                    className={`tab-button ${activeTab === 'csv' ? 'active' : ''}`}
                    onClick={() => setActiveTab('csv')}
                >
                    CSV Import
                </button>
                <button
                    className={`tab-button ${activeTab === 'checkout' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checkout')}
                >
                    Embedded Checkout
                </button>
            </div>

            {activeTab === 'forms' && (
                <div className="content-wrapper">
                    <div className="main-content">
                        <h2 className="content-title">Create Form</h2>
                        <p className="content-description">
                            Test feature access control and usage tracking. This will check if the customer has access to create forms and record the usage.
                        </p>
                        <div className="form-details">
                            <div><strong>Customer:</strong> {customerKey}</div>
                            <div><strong>Feature:</strong> {featureKey}</div>
                            <div><strong>Event:</strong> {eventName}</div>
                        </div>
                        <button onClick={createForm} className="create-button">
                            Create Form
                        </button>
                    </div>

                    <div className="response-panel">
                        <h3 className="response-title">API Response</h3>
                        {accessResponse ? (
                            <div className="response-box">
                                <div><strong>Message:</strong> {accessResponse.message}</div>
                                <div>
                                    <strong>Can Access:</strong>
                                    <span className={accessResponse.canAccess ? 'access-yes' : 'access-no'}>
                                        {accessResponse.canAccess ? ' Yes' : ' No'}
                                    </span>
                                </div>
                                <div><strong>Customer:</strong> {accessResponse.customerId}</div>
                                <div><strong>Feature:</strong> {accessResponse.featureKey}</div>
                                <div><strong>Used:</strong> {accessResponse.usedQuantity}</div>
                                <div><strong>Quota:</strong> {accessResponse.quota}</div>
                                <div><strong>Included:</strong> {accessResponse.includedUsage}</div>
                                <div>
                                    <strong>Balance:</strong>
                                    <span className={accessResponse.balance < 0 ? 'balance-negative' : 'balance-positive'}>
                                        {accessResponse.balance}
                                    </span>
                                </div>
                                <div><strong>Reset:</strong> {new Date(accessResponse.nextResetAt * 1000).toLocaleString()}</div>
                                <div><strong>Unlimited:</strong> {accessResponse.unlimited ? 'Yes' : 'No'}</div>
                            </div>
                        ) : (
                            <div className="empty-response">
                                No response yet. Click "Create Form" to test the API.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'csv' && <CsvUpload />}

            {activeTab === 'checkout' && (
                <div className="checkout-container">
                    <h2 className="content-title">Embedded Checkout</h2>
                    <p className="content-description">
                        Test the embedded checkout functionality. The checkout will appear below.
                    </p>
                    <div ref={containerRef} className="checkout-embed"></div>
                </div>
            )}
        </div>
    );
};

export default App;