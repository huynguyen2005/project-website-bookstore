module.exports.index = (req, res) => {
    res.render('admin/pages/dashboard/index.pug', {
        title: "Tổng quan hệ thống | Admin",
        activeMenu: "dashboard"
    })
}