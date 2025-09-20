const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Supplier = require('./models/supplier');
const Product = require('./models/product');

dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected for seeding');
    seedData();
}).catch(err => console.log('❌ MongoDB connection error:', err));

async function seedData() {
    try {
        // Xóa dữ liệu cũ
        await Supplier.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️ Cleared old data');

        // Tạo suppliers mẫu
        const suppliers = await Supplier.create([{
                name: 'Công ty TNHH ABC',
                address: '123 Đường Lê Loi, Q1, TP.HCM',
                phone: '0901234567'
            },
            {
                name: 'Công ty Cổ phần XYZ',
                address: '456 Đường Nguyễn Huệ, Q1, TP.HCM',
                phone: '0909876543'
            },
            {
                name: 'Doanh nghiệp DEF',
                address: '789 Đường Trần Hưng Đạo, Q5, TP.HCM',
                phone: '0912345678'
            }
        ]);

        console.log('✅ Created sample suppliers');

        // Tạo products mẫu
        const products = await Product.create([{
                name: 'Laptop Dell Inspiron',
                price: 15000000,
                quantity: 10,
                supplierId: suppliers[0]._id
            },
            {
                name: 'iPhone 15 Pro Max',
                price: 30000000,
                quantity: 5,
                supplierId: suppliers[1]._id
            },
            {
                name: 'Samsung Galaxy S24',
                price: 25000000,
                quantity: 8,
                supplierId: suppliers[0]._id
            },
            {
                name: 'MacBook Pro M3',
                price: 50000000,
                quantity: 3,
                supplierId: suppliers[2]._id
            },
            {
                name: 'iPad Air',
                price: 18000000,
                quantity: 12,
                supplierId: suppliers[1]._id
            }
        ]);

        console.log('✅ Created sample products');
        console.log('🎉 Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        mongoose.connection.close();
    }
}