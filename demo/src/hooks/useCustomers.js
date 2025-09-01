import { useState, useCallback } from 'react';

export const useCustomers = () => {
    const [customers, setCustomers] = useState([
        // Mock data - in real app this would come from your database
        {
            id: 1,
            customer_key: 'cust-70ce1e52',
            primary_email: 'jane.doe@example.com',
            customer_type: 'INDIVIDUAL',
            first_name: 'Jane',
            last_name: 'Doe',
            primary_phone: '+1234567890',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            currency: 'USD',
            language: 'en',
            tax_status: 'TAXABLE',
            metrifoxId: 'mf_cust_123',
            syncStatus: 'synced'
        },
        {
            id: 2,
            customer_key: 'cust-business-457',
            primary_email: 'ceo@example-business.com',
            customer_type: 'BUSINESS',
            legal_name: 'Example Business LLC',
            display_name: 'Example Business',
            primary_phone: '+1987654321',
            created_at: '2024-01-10T08:15:00Z',
            updated_at: null,
            currency: 'USD',
            language: 'en',
            tax_status: 'REVERSE_CHARGE',
            metrifoxId: null,
            syncStatus: 'pending'
        }
    ]);

    const addCustomer = useCallback(async (customerData) => {
        const client = window.metrifoxClient;
        const response = await client.customers.create(customerData);
        const newCustomer = {
            id: Date.now(),
            ...response.data,
            metrifoxId: response.data.id,
            syncStatus: 'synced'
        };
        setCustomers(prev => [newCustomer, ...prev]);
        return response;
    }, []);

    const editCustomer = useCallback(async (customerId, customerData) => {
        const client = window.metrifoxClient;
        const response = await client.customers.update(customerData.customer_key, customerData);
        setCustomers(prev => prev.map(c =>
            c.id === customerId
                ? {
                    ...c,
                    ...response.data,
                    updated_at: new Date().toISOString(),
                    syncStatus: 'synced'
                }
                : c
        ));
        return response;
    }, []);

    const removeCustomer = useCallback(async (customerKey) => {
        const client = window.metrifoxClient;
        await client.customers.delete(customerKey);
        setCustomers(prev => prev.filter(c => c.customer_key !== customerKey));
    }, []);

    const syncCustomer = useCallback(async (customer) => {
        const customerData = {
            customer_key: customer.customer_key,
            customer_type: customer.customer_type,
            primary_email: customer.primary_email
        };

        // Add type-specific fields
        if (customer.customer_type === 'INDIVIDUAL') {
            if (customer.first_name) customerData.first_name = customer.first_name;
            if (customer.last_name) customerData.last_name = customer.last_name;
        } else {
            if (customer.legal_name) customerData.legal_name = customer.legal_name;
            if (customer.display_name) customerData.display_name = customer.display_name;
        }

        if (customer.primary_phone) customerData.primary_phone = customer.primary_phone;

        const client = window.metrifoxClient;
        const response = await client.customers.update(customer.customer_key, customerData);
        setCustomers(prev => prev.map(c =>
            c.id === customer.id
                ? {
                    ...c,
                    ...response.data,
                    updated_at: new Date().toISOString(),
                    syncStatus: 'synced'
                }
                : c
        ));
        return response;
    }, []);

    return {
        customers,
        addCustomer,
        editCustomer,
        removeCustomer,
        syncCustomer
    };
};