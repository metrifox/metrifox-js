import { checkAccess, recordUsage, embedCheckout } from 'metrifox-js';
import { useEffect, useState, useRef } from 'react';
import './App.css';
import metrifoxLogo from './metrifox_logo.svg';

const App = () => {
    const containerRef = useRef(null);
    const [accessResponse, setAccessResponse] = useState(null)
    const [message, setMessage] = useState(null)

    const createForm = async () => {
        try {
            const access = await checkAccess({
                featureKey: 'feature_forms',
                customerKey: 'cust-70ce1e51'
            })
            setAccessResponse(access)

            if (access.can_access) {
                setMessage('Form created successfully!')
                await recordUsage({
                    customerKey: 'cust-70ce1e51',
                    eventName: 'form.created'
                    // amount defaults to 1, no need to specify unless above 1
                })
                // Clear the message after 3 seconds
                setTimeout(() => setMessage(null), 3000)
            } else {
                setMessage('Access denied - quota exceeded')
                // Clear the message after 3 seconds
                setTimeout(() => setMessage(null), 3000)
            }
        } catch (error) {
            console.error(error)
            setMessage('An error occurred')
            setTimeout(() => setMessage(null), 3000)
        }
    }

    useEffect(() => {
        if (containerRef.current) {
            embedCheckout(
                {
                    productId: "34cc99f1-1de8-41a3-a374-7744e2e14c2e",
                    container: containerRef.current
                }
            )
        }
    }, [containerRef.current])

    return (
        <div className="app-container">
            {/* Toast Notification */}
            {message && (
                <div className={`toast ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Header with Logo and Title */}
            <header className="app-header">
                <div className="header-content">
                    <img src={metrifoxLogo} alt="Metrifox" className="metrifox-logo" />
                    <h1 className="app-title">SDK Demo</h1>
                </div>
                <p className="app-subtitle">Test the Metrifox JavaScript SDK with real API calls</p>
            </header>

            {/* Main Content */}
            <div className="content-wrapper">
                <div className="main-content">
                    <h2 className="content-title">Create Form</h2>
                    <p className="content-description">
                        Test feature access control and usage tracking. This will check if the customer has access to create forms and record the usage.
                    </p>
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
                                <span className={accessResponse.can_access ? 'access-yes' : 'access-no'}>
                                    {accessResponse.can_access ? ' Yes' : ' No'}
                                </span>
                            </div>
                            <div><strong>Customer:</strong> {accessResponse.customer_key}</div>
                            <div><strong>Feature:</strong> {accessResponse.feature_key}</div>
                            <div><strong>Used:</strong> {accessResponse.used_quantity}</div>
                            <div><strong>Quota:</strong> {accessResponse.quota}</div>
                            <div><strong>Included:</strong> {accessResponse.included_usage}</div>
                            <div>
                                <strong>Balance:</strong>
                                <span className={accessResponse.balance < 0 ? 'balance-negative' : 'balance-positive'}>
                                    {accessResponse.balance}
                                </span>
                            </div>
                            <div><strong>Reset:</strong> {new Date(accessResponse.next_reset_at).toLocaleString()}</div>
                            <div><strong>Unlimited:</strong> {accessResponse.unlimited ? 'Yes' : 'No'}</div>
                        </div>
                    ) : (
                        <div className="empty-response">
                            No response yet. Click "Create Form" to test the API.
                        </div>
                    )}
                </div>
            </div>
            <div ref={containerRef} ></div>
        </div>
    )
}

export default App;