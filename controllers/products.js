const products = [];

exports.getAddProduct = (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productsCSS: true
    });
};

exports.postAddProduct = (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    res.render('shop', {
        pageTitle: 'My Shop',
        path: '/',
        prods: products,
        hasProducts: products.length > 0,
        activeShop: true,
        productsCSS: true
    });
};