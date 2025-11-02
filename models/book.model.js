const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const bookSchema = new mongoose.Schema({
    bookName: String,
    pageCount: Number,
    description: String,
    featured: String,
    price: Number,
    size: String,
    publishDate: Date,
    stockQuantity: Number,
    averageRating: Number,
    reviewCount: Number,
    images: [String],
    thumbnail: String,
    author_id: {
        type: String,
        default: ""
    },
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
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            deletedAt: Date
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    }
});

const Book = mongoose.model('Book', bookSchema, "books");

module.exports = Book;
