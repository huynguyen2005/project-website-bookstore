module.exports.index = (req, res) => {
    res.render('admin/pages/settings/index', {
        pageTitle: "Cài đặt chung | Admin",
        activeMenu: "setting",
    })
}