const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const coverTypeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
);

const CoverType = mongoose.model("CoverType", coverTypeSchema, "cover_types");

module.exports = CoverType;
