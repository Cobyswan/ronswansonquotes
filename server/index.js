const express = require("express");
const bodyParser = require("body-parser");
const controller = require('./controller')
const session = require('express-session')
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'dlfkgnlskngdlmd',
    saveUninitialized: false,
    resave: false
}))

app.put('/api/rate_quote/:rating', controller.rateQuote)
app.put('/api/get_average_rating', controller.getAverageRating)
app.get('/api/session', controller.getSessionInfo)
const port = 4000;
app.listen(port, () => console.log(`Server running on port: ${port}`))