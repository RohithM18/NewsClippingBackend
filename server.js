const express = require('express');
const mysql = require('mysql');
const app = express();

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'news_db',
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM news', (err, results) => {
    if (err) throw err;
    res.render('index', { news: results });
  });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const { title, type, description } = req.body;
  const news = { title, type, description };
  db.query('INSERT INTO news SET ?', news, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/edit/:id', (req, res) => {
  const newsId = req.params.id;
  db.query('SELECT * FROM news WHERE id = ?', newsId, (err, result) => {
    if (err) throw err;
    res.render('edit', { news: result[0] });
  });
});

app.post('/edit/:id', (req, res) => {
  const newsId = req.params.id;
  const { title, type, description } = req.body;
  const updatedNews = { title, type, description };
  db.query('UPDATE news SET ? WHERE id = ?', [updatedNews, newsId], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const newsId = req.params.id;
  db.query('DELETE FROM news WHERE id = ?', newsId, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  db.query(
    'SELECT * FROM news WHERE title LIKE ? OR description LIKE ?',
    [`%${searchTerm}%`, `%${searchTerm}%`],
    (err, results) => {
      if (err) throw err;
      res.render('search', { news: results, term: searchTerm });
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
