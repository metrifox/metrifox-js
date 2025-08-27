import { useState, useRef } from 'react';
import { uploadCustomersCsv } from 'metrifox-js';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const CsvUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    const showMessage = (msg, type = 'info') => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.csv')) {
            showMessage('Please select a CSV file', 'error');
            return;
        }

        setUploading(true);
        setResults(null);

        try {
            const response = await uploadCustomersCsv(file);
            setResults(response.data);
            showMessage(response.message, 'success');
        } catch (error) {
            console.error('Upload failed:', error);
            showMessage('Upload failed: ' + error.message, 'error');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const downloadTemplate = () => {
        const headers = [
            'customer_type',
            'primary_email',
            'primary_phone',
            'legal_name',
            'display_name',
            'legal_number',
            'tax_identification_number',
            'logo_url',
            'website_url',
            'account_manager',
            'first_name',
            'middle_name',
            'last_name',
            'date_of_birth',
            'customer_key',
            'billing_email',
            'timezone',
            'language',
            'currency',
            'tax_status',
            'address_line1',
            'address_line2',
            'city',
            'state',
            'country',
            'zip_code',
            'shipping_address_line1',
            'shipping_address_line2',
            'shipping_city',
            'shipping_state',
            'shipping_country',
            'shipping_zip_code'
        ];

        const sample = [
            'BUSINESS,contact@acmecorp.com,+1-555-0101,Acme Corporation,Acme Corp,ABC123456789,12-3456789,,https://acmecorp.com,Sarah Johnson,,,,,ACME_CORP_001,billing@acmecorp.com,America/New_York,en,USD,1,123 Business Ave,Suite 100,New York,NY,US,10001,123 Business Ave,Suite 100,New York,NY,US,10001',
            'BUSINESS,info@techstart.io,+1-555-0202,TechStart Solutions LLC,TechStart,LLC987654321,98-7654321,,https://techstart.io,Mike Chen,,,,,TECHSTART_002,accounts@techstart.io,America/Los_Angeles,en,USD,1,456 Innovation Dr,,San Francisco,CA,US,94105,789 Warehouse Blvd,,Oakland,CA,US,94607',
            'BUSINESS,hello@designstudio.com,+44-20-7946-0958,Creative Design Studio Ltd,Design Studio,GB123456789,GB123456789,,https://designstudio.com,Emma Thompson,,,,,DESIGN_STU_003,finance@designstudio.com,Europe/London,en,GBP,2,42 Creative Lane,,London,,GB,SW1A 1AA,42 Creative Lane,,London,,GB,SW1A 1AA',
            'BUSINESS,orders@globalimport.de,+49-30-12345678,Global Import Export GmbH,Global Import,HRB123456,DE123456789,,https://globalimport.de,Hans Mueller,,,,,GLOBAL_IMP_004,buchhaltung@globalimport.de,Europe/Berlin,de,EUR,1,Hauptstraße 15,,Berlin,,DE,10115,Lagerstraße 42,,Hamburg,,DE,20095',
            'BUSINESS,support@cloudservices.ca,+1-416-555-9999,CloudServices Inc,CloudServices,1234567-8,123456789RC0001,,https://cloudservices.ca,Jennifer Liu,,,,,CLOUD_SVC_005,billing@cloudservices.ca,America/Toronto,en,CAD,1,100 Tech Plaza,Floor 12,Toronto,ON,CA,M5H 2N2,100 Tech Plaza,Floor 12,Toronto,ON,CA,M5H 2N2',
            'INDIVIDUAL,john.smith@email.com,+1-555-1234,,,,,,,,John,David,Smith,1985-03-15,JOHN_SMITH_006,john.smith@email.com,America/New_York,en,USD,,789 Maple Street,,Springfield,IL,US,62701,789 Maple Street,,Springfield,IL,US,62701',
            'INDIVIDUAL,maria.garcia@gmail.com,+1-555-5678,,,,,,,,Maria,Elena,Garcia,1990-07-22,MARIA_GARCIA_007,,America/Chicago,es,USD,,456 Oak Avenue,Apt 2B,Chicago,IL,US,60614,456 Oak Avenue,Apt 2B,Chicago,IL,US,60614',
            'INDIVIDUAL,david.wong@outlook.com,+1-555-9876,,,,,,,,David,,Wong,1988-11-08,DAVID_WONG_008,david.wong@outlook.com,America/Los_Angeles,en,USD,,321 Pine Road,,Los Angeles,CA,US,90210,321 Pine Road,,Los Angeles,CA,US,90210',
            'INDIVIDUAL,sarah.johnson@yahoo.com,+44-7911-123456,,,,,,,,Sarah,Marie,Johnson,1992-04-30,SARAH_JOHN_009,,Europe/London,en,GBP,,15 Victoria Street,,Manchester,,GB,M1 4BT,15 Victoria Street,,Manchester,,GB,M1 4BT',
            'INDIVIDUAL,alex.mueller@web.de,+49-172-1234567,,,,,,,,Alexander,,Mueller,1987-12-03,ALEX_MUELLER_010,alex.mueller@web.de,Europe/Berlin,de,EUR,,Wilhelmstraße 25,Wohnung 4,Munich,,DE,80331,Wilhelmstraße 25,Wohnung 4,Munich,,DE,80331'
        ];

        const csvContent = [headers.join(','), ...sample].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers-template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="csv-upload-container">
            {message && (
                <div className={`toast ${message.type}`}>
                    {message.text}
                </div>
            )}

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
                            <span className="stat-number">{results.successful_sync_count}</span>
                            <span className="stat-label">Success</span>
                        </div>
                        <div className="summary-stat error">
                            <XCircle size={16} />
                            <span className="stat-number">{results.sync_failure_count}</span>
                            <span className="stat-label">Failed</span>
                        </div>
                    </div>

                    {results.sync_failure_count > 0 && (
                        <div className="failed-section">
                            <h4 className="section-title">
                                <AlertTriangle size={16} />
                                Failed Imports ({results.sync_failure_count})
                            </h4>
                            <div className="failed-list">
                                {results.failed_sync_customers.map((failed, idx) => (
                                    <div key={idx} className="failed-item">
                                        <span className="row-number">Row {failed.row}</span>
                                        <span className="customer-key">{failed.customer_key}</span>
                                        <span className="error-message">{failed.error}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.successful_sync_count > 0 && (
                        <div className="success-section">
                            <h4 className="section-title">
                                <CheckCircle size={16} />
                                Successful Imports ({results.successful_sync_count})
                            </h4>
                            <div className="success-list">
                                {results.successfully_synced_customers.slice(0, 5).map((success, idx) => (
                                    <div key={idx} className="success-item">
                                        <span className="row-number">Row {success.row}</span>
                                        <span className="customer-key">{success.customer_key}</span>
                                        <span className="status">Synced</span>
                                    </div>
                                ))}
                                {results.successful_sync_count > 5 && (
                                    <div className="more-items">
                                        +{results.successful_sync_count - 5} more customers synced
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