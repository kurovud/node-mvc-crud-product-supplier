const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

dotenv.config();
const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', './view');

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const supplierRoutes = require('./routers/supplierRoutes');
const productRoutes = require('./routers/productRoutes');

// Import models for home page statistics
const Product = require('./models/product');
const Supplier = require('./models/supplier');

app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// Home page with statistics
app.get('/', async(req, res) => {
    try {
        console.log('Loading home page...');
        const productCount = await Product.countDocuments();
        console.log('Product count:', productCount);

        const supplierCount = await Supplier.countDocuments();
        console.log('Supplier count:', supplierCount);

        // Calculate total inventory value
        const products = await Product.find();
        const totalValue = products.reduce((sum, product) => {
            return sum + (product.price * product.quantity);
        }, 0);
        console.log('Total value:', totalValue);

        // Get recent products (last 5)
        const recentProducts = await Product.find()
            .populate('supplierId')
            .sort({ createdAt: -1 })
            .limit(5);
        console.log('Recent products count:', recentProducts.length);

        console.log('Rendering index template...');
        res.render('index', {
            productCount,
            supplierCount,
            totalValue,
            recentProducts
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        console.error('Error stack:', error.stack);
        // Nếu có lỗi, truyền giá trị mặc định để tránh crash
        res.status(500).render('error', {
            message: 'Đã xảy ra lỗi khi tải trang chủ: ' + error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page not found!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));