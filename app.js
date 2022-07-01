
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Console = require("console");

const {client, getPost, getComments, getPosts, countPosts, addComment } = require("./DataBase");

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function isEmptyObject(obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}

app.get("/test",urlencodedParser, (req, res) => {
  let quantityPosts = countPosts().then((p) => {
    return p;
  });
  console.log(quantityPosts);
  getPosts(0, quantityPosts).then( async (p) => {

    console.log(quantityPosts);

    if (isEmptyObject(p)){
      console.log("Not found page in table" + p);
      res.sendFile( __dirname +"\\404.html");
      return;
    }

    let comments = [];

    for (let i = 0; i < p.length; i++){
      const comment = await getComments(p[i].id).then((result) =>{
        return result;
      })
      comments.push(comment);
    }

    Console.log(comments);

    res.render('pages/index', {
      posts:p,
      comments:comments,
      outputComment: false
    });
  })
})

app.get("/test/:index_page",urlencodedParser, (req, res) => {
  var index_page = req.params.index_page;
  if (isNaN(index_page)){
    res.sendFile( __dirname +"\\404.html");
    return
  }

  getPosts(index_page, index_page).then(async (p) => {

    if (isEmptyObject(p)){
      console.log("Not found page in table " + index_page + " " + p);
      res.sendFile( __dirname +"\\404.html");
      return;
    }

    let comments = [];
    const comment = await getComments(index_page).then((result) =>{
      return result;
    })
    comments.push(comment);

    res.render('index', {
      post:p[0],
      comments: comments,
      outputComment: true
    });
  });
})

app.post("/test/:index_page",urlencodedParser, (req, res) =>{
  let comment = req.body;

  addComment(req.params.index_page, comment);

  res.sendFile( __dirname +"\\addComment.html");

})

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
