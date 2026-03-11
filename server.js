import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken || accessToken === 'TU_ACCESS_TOKEN_DE_PRUEBA_AQUI') {
    console.error('❌ ERROR: No se encontró MERCADOPAGO_ACCESS_TOKEN en el archivo .env');
    console.error('   Edita el archivo .env y pega tu Access Token de prueba.');
    process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());

// Mercado Pago configuration
const client = new MercadoPagoConfig({
    accessToken: accessToken,
    options: { timeout: 10000 }
});

const payment = new Payment(client);
const preference = new Preference(client);

app.get('/', (req, res) => {
    res.send('Servidor de Carnitas El Patrón está activo. 🔥');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', tokenConfigured: !!accessToken });
});

// ─── Checkout Pro: Crear preferencia de pago ──────────────────────────────────
app.post('/create_preference', async (req, res) => {
    try {
        const { cart, total, back_url } = req.body;

        // Mapear los items del carrito al formato que espera Mercado Pago
        const items = cart && cart.length > 0
            ? cart.map(item => ({
                title: item.name,
                quantity: item.quantity,
                unit_price: Number(item.price),
                currency_id: 'MXN',
            }))
            : [{ title: 'Pedido Carnitas El Patrón', quantity: 1, unit_price: Number(total || 1), currency_id: 'MXN' }];

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const result = await preference.create({
            body: {
                items,
                statement_descriptor: 'Carnitas El Patrón',
                external_reference: `pedido-${Date.now()}`,
                expires: false,
            },
        });

        res.json({ preference_id: result.id, init_point: result.init_point });
    } catch (error) {
        console.error('Preference Error:', error.message);
        res.status(500).json({ message: 'Error al crear la preferencia', error: error.message });
    }
});

app.post('/process_payment', async (req, res) => {
    try {
        const { formData } = req.body;

        if (!formData || !formData.token) {
            return res.status(400).json({ message: 'Datos de pago incompletos o token de tarjeta faltante.' });
        }

        const paymentData = {
            body: {
                transaction_amount: Number(formData.transaction_amount),
                token: formData.token,
                description: formData.description || 'Pedido Carnitas El Patrón',
                installments: Number(formData.installments) || 1,
                payment_method_id: formData.payment_method_id,
                issuer_id: formData.issuer_id ? Number(formData.issuer_id) : undefined,
                payer: {
                    email: formData.payer.email,
                    identification: {
                        type: formData.payer.identification?.type,
                        number: formData.payer.identification?.number,
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
        console.error('Payment Error:', JSON.stringify(error?.cause || error.message, null, 2));
        res.status(500).json({
            message: 'Error al procesar el pago',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor de pagos corriendo en puerto ${PORT}`);
});
