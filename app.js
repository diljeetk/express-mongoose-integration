var express = require('express');
var app = express();
var bodyParser= require('body-parser');
var mongoose=require('mongoose');
var Book = require('./Book.model');
var port =8080;

//set variable for db

var db ='mongodb://localhost/example';

//connecting to database
mongoose.connect(db);

/*in order to use body parser and to parse JSON over URLS`s 
, we need to state that thats whow we want to use bodParser */
app.use(bodyParser.json())

/* urlencoded will allow to give and receive body elements through url
, so that we can use postman and hit endpoints  */
app.use(bodyParser.urlencoded({
    extended:true
}))

app.post('/book', function(req, res){
    var newBook =new Book();
    newBook.title= req.body.title;
    newBook.author= req.body.author;
    newBook.category= req.body.category;

    newBook.save(function(err,book){
        if(err){
            res.send("Error saving book");
        } else {
            console.log(book);
            res.send(book);
        }
    })
});

//using create() method to insert data 
app.post('/createBook', function(req,res){
    Book.create(req.body, function(err, book){
        if(err){
            res.send("Error Creating book");
        } else {
            console.log(book);
            res.send(book);
        }
    })
});


app.put('/book/:id', function(req, res) {
    Book.findOneAndUpdate({
      _id: req.params.id
      },
      { $set: { title: req.body.title }
    }, {upsert: true}, function(err, newBook) {
      if (err) {
        res.send('error updating  book details');
      } else {
        console.log(newBook);
        res.send(newBook);
      }
    });
  });

app.get('/', function(req,res){
    res.send('Happy to be here')
});

app.get('/books', function(req,res){
   console.log('Getting books');
   Book.find({})
       .exec(function(err,books){
           if(err){
               res.send("error has occured");
           } else {
               console.log(books)
               res.json(books);
           }
       })
});

app.get('/books/:id', function(req, res){
    console.log('getting 1 books');
    Book.findOne({
        _id:req.params.id
    })
     .exec(function(err,book){
         if(err){
             console.log(err);
             res.send('error occured')
         } else {
             console.info(book)
             res.json(book)
         }
     })
})
app.listen(port,function(){
    console.log('App is listenng on the port :',port);

});