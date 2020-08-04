require('dotenv').config();
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGODB_CLIENT_URL,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
    User.findById('5f292239d370c65954e50277')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_CLIENT_URL)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Pawel',
                    email: 'pawel@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });

        app.listen(4000, () => {
            console.log('Listening on 4000');
        });
    })
    .catch(err => console.log(err));
