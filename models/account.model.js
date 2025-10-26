const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const accountSchema = new mongoose.Schema({
    username: String,
    fullName: String, 
    email: String,
    password: String,
    token: {
        type: String, 
        default: generate.generateRandomString(20)
    },
    phone: String,
    address: String,
    birthday: String,
    thumbnail: String,
    role_id: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
}); //Tạo mới 1 cái bộ khung, khuôn mẫu 

const Account = mongoose.model('Account', accountSchema, "accounts"); //Khởi tạo nó

//Tham số 1: Tên model, tham số 2: tên schema mà định nghĩa ở trên, tham số 3 là tên collection bên trong mongodb

module.exports = Account;