const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL server:', err);
        return;
    }
    console.log('Connected to MySQL server!');

    // Create database
    connection.query('CREATE DATABASE IF NOT EXISTS users_db', err => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database created or already exists.');

        // Use the database
        connection.query('USE users_db', err => {
            if (err) {
                console.error('Error selecting database:', err);
                return;
            }

            // Create users table
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) UNIQUE,
                    password VARCHAR(255)
                )
            `;
            connection.query(createTableQuery, err => {
                if (err) {
                    console.error('Error creating table:', err);
                    return;
                }
                console.log('Table created or already exists.');
                connection.end();
            });
        });
    });
});