import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { downloadTemplate } from '../../utils/helpers';

const CsvUpload = ({ showToast }) => {
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            showToast('Please select a CSV file', 'error');
            return;
        }

        setUploading(true);
        setResults(null);

        try {
            const client = window.metrifoxClient;
            const response = await client.customers.uploadCsv(file);
            setResults(response.data);
            showToast(response.message, 'success');
        } catch (error) {
            console.error('Upload failed:', error);
            showToast('Upload failed: ' + error.message, 'error');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="csv-upload-container">
            <div className="upload-section">
                <h2 className="content-title">Bulk Customer Import</h2>
                <p className="content-description">
                    Upload a CSV file to sync multiple customers at once. Download the template to see the required format.
                </p>

                <div className="upload-actions">
                    <button
                        className="template-btn"
                        onClick={downloadTemplate}
                        type="button"
                    >
                        <FileText size={20} />
                        Download Template
                    </button>

                    <label className={`upload-btn ${uploading ? 'uploading' : ''}`}>
                        <Upload size={20} />
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>
            </div>

            {results && (
                <div className="results-section">
                    <h3 className="results-title">Import Results</h3>

                    <div className="results-summary">
                        <div className="summary-stat">
                            <span className="stat-number">{results.total_customers}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="summary-stat success">
                            <CheckCircle size={16} />
                            <span className="stat-number">{results.successful_upload_count}</span>
                            <span className="stat-label">Success</span>
                        </div>
                        <div className="summary-stat error">
                            <XCircle size={16} />
                            <span className="stat-number">{results.failed_upload_count}</span>
                            <span className="stat-label">Failed</span>
                        </div>
                    </div>

                    {results.failed_upload_count > 0 && (
                        <div className="failed-section">
                            <h4 className="section-title">
                                <AlertTriangle size={16} />
                                Failed Imports ({results.failed_upload_count})
                            </h4>
                            <div className="failed-list">
                                {results.customers_failed.map((failed, idx) => (
                                    <div key={idx} className="failed-item">
                                        <span className="row-number">Row {failed.row}</span>
                                        <span className="customer-key">{failed.customer_key}</span>
                                        <span className="error-message">{failed.error}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.successful_upload_count > 0 && (
                        <div className="success-section">
                            <h4 className="section-title">
                                <CheckCircle size={16} />
                                Successful Imports ({results.successful_upload_count})
                            </h4>
                            <div className="success-list">
                                {results.customers_added.slice(0, 5).map((success, idx) => (
                                    <div key={idx} className="success-item">
                                        <span className="row-number">Row {success.row}</span>
                                        <span className="customer-key">{success.customer_key}</span>
                                        <span className="status">Synced</span>
                                    </div>
                                ))}
                                {results.successful_upload_count > 5 && (
                                    <div className="more-items">
                                        +{results.successful_upload_count - 5} more customers synced
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CsvUpload;