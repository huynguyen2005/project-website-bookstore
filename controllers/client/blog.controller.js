const Blog = require("../../models/blog.model");

//[GET] /blogs
module.exports.index = async (req, res) => {
    const blogs = await Blog.find({deleted: false});
    res.render("client/pages/blogs/index", {
        pageTitle: "Bài viết | BookStore",
        blogs: blogs
    });
}

//[GET] /blogs/:blogSlug
module.exports.detail = async (req, res) => {
    const blog = await Blog.findOne({slug: req.params.blogSlug});
    res.render("client/pages/blogs/detail", {
        pageTitle: blog.title,
        blog: blog
    });
}