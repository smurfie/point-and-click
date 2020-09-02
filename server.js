const express = require('express');
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the public folder
app.use(express.static('public'));

// to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true, limit:'1Mb', parameterLimit:10000 }));
app.use(express.json());

app.get('/', function(req, res) {
  res.render('pages/home');
});

app.get('/home', function(req, res) {
  res.render('pages/home');
});

app.get('/game/:game?', function(req, res) {
  res.render('pages/game', {game: req.params.game || ''});
});

app.get('/editor', function(req, res) {
  res.render('pages/editor', {game: ''});
});

app.get('/editor/:game', function(req, res) {
  res.render('pages/editor', {game: req.params.game});
});

app.get('/canvas/:game?', function(req, res) {
  res.render('pages/canvas', {game: req.params.game || ''});
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})