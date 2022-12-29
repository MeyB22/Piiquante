const mongoose = require("mongoose")

require("dotenv").config()

const express = require("express")

const app = express()

const userRoutes = require('./routes/userRoute')

const sauceRoutes = require('./routes/sauceRoute')

const path = require("path")

mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.qsjrnge.mongodb.net/piquante?retryWrites=true&w=majority`,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=>console.log('conexion reussie'))
    .catch(()=>console.log('conexion lost'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json())

app.use('/images',express.static(path.join(__dirname,"images")))

app.use('/api/auth',userRoutes)

app.use('/api/sauces',sauceRoutes)

module.exports = app