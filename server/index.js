import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Token de acceso proporcionado por variable de entorno
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
});

const payment = new Payment(client);

// Endpoint para procesar el pago desde el Brick de Mercado Pago
app.post('/process_payment', async (req, res) => {
    try {
        const { formData } = req.body;

        const paymentData = {
            body: formData,
        };

        const result = await payment.create(paymentData);

        res.status(201).json({
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({
            error: 'Error al procesar el pago',
            details: error.message
        });
    }
});

// Endpoint opcional para Webhooks (notificaciones de Mercado Pago)
app.post('/webhook', async (req, res) => {
    const { query } = req;
    const topic = query.topic || query.type;

    console.log(`Webhook recibido: ${topic}`);

    // Aquí podrías actualizar el estado de tu pedido en una base de datos
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Servidor de pagos corriendo en http://localhost:${port}`);
});

