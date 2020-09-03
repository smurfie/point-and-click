const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'localhost'; // 'production' in production

let express = require('express'),
  app = express(),
  isProduction = ENV === 'production';

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the public folder
app.use(express.static('public'));

// to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true, limit:'1Mb', parameterLimit:10000 }));
app.use(express.json());

app.get('/', function(req, res) {
  res.render('home', {isProduction: isProduction});
});

app.get('/home', function(req, res) {
  res.render('home', {isProduction: isProduction});
});

app.get('/game/:game?', function(req, res) {
  res.render('game', {game: req.params.game || '', isProduction: isProduction});
});

app.get('/editor', function(req, res) {
  res.render('editor', {game: '', isProduction: isProduction});
});

app.get('/editor/:game', function(req, res) {
  res.render('editor', {game: req.params.game, isProduction: isProduction});
});

app.get('/canvas/:game?', function(req, res) {
  res.render('canvas', {game: req.params.game || '', isProduction: isProduction});
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
})