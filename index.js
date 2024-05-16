const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public_html')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedUsername = await bcrypt.hash(username, 10);
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(query, [hashedUsername, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(400).send('Username already exists');
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { id, username, password } = req.body;
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [id], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error logging in');
            }
            const user = results[0];
            if (user && await bcrypt.compare(username, user.username) && await bcrypt.compare(password, user.password)) {
                res.status(200).send('Login successful');
            } else {
                res.status(400).send('Invalid username or password');
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('Error fetching user data');
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});