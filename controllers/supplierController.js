const Supplier = require('../models/supplier');

exports.index = async(req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.render('supplier/index', { suppliers });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).render('error', { message: 'Error fetching suppliers' });
    }
};

exports.new = (req, res) => res.render('supplier/new');

exports.create = async(req, res) => {
    try {
        await Supplier.create(req.body);
        res.redirect('/suppliers');
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).render('error', { message: 'Error creating supplier' });
    }
};

exports.edit = async(req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).render('error', { message: 'Supplier not found' });
        }
        res.render('supplier/edit', { supplier });
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).render('error', { message: 'Error loading supplier' });
    }
};

exports.update = async(req, res) => {
    try {
        await Supplier.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/suppliers');
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).render('error', { message: 'Error updating supplier' });
    }
};

exports.delete = async(req, res) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.redirect('/suppliers');
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).render('error', { message: 'Error deleting supplier' });
    }
};