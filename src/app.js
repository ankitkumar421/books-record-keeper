const express = require('express');
const hbs = require('hbs');
const path = require('path');
var bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const BookDataBase = require("./models/bookentry");
const app = express();
app.use(bodyParser.json());


const viewspath = path.join(__dirname, "../templates/views");
const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", viewspath);

app.use('/public', express.static(path.join(__dirname, '../public')));

// Add book to DB
app.post("/addbook", (req, res) => {
    const bookData = new BookDataBase({
        name: req.body.name.toUpperCase(),
        author: req.body.author,
        category: req.body.category,
        price: req.body.price,
        isActive: req.body.isActive
    });
    bookData.save();
    res.send(200);
});

app.get("/book/:bookId", (req, res) => {
    // res.send(req.params.bookId);
    BookDataBase.find({_id: req.params.bookId})
    .then(result => {
        res.json(result[0]);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
    // console.log(req.);
});

// Render all books
app.get("/all-book", (req, res) => {
    getAllList()
    .then((list) => {
        let details = [];
        list.forEach(eachElement => {
            details.push({name: eachElement.name, 
                          author: eachElement.author, 
                          category: eachElement.category, 
                          price: eachElement.price, 
                          isActive: eachElement.isActive, 
                          id: eachElement.id});
             });
        res.send(details);
    });
});  

async function getAllList() {
    return await BookDataBase.find();
}

// Updating book 
app.post("/update-book", (req, res) => {
    updateById(req.body.id, req.body)
     .then(data => res.json(data));
    res.send(req.body);
});

async function updateById(id, params) {
    const bookObj = await BookDataBase.findOne({
        _id: id
    });
    Object.assign(bookObj, params);
    bookObj.save();
    console.log(bookObj);
}

// Deleting book by ID
app.post("/delete-book", (req, res) => {
    deleteById(req.body.id)
    .then(data => res.json(data));
})

async function deleteById(id) {
    const bookDel = await BookDataBase.deleteOne({
        _id: id
    });
}

// For searching the book by name
app.get("/search-book/", (req, res) => {
    const bookvalue = req.query.bookname;
    console.log(bookvalue);
    searchKey = {
        name: {
            $regex: `.*\\${bookvalue}.*`,
            $options: 'i'
        }
    }
        // searchKey = {name: { $regex: `.*\\${bookvalue}.*`, $options: 'i'}};
    BookDataBase.find((bookvalue) ? searchKey: {})
    .then(result => {
        res.json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});

// HBS pages
app.get("/", (req, res) => {
    res.render("index");
})
 
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});