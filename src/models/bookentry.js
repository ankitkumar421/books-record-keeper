const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bookEntry')
.then(() => {
    console.log('Connected to mongodb...');
}).catch((err) => {
    console.log('Cannot connect', err);
});

const bookData = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
   price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
   
})

const BookDataBase = mongoose.model("BookDatabase", bookData);
module.exports = BookDataBase;