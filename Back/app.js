const mongoose = require("mongoose")

require("dotenv").config()

const rateLimit = require('express-rate-limit')

const helmet = require("helmet");

const xss = require('xss-clean')

const express = require("express")

const app = express()

const userRoutes = require('./routes/userRoute')

const sauceRoutes = require('./routes/sauceRoute')

const path = require("path")

//conexion a mongodb
mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.qsjrnge.mongodb.net/piquante?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>console.log('conexion reussie'))
    .catch(()=>console.log('conexion lost'))

//Intergiciel de limitation de débit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy','same-site')
    next();
});

app.use(xss())

app.use(express.json())

app.use('/images',express.static(path.join(__dirname,"images")))

app.use('/api/auth',userRoutes)

app.use('/api/sauces',sauceRoutes)

module.exports = app