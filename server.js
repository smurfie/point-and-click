const PORT = process.env.PORT || 3000;

let express = require('express'),
  app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the public folder
app.use(express.static('public'));

// to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true, limit:'1Mb', parameterLimit:10000 }));
app.use(express.json());

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/home', function(req, res) {
  res.render('home');
});

app.get('/game/:game?', function(req, res) {
  res.render('game', {game: req.params.game || ''});
});

app.get('/editor', function(req, res) {
  res.render('editor', {game: ''});
});

app.get('/editor/:game', function(req, res) {
  res.render('editor', {game: req.params.game});
});

app.get('/canvas/:game?', function(req, res) {
  res.render('canvas', {game: req.params.game || ''});
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
  console.log(`Env variables: ${process.env}`);
})