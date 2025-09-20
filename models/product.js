const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên sản phẩm là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tên sản phẩm không được quá 200 ký tự']
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm là bắt buộc'],
        min: [1000, 'Giá sản phẩm phải ít nhất 1,000 VNĐ'],
        max: [999999999000, 'Giá sản phẩm không được quá 999,999,999,000 VNĐ']
    },
    quantity: {
        type: Number,
        required: [true, 'Số lượng là bắt buộc'],
        min: [1, 'Số lượng phải ít nhất là 1'],
        max: [999999, 'Số lượng không được quá 999,999']
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'Supplier is required']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);