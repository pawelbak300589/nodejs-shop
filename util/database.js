const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://paweltest:hLdMncWRsJihADfY@cluster0.o6tr3.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected!');
            callback(client);
        })
        .catch(err => console.log(err));
};

module.exports = mongoConnect;