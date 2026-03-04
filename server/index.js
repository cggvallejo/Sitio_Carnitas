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

// Eliminado el endpoint /api/chat porque el nuevo chatbot nativo ya no lo necesita.

app.listen(port, () => {
    console.log(`Servidor de pagos corriendo en http://localhost:${port}`);
});
