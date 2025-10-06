const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');


mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    bookName: String,
    pageCount: Number,
    description: String,
    price: Number,
    size: String,
    publishDate: Date,
    stockQuantity: Number,
    averageRating: Number,
    reviewCount: Number,
    images: [
        {
        imageName: String,
        url: String
        }
    ],
    thumbnail: String,
    authors: [
        {
        authorName: String
        }
    ],
    publisher: {
        publisherName: String
    },
    distributor: {
        distributorName: String
    },
    coverType: {
        coverName: String
    },
    category: {
        level1: {
        categoryName: String
        },
        level2: {
        genreName: String
        }
    },
    position: Number,
    status: String,
    discountPercent: Number,
    slug: { 
        type: String, 
        slug: "bookName", //san-pham-1
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true //tự động thêm 2 trường thời gian là createAt và updateAt
}); //Tạo mới 1 cái bộ khung, khuôn mẫu 

const Product = mongoose.model('Product', productSchema, "books"); //Khởi tạo nó

//Tham số 1: Tên model, tham số 2: tên schema mà định nghĩa ở trên, tham số 3 là tên collection bên trong mongodb

module.exports = Product;