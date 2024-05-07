/*
 * Project 2
 * app JavaScript code
 *
 * Author: Shreya Ashok Kumar
 * Version: 1.0
 * 
 * This class sets up the majority of the back-end configuration with MongoDB,
 * providing the back-end functionality needed to find/get databsets and update 
 * the database with any type of change made using the front-end, as well as
 * creating and saving new datasets to the database using create (another type of
 * post request)
 */

// configurating back end to establish web server and routes
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) =>
    res.send('<h1>Project 2: shreyaak19</h1>') // Home web page
);

// establishing route to do get request to retrieve datasets from the database
const CS3744Schema = require("./model");
const router = express.Router();
app.use('/db', router);
router.route('/find').get( async (req, res) => {
  const response = await CS3744Schema.find();
  return res.status(200).json(response);
});

// Added support for post requests. A document is found based on its id. 
// The id is the value of _id property of the document.
// This route is used to make changes to the database based on the changes made to
// the views displayed of the dataset in the frontend
router.route('/update/:id').post( async (req, res) => {
  const response = await CS3744Schema.findByIdAndUpdate(req.params.id, req.body);
	return res.status(200).json(response);
});

// Added support for post request, this route is used to create a new
// document in the database whenever a new dataset is created in the frontend.
router.route('/create').post( async (req, res) => {
  const response = await CS3744Schema.create(req.body);
  return res.status(200).json(response);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://student:cs3744@vt.rvota8z.mongodb.net/CS3744?retryWrites=true&w=majority');
mongoose.connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});


module.exports = app;
