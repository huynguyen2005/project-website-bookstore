const express = require('express');
const database = require('./config/database');
require('dotenv').config();


database.connectDatabase();
const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));


app.listen(port, () => {
    console.log(port);
})