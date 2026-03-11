import fetch from 'node-fetch';

const test = async () => {
    const payload = {
        formData: {
            transaction_amount: 35,
            token: 'test_token',
            description: 'Taco de Maciza',
            installments: 1,
            payment_method_id: 'master',
            issuer_id: '24',
            payer: {
                email: 'test_user_123@testuser.com',
                identification: {
                    type: 'DNI',
                    number: '12345678'
                }
            }
        }
    };

    try {
        const res = await fetch('http://localhost:3000/process_payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
};

test();
