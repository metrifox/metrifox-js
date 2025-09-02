const ResponsePanel = ({ title, response, emptyMessage }) => {
    return (
        <div className="response-panel">
            <h3 className="response-title">{title}</h3>

            {response ? (
                <div className="response-box">
                    <div>
                        <strong>Can Access:</strong>
                        <span className={response.canAccess ? 'access-yes' : 'access-no'}>
              {response.canAccess ? 'Yes' : 'No'}
            </span>
                    </div>
                    <div>
                        <strong>Usage Count:</strong>
                        <span>{response.usageCount}</span>
                    </div>
                    <div>
                        <strong>Usage Limit:</strong>
                        <span>{response.usageLimit || 'Unlimited'}</span>
                    </div>
                    <div>
                        <strong>Balance:</strong>
                        <span className={response.currentBalance >= 0 ? 'balance-positive' : 'balance-negative'}>
              ${response.currentBalance?.toFixed(2)}
            </span>
                    </div>
                    {response.reason && (
                        <div>
                            <strong>Reason:</strong>
                            <span>{response.reason}</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-response">
                    {emptyMessage || 'No response data available'}
                </div>
            )}
        </div>
    );
};

export default ResponsePanel;