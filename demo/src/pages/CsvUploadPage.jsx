import React from 'react';
import CsvUpload from '../components/customers/CsvUpload';

const CsvUploadPage = ({ showToast }) => {
    return (
        <div className="csv-upload-page">
            <CsvUpload showToast={showToast} />
        </div>
    );
};

export default CsvUploadPage;