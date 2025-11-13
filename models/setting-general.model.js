const mongoose = require('mongoose');

const settingGeneralSchema = new mongoose.Schema({
    websiteName: String,
    thumbnail: String,
    phone: String, 
    email: String,
    address: String,
    copyright: String,
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

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, "setting-general"); //Khởi tạo nó

//Tham số 1: Tên model, tham số 2: tên schema mà định nghĩa ở trên, tham số 3 là tên collection bên trong mongodb

module.exports = SettingGeneral;