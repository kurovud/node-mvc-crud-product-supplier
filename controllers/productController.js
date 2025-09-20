const Product = require('../models/product');
const Supplier = require('../models/supplier');

exports.index = async(req, res) => {
    try {
        const products = await Product.find().populate('supplierId');
        res.render('product/index', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('error', { message: 'Error fetching products' });
    }
};

exports.new = async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.render('product/new', { suppliers });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).render('error', { message: 'Error loading form' });
    }
};

exports.create = async(req, res) => {
    try {
        // Kiểm tra giá trị đầu vào
        const { name, price, quantity, supplierId } = req.body;

        if (price < 1000 || price > 999999999000) {
            const suppliers = await Supplier.find();
            return res.status(400).render('product/new', {
                suppliers,
                error: 'Giá sản phẩm phải từ 1,000 đến 999,999,999,000 VNĐ',
                formData: req.body
            });
        }

        if (quantity < 1 || quantity > 999999) {
            const suppliers = await Supplier.find();
            return res.status(400).render('product/new', {
                suppliers,
                error: 'Số lượng phải từ 1 đến 999,999',
                formData: req.body
            });
        }

        await Product.create(req.body);
        res.redirect('/products');
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.name === 'ValidationError') {
            const suppliers = await Supplier.find();
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).render('product/new', {
                suppliers,
                error: errorMessages.join(', '),
                formData: req.body
            });
        }
        res.status(500).render('error', { message: 'Lỗi khi tạo sản phẩm' });
    }
};

exports.edit = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const suppliers = await Supplier.find();
        if (!product) {
            return res.status(404).render('error', { message: 'Product not found' });
        }
        res.render('product/edit', { product, suppliers });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).render('error', { message: 'Error loading product' });
    }
};

exports.update = async(req, res) => {
    try {
        // Kiểm tra giá trị đầu vào
        const { name, price, quantity, supplierId } = req.body;

        if (price < 1000 || price > 999999999000) {
            const product = await Product.findById(req.params.id);
            const suppliers = await Supplier.find();
            return res.status(400).render('product/edit', {
                product: {...product._doc, ...req.body },
                suppliers,
                error: 'Giá sản phẩm phải từ 1,000 đến 999,999,999,000 VNĐ'
            });
        }

        if (quantity < 1 || quantity > 999999) {
            const product = await Product.findById(req.params.id);
            const suppliers = await Supplier.find();
            return res.status(400).render('product/edit', {
                product: {...product._doc, ...req.body },
                suppliers,
                error: 'Số lượng phải từ 1 đến 999,999'
            });
        }

        await Product.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
        res.redirect('/products');
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.name === 'ValidationError') {
            const product = await Product.findById(req.params.id);
            const suppliers = await Supplier.find();
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).render('product/edit', {
                product: {...product._doc, ...req.body },
                suppliers,
                error: errorMessages.join(', ')
            });
        }
        res.status(500).render('error', { message: 'Lỗi khi cập nhật sản phẩm' });
    }
};

exports.delete = async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).render('error', { message: 'Error deleting product' });
    }
};