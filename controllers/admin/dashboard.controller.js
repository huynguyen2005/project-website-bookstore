const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Book = require("../../models/book.model");
const BookCategory = require("../../models/book-category.model");
const Blog = require("../../models/blog.model");

module.exports.index = async (req, res) => {
    const totalOrders = await Order.countDocuments({ deleted: false });
    const newOrders = await Order.countDocuments({ status: "pending", deleted: false });
    const successOrders = await Order.countDocuments({ status: "completed", deleted: false });
    const cancelOrders = await Order.countDocuments({ status: "cancelled", deleted: false });

    const totalProducts = await Book.countDocuments({ deleted: false });
    const totalCategories = await BookCategory.countDocuments({ deleted: false });
    const totalBlogs = await Blog.countDocuments({ deleted: false });
    const totalImages = 0;

    const totalUsers = await User.countDocuments({ deleted: false });
    const totalComments = 1;
    const totalReviews = 2;

    const ordersByMonth = await Order.aggregate([
        { $match: { deleted: false } },
        { $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
        }},
        { $sort: { "_id": 1 } }
    ]);

    const months = Array.from({length: 12}, (_, i) => i+1);
    const orderCounts = months.map(m => {
        const found = ordersByMonth.find(o => o._id === m);
        return found ? found.count : 0;
    });

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Dashboard | Admin",
        activeMenu: "dashboard",
        totalOrders,
        newOrders,
        successOrders,
        cancelOrders,
        totalUsers,
        totalComments,
        totalReviews,
        totalProducts,
        totalCategories,
        totalBlogs,
        totalImages,
        orderChartLabels: months,
        orderChartData: orderCounts,
        customerChartLabels: months,
        customerChartData: months.map(() => Math.floor(Math.random() * 10))
    });
};
