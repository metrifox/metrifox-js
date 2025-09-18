import React, { useState } from 'react';
import Header from './components/Header';
import Toast from './components/common/Toast';
import SideNavigation from './components/common/SideNavigation';
import FeatureAccessPage from './pages/FeatureAccessPage';
import CustomerManagementPage from './pages/CustomerManagementPage';
import CsvUploadPage from './pages/CsvUploadPage';
import EmbeddedCheckoutPage from './pages/EmbeddedCheckoutPage';
import MockCustomerSignUp from './pages/MockCustomerSignup';
import { useToast } from './hooks/useToast';

import './styles/globals.css';
import './styles/components.css';
import './styles/pages.css';

const App = ({ customerKey, featureKey, eventName }) => {
    const [activeView, setActiveView] = useState('feature-access');
    const { toast, showToast, hideToast } = useToast();

    const navigationItems = [
        { id: 'feature-access', label: 'Feature Access', component: FeatureAccessPage },
        { id: 'customer-management', label: 'Customer Management', component: CustomerManagementPage },
        { id: 'csv-upload', label: 'CSV Upload', component: CsvUploadPage },
        { id: 'embedded-checkout', label: 'Embedded Checkout', component: EmbeddedCheckoutPage },
        { id: 'mock-checkout-signup', label: 'Checkout customer signup', component: MockCustomerSignUp }
    ];

    const ActiveComponent = navigationItems.find(item => item.id === activeView)?.component || FeatureAccessPage;

    return (
        <div className="app-container">
            <Header
                title="Metrifox SDK Demo"
                subtitle="Test the Metrifox JavaScript SDK with real API calls"
            />

            <div className="app-layout">
                <SideNavigation
                    navigationItems={navigationItems}
                    activeView={activeView}
                    onViewChange={setActiveView}
                />

                <main className="main-content">
                    <ActiveComponent
                        customerKey={customerKey}
                        featureKey={featureKey}
                        eventName={eventName}
                        showToast={showToast}
                    />
                </main>
            </div>

            <Toast toast={toast} onHide={hideToast} />
        </div>
    );
};

export default App;