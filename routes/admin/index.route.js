const dashboardRouter = require('./dashboard.route');
const bookRouter = require('./book.route');
const categoryRouter = require('./category.route');
const settingRouter = require('./setting.route');
const roleRouter = require('./role.route');
const accountRouter = require('./account.route');
const systemConfig = require('../../config/system');

module.exports = (app) => {
    app.use(systemConfig.prefixAdmin + "/dashboard", dashboardRouter);
    app.use(systemConfig.prefixAdmin + "/books", bookRouter);
    app.use(systemConfig.prefixAdmin + "/categories", categoryRouter);
    app.use(systemConfig.prefixAdmin + "/settings", settingRouter);
    app.use(systemConfig.prefixAdmin + "/roles", roleRouter);
    app.use(systemConfig.prefixAdmin + "/accounts", accountRouter);
}
