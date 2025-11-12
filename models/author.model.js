const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const authorSchema = new mongoose.Schema(
    {
        fullName: String,
        description: String,
        slug: {
            type: String,
            slug: "fullName",
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
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
        ]
    }
);

const Author = mongoose.model("Author", authorSchema, "authors");

module.exports = Author;
