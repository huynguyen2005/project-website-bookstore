const express = require('express');
const methodOverride = require("method-override");
const database = require('./config/database');
const routeAdmin = require('./routes/admin/index.route');
const systemConfig = require('./config/system');
require('dotenv').config();

//Kết nối database
database.connectDatabase();
const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(methodOverride("_method"));

<<<<<<< HEAD
app.get('/', (req, res) => {
    res.send("Hello World 3");
})
=======
app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
>>>>>>> page-admin

app.listen(port, () => {
    console.log(port);
})