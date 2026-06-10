'use strict';

// Load .env if present (development)
const fs   = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .forEach(l => {
      const [key, ...parts] = l.split('=');
      if (key && !(key.trim() in process.env)) {
        process.env[key.trim()] = parts.join('=').trim();
      }
    });
}

const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const cookieParser = require('cookie-parser');

const authRouter           = require('./routes/auth');
const planesRouter         = require('./routes/planes');
const multiempresaRouter   = require('./routes/multiempresa');
const usuariosRouter        = require('./routes/usuarios');
const identidadVisualRouter = require('./routes/identidad-visual');
const multimediaRouter      = require('./routes/multimedia');
const catalogoRouter        = require('./routes/catalogo');
const menuPublicoRouter     = require('./routes/menu-publico');
const iaRouter              = require('./routes/ia');
const estadisticasRouter    = require('./routes/estadisticas');

const app  = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, '../../');

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      styleSrc:   ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc:    ["'self'", "fonts.gstatic.com"],
      imgSrc:     ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN
    : true,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',             authRouter);
app.use('/api/planes',           planesRouter);
app.use('/api/multiempresa',     multiempresaRouter);
app.use('/api/usuarios',         usuariosRouter);
app.use('/api/identidad-visual', identidadVisualRouter);
app.use('/api/multimedia',       multimediaRouter);
app.use('/api/catalogo',         catalogoRouter);
app.use('/api/ia',               iaRouter);
app.use('/api/stats',            estadisticasRouter);
app.use('/api/menu',             menuPublicoRouter);   // public — no auth

// Placeholder for future module routes — each module adds its own router here
// app.use('/api/multimedia',       require('./routes/multimedia'));
// app.use('/api/marketing',        require('./routes/marketing'));
// app.use('/api/ia',               require('./routes/ia'));
// app.use('/api/estadisticas',     require('./routes/estadisticas'));
// app.use('/api/automatizaciones', require('./routes/automatizaciones'));

// ─── Static files ─────────────────────────────────────────────────────────────
// Serve uploads with sensible cache headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '7d',
  immutable: false,
}));
app.use('/shared',  express.static(path.join(ROOT, 'shared')));
app.use('/app',     express.static(path.join(ROOT, 'app')));

// PWA root files
app.get('/manifest.json', (req, res) => res.sendFile(path.join(ROOT, 'manifest.json')));
app.get('/sw.js', (req, res) => {
  res.setHeader('Service-Worker-Allowed', '/');
  res.sendFile(path.join(ROOT, 'sw.js'));
});

// Public digital menu — serves the SPA shell for any /menu/:slug URL
app.get('/menu/:slug', (_req, res) => res.sendFile(path.join(ROOT, 'app/menu/index.html')));

// Root → redirect to login
app.get('/', (req, res) => res.redirect('/app/login/'));

// 404 for unknown API routes
app.use('/api/*', (req, res) => res.status(404).json({ message: 'Endpoint no encontrado' }));

// Catch-all → serve login (SPA-like fallback)
app.get('*', (req, res) => res.redirect('/app/login/'));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nRE.CA API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
