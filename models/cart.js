const fs = require('fs');
const path = require('path');
const dirName = require('../util/path');

const filePath = path.join(dirName, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(filePath, (readError, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!readError) {
                cart = JSON.parse(fileContent);
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(filePath, JSON.stringify(cart), (writeError) => {
                console.log(writeError);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(filePath, (readError, fileContent) => {
            if (readError) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = product.qty;

            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);

            fs.writeFile(filePath, JSON.stringify(updatedCart), (writeError) => {
                console.log(writeError);
            });
        });
    }

};