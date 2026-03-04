import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Payment } from 'mercadopago';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Token de acceso proporcionado por variable de entorno
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-3473191615659453-030400-81435794a95670ce95ff1535f712a58a-3243325156'
});

const payment = new Payment(client);

app.post('/process_payment', async (req, res) => {
    try {
        console.log("Recibiendo solicitud de pago...");
        const { formData } = req.body;

        const paymentData = {
            body: {
                transaction_amount: formData.transaction_amount,
                token: formData.token,
                description: formData.description || 'Pedido de Carnitas El Patrón',
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
            }
        };

        const result = await payment.create(paymentData);

        console.log("Pago procesado con éxito:", result.id);
        res.status(201).json({
            status: result.status,
            status_detail: result.status_detail,
            id: result.id,
        });

    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({
            error: "Error interno al procesar el pago con Mercado Pago",
            details: error
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor de pagos corriendo en http://localhost:${port}`);
});
