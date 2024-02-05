

// "./routes/index.js"

var express = require('express');
var router = express.Router();
const Book = require('../models/index.js').Book;

// Utility Handler
function asyncHandler(cb){
	return async(req, res, next) => {
	  try {
	    await cb(req, res, next)
	  } catch(error){ // Forward error to the global error handler
	    next(error);
	  }
	}
}

// GET home page. REDIRECT to "/books"
router.get('/', (req, res) => { res.redirect('/books'); });

// GET all books page
router.get('/books', asyncHandler( async(req, res) => {
  const books = await Book.findAll();
  res.render("index", {books, title: "Library"});
}));

// GET - Show new-book form
router.get('/books/new', (req, res)=>{
  res.render("new-book", {
    errorHeading: "",
    errorNoTitle: "",
    errorNoAuthor: "",
  });
})

// POST - Create new-book entry
router.post('/books/new', asyncHandler( async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect('/');
  } catch(err) {
    if(err.name === 'SequelizeValidationError') {
      res.render("new-book", {
        errorHeading: "Ooops!",
        errorNoTitle: "Title is required",
        errorNoAuthor: "Author is required",
        data: req.body,
      });
    } else { throw err; }
  }
}));

// GET - Show update form
router.get('/books/:id', asyncHandler( async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book});
  } else { res.sendStatus(404); }
}));

// POST - Submit update form
router.post('/books/:id', asyncHandler( async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/');
    } else { res.sendStatus(404); }
  } catch(err) {
    if(err.name === 'SequelizeValidationError') {
      res.render("update-book", {
        errorHeading: "Ooops!",
        errorNoTitle: "Title is required",
        errorNoAuthor: "Author is required",
        data: req.body,
        book: {id: req.params.id,},
      });
    } else { throw err; }
  }
}));

// POST - Delete book entry
router.post('/books/:id/delete', asyncHandler( async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/');
  } else { res.sendStatus(404); }
}));

module.exports = router;
