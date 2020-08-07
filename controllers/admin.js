const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product({ title, price, description, imageUrl, userId: req.user });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: { title, imageUrl, description, price },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            res.redirect('/500');
        });
};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res) => {
    const { productId, title, price, description, imageUrl } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: { title, imageUrl, description, price, _id: productId },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            return product.save()
                .then(result => {
                    res.redirect('/admin/products');
                });
        })
        .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
    const { productId } = req.body;

    Product.deleteOne({ _id: productId, userId: req.user._id })
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id })
        // .select('title, price, description -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                path: '/admin/products',
                pageTitle: 'Admin Products',
                prods: products,
            });
        })
        .catch(err => console.log(err));
};