import React, { useState } from 'react';
import Button from '../components/common/Button';
import ResponsePanel from '../components/common/ResponsePanel';

const FeatureAccessPage = ({ customerKey, featureKey, eventName, showToast }) => {
    const [accessResponse, setAccessResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCreateForm = async () => {
        setLoading(true);
        try {
            const client = window.metrifoxClient;
            const access = await client.usages.checkAccess({
                featureKey,
                customerKey
            });

            setAccessResponse(access);

            if (access.canAccess) {
                showToast('Form created successfully!', 'success');
                await client.usages.recordUsage({
                    customerKey,
                    eventName
                });
            } else {
                showToast('Access denied - quota exceeded', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('An error occurred', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feature-access-page">
            <div className="content-wrapper">
                <div className="main-content">
                    <h2 className="content-title">Create Form</h2>
                    <p className="content-description">
                        Test feature access control and usage tracking. This will check if the customer
                        has access to create forms and record the usage.
                    </p>

                    <div className="form-details">
                        <div><strong>Customer:</strong> {customerKey}</div>
                        <div><strong>Feature:</strong> {featureKey}</div>
                        <div><strong>Event:</strong> {eventName}</div>
                    </div>

                    <Button
                        onClick={handleCreateForm}
                        loading={loading}
                        size="large"
                    >
                        Create Form
                    </Button>
                </div>

                <ResponsePanel
                    title="API Response"
                    response={accessResponse}
                    emptyMessage="No response yet. Click 'Create Form' to test the API."
                />
            </div>
        </div>
    );
};

export default FeatureAccessPage;