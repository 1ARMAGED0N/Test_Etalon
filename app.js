var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerJSDoc = require('swagger-jsdoc');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const customRouter = require('./routes');
const swaggerUi = require('swagger-ui-express');
let {swaggerOptions} = require('./config/MainConfig');
let fs = require('fs');

const swaggerSpec = swaggerJSDoc(swaggerOptions);

var app = express();
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/docsAPI', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = function(app){
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") return;
    let name = file.substring(0, file.indexOf('.'));
    require('./' + name)(app);
  });
}

app.use('/', customRouter)

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

module.exports = app;
