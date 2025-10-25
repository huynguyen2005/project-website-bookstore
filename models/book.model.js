const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const bookSchema = new mongoose.Schema({
    bookName: String,
    pageCount: Number,
    description: String,
    price: Number,
    size: String,
    publishDate: Date,
    stockQuantity: Number,
    averageRating: Number,
    reviewCount: Number,
    images: [String],
    thumbnail: String,
    authors: [String],
    publisher: String,
    distributor: String,
    coverType_id: {
        type: String,
        default: ""
    },
    book_category_id: {
        type: String,
        default: ""
    },

    position: Number,
    status: String,
    discountPercent: Number,
    slug: { 
        type: String, 
        slug: "bookName", 
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema, "books");

module.exports = Book;
