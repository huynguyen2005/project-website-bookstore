const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // user_id : String,
        cart_id : String,
        userInfor : {
            fullName: String,
            phone: String,
            address: String,
            note: String,
            paymentMethod: String
        },
        status : String,
        books : [
            {
                book_id: String,
                price: Number,
                discountPercent: Number,
                quantity: Number, 
            }
        ],
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

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
