const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const allowedOrigins = [
  process.env.VITE_URL,
  'https://vrstockly.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
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