import React, { useEffect } from 'react';

const EmbeddedCheckoutPage = () => {
    const handleEmbed = async () => {
        const client = window.metrifoxClient;
        client.checkout.embed({
            container: ".checkout-embed",
            productKey: "product_collabspace_3113" // replace with your product key 
        });
    }

    useEffect(() => {
        handleEmbed()
    }, [])

    return (
        <div className="embedded-checkout-page">
            <div className="checkout-container">
                <h2 className="content-title">Embedded Checkout</h2>
                <p className="content-description">
                    This would contain an embedded Metrifox checkout widget for processing payments
                    and subscriptions directly within your application.
                </p>

                <div className="checkout-embed">
                    <div style={{
                        padding: '80px 40px',
                        color: '#666',
                        textAlign: 'center',
                        fontSize: '14px'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💳</div>
                        <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>Checkout Widget</h3>
                        <p style={{ margin: 0 }}>
                            Metrifox checkout component would be embedded here
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmbeddedCheckoutPage;