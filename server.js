import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Mercado Pago configuration
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-39ce3633-4cdc-40c3-a549-b642b90740bd'
});

const payment = new Payment(client);

app.post('/process_payment', async (req, res) => {
    try {
        const { formData } = req.body;

        const paymentData = {
            body: {
                transaction_amount: formData.transaction_amount,
                token: formData.token,
                description: formData.description,
                installments: formData.installments,
                payment_method_id: formData.payment_method_id,
                issuer_id: formData.issuer_id,
                payer: {
                    email: formData.payer.email,
                    identification: {
                        type: formData.payer.identification.type,
                        number: formData.payer.identification.number,
                    },
                },
            },
        };

        const result = await payment.create(paymentData);

        res.status(200).json({
            status: result.status,
            status_detail: result.status_detail,
            id: result.id,
        });

    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({
            message: "Error al procesar el pago",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de pagos corriendo en puerto ${PORT}`);
});
