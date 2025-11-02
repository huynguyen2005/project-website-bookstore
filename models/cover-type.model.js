const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const coverTypeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    slug: {
      type: String,
      slug: "title",
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

const CoverType = mongoose.model("CoverType", coverTypeSchema, "cover_types");

module.exports = CoverType;
