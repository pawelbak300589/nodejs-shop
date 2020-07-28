const express = require('express');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: true }));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(4000, () => {
    console.log('Listening on 4000');
});