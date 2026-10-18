const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Trust reverse proxy (Render load balancer) so secure cookies work properly over HTTPS
app.set('trust proxy', 1);

const configuredOrigins = (
  process.env.ALLOWED_ORIGINS ||
  process.env.FRONTEND_URL ||
  process.env.VITE_URL ||
  ''
)
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // In development, automatically allow localhost
    if (process.env.NODE_ENV !== 'production' && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // If configured in environment variables, validate strictly
    if (configuredOrigins.length > 0) {
      if (configuredOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }

    // Fallback: allow request
    return callback(null, true);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./src/routes/Auth.routes.js');
const researchRoutes = require('./src/routes/Research.routes.js');

app.get('/', (req, res) => {
  res.send('backend is running');
});
app.get('/health', (req,res)=>{
  res.send(`Stockly Health: Working \n time : ${new Date().toLocaleTimeString()}`)
});
app.use('/api', authRoutes);
app.use('/api', researchRoutes);

module.exports = app;