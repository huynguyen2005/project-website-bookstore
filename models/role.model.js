const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    title: String, 
    description: String,
    permissions: {
        type: Array,
        default: []
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
}); //Tạo mới 1 cái bộ khung, khuôn mẫu 

const Role = mongoose.model('Role', roleSchema, "roles"); //Khởi tạo nó

//Tham số 1: Tên model, tham số 2: tên schema mà định nghĩa ở trên, tham số 3 là tên collection bên trong mongodb

module.exports = Role;