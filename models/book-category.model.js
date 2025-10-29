const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const bookCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: ""
    },
    description: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
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
  }
);

const BookCategory = mongoose.model("BookCategory", bookCategorySchema, "books_category");

module.exports = BookCategory;
