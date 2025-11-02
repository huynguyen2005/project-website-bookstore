require('dotenv').config();

const express = require('express');
const methodOverride = require("method-override");
const database = require('./config/database');
const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');
const systemConfig = require('./config/system');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const moment = require('moment');

//Kết nối database
database.connectDatabase();
const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

//giả lập phương thức
app.use(methodOverride("_method"));

//chuyển đổi dữ liệu client gửi lên sang json
app.use(express.urlencoded({ extended: true }));

//định nghĩa flash
app.use(cookieParser('HUYDZ'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

//TinyMCE
app.use('/tinymce', 
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

routeAdmin(app);
routeClient(app)

app.listen(port, () => {
    console.log(port);
})