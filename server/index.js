import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import multer from 'multer';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const DB_PATH = path.join(process.cwd(), 'server', 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_not_safe';

// Create uploads dir if not exists
if (!existsSync(UPLOADS_DIR)) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
// Serve static files from public
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve frontend build if it exists
const distPath = path.join(process.cwd(), 'dist');
if (existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- Database Helpers ---
const readDB = async () => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading DB:", error);
        return { products: [], locations: [], config: {} };
    }
};

const writeDB = async (data) => {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// --- Mercado Pago Init (Dynamic) ---
const getMPClient = async () => {
    const db = await readDB();
    return new MercadoPagoConfig({
        accessToken: db.config.mp_access_token || process.env.MP_ACCESS_TOKEN
    });
};

// --- Git Helpers ---
const gitAutoCommit = async (message) => {
    const cmd = `git add . && git commit -m "Admin: ${message}" && git push`;
    try {
        const { stdout, stderr } = await execAsync(cmd);
        return { success: true, stdout, stderr };
    } catch (error) {
        return { 
            success: false, 
            stdout: error.stdout || '', 
            stderr: error.stderr || error.message 
        };
    }
};

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const db = await readDB();

    if (username === db.config.admin_user && bcrypt.compareSync(password, db.config.admin_pass_hash)) {
        const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token });
    }

    res.status(401).json({ error: 'Credenciales inválidas' });
});

// --- Public API Routes ---
app.get('/api/products', async (req, res) => {
    const db = await readDB();
    res.json(db.products);
});

app.get('/api/locations', async (req, res) => {
    const db = await readDB();
    res.json(db.locations);
});

// --- Admin API Routes (Protected) ---
app.post('/api/admin/upload', authenticateToken, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const gitResult = await gitAutoCommit(`Foto subida: ${req.file.filename}`);
    res.json({ 
        url: fileUrl,
        git: gitResult
    });
});

app.put('/api/admin/products', authenticateToken, async (req, res) => {
    const db = await readDB();
    db.products = req.body;
    await writeDB(db);
    const gitResult = await gitAutoCommit('Actualización de menú de productos');
    res.json({ 
        message: 'Menú actualizado correctamente',
        git: gitResult
    });
});

app.put('/api/admin/locations', authenticateToken, async (req, res) => {
    const db = await readDB();
    db.locations = req.body;
    await writeDB(db);
    const gitResult = await gitAutoCommit('Actualización de sucursales');
    res.json({ 
        message: 'Sucursales actualizadas correctamente',
        git: gitResult
    });
});

app.get('/api/admin/config', authenticateToken, async (req, res) => {
    const db = await readDB();
    // No devolvemos el hash de la contraseña por seguridad
    const { admin_pass_hash, ...safeConfig } = db.config;
    res.json(safeConfig);
});

app.put('/api/admin/config', authenticateToken, async (req, res) => {
    const db = await readDB();
    const { mp_public_key, mp_access_token, admin_user, new_password } = req.body;
    
    if (mp_public_key) db.config.mp_public_key = mp_public_key;
    if (mp_access_token) db.config.mp_access_token = mp_access_token;
    if (admin_user) db.config.admin_user = admin_user;
    if (new_password) {
        db.config.admin_pass_hash = bcrypt.hashSync(new_password, 10);
    }
    
    await writeDB(db);
    const gitResult = await gitAutoCommit('Actualización de configuración administrativa');
    res.json({ 
        message: 'Configuración actualizada correctamente',
        git: gitResult
    });
});

app.post('/api/admin/validate-mp', authenticateToken, async (req, res) => {
    const { access_token } = req.body;
    if (!access_token) return res.status(400).json({ error: 'Token requerido' });
    
    try {
        const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        
        if (response.ok) {
            res.json({ success: true, message: 'Credenciales válidas' });
        } else {
            const errorData = await response.json();
            res.status(401).json({ 
                success: false, 
                message: 'No se pudo verificar el token',
                details: errorData.message || 'Error desconocido'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- Mercado Pago Payment Process ---
app.post('/process_payment', async (req, res) => {
    try {
        const { formData } = req.body;
        const client = await getMPClient();
        const payment = new Payment(client);

        const result = await payment.create({ body: formData });

        res.status(201).json({
            id: result.id,
            status: result.status,
            status_detail: result.status_detail,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Error al procesar el pago', details: error.message });
    }
});

app.post('/webhook', (req, res) => {
    console.log(`Webhook recibido: ${req.query.topic || req.query.type}`);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Servidor La Patrona corriendo en http://localhost:${port}`);
});
