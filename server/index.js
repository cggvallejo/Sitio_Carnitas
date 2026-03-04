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
    accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-3473191615659453-030400-81435794a95670ce95ff1535f712a58a-3243325156'
});

const payment = new Payment(client);

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `Eres el "Patrón-Bot" 🤠, el asistente virtual de "Carnitas El Patrón". 
    Tu objetivo es ayudar a los clientes a conocer el menú y tomar sus pedidos de forma amable y eficiente.
    
    CONOCIMIENTO DEL MENÚ:
    - Platillos: Tacos de Carnitas (Orden x3) - $95, Torta de Carnitas - $85.
    - Por Taco: Maciza - $35, Surtida - $32, Cuerito - $30.
    - Por Kilo: 1kg Maciza - $450, 1kg Surtida - $420.
    - Bebidas: Refresco 600ml - $25, Agua de Sabor (500ml) - $30, Refresco 2L - $45.
    - Complementos: Salsa Especial (250ml) - $35.

    REGLAS DE INTERACCIÓN:
    1. Responde siempre con un tono cercano, amable y un poco rústico/tradicional mexicano.
    2. Identifica los productos y cantidades que el usuario quiere pedir.
    3. Si el usuario pide algo, confirma la cantidad y el producto.
    4. El flujo debe ser: Tomar pedido -> Pedir dirección de entrega -> Preguntar método de pago (Efectivo, Tarjeta, Mercado Pago) -> Confirmar pedido.
    5. AL FINAL de la interacción, cuando el usuario CONFIRME, debes resumir el pedido en un bloque JSON al final de tu mensaje con el siguiente formato:
       [ORDER_SUMMARY]{"products": [{"name": "...", "quantity": 1, "price": 0}], "location": "...", "paymentMethod": "..."}[/ORDER_SUMMARY]
    6. No inventes productos que no están en el menú.`
});

app.get('/', (req, res) => {
    res.send('🍖 API de Carnitas El Patrón corriendo con éxito. Lista para procesar pagos.');
});

app.post('/process_payment', async (req, res) => {
    // ... (existing code for payment)
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error("Error en el chat de Gemini:", error);
        res.status(500).json({ error: "Error al procesar el mensaje del chatbot" });
    }
});

app.listen(port, () => {
    console.log(`Servidor de pagos corriendo en http://localhost:${port}`);
});
