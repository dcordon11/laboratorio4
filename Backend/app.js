var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var songsRouter = require('./routes/songs');
var sequelize = require('./db');
require('./models/song');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//estas vistas fueron elaboradas con IA 
app.use(express.static(path.join(__dirname, 'public')));

//todo arreglar esto despues para que se vea bonito
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/songs', songsRouter);

sequelize
  .sync()
  .then(function () {
    console.log('MySQL conectado y tabla songs lista');
  })
  .catch(function (err) {
    console.error('Error al conectar MySQL:', err.message);
  });

app.use(function(req, res, next) {
  next(createError(404));
});


//pagina de erores
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
