const express = require('express');
const mysql = require('mysql');
const path = require('path')
const app = express();
app.use(express.json());
const http = require('http');



// Serve static files from the "public" directory
//app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root URL request
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages/index_test.html'));
});

// Handle the "/submit" URL request
app.get('/submit.html', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages/submit.html'));
});

app.get('/Job%20list.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages/job list.html'));
  });

app.get('/contact%20us.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages/contact us.html'));
});

app.get('/index_test.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'pages/index_test.html'));
});
app.get('/applications.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/applications.html'));
});





// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'mydatabase', // Replace with your MySQL database name
});

// Connect to MySQL
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
  } else {
    console.log('Connected to MySQL database');
  }
});

// app.get('/submit', function(req, res){
// res.render(path.join(__dirname, 'submit'))
// })

// Define your API endpoint for handling form data insertion
app.post('/submitApplication', (req, res) => {
  const userData = req.body;
  console.log('---------------------------');
  console.log(userData);

  // Create the database if it doesn't exist
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS mydatabase`;
  connection.query(createDatabaseQuery, (databaseError) => {
    if (databaseError) {
      console.error('Error creating database:', databaseError);
      res.status(500).json({ error: 'Failed to create database' });
    } else {
      console.log('Database created or already exists');

      // Select the database to use
      const useDatabaseQuery = `USE mydatabase`;
      connection.query(useDatabaseQuery, (useDatabaseError) => {
        if (useDatabaseError) {
          console.error('Error using database:', useDatabaseError);
          res.status(500).json({ error: 'Failed to use database' });
        } else {
          console.log('Using database');

          // Create user_data table if it doesn't exist
          const createTableQuery = `CREATE TABLE IF NOT EXISTS user_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(50),
            lastname VARCHAR(50),
            email VARCHAR(100),
            phone VARCHAR(15),
            gender VARCHAR(10),
            birthday DATE,
            age INT,
            job VARCHAR(100),
            language VARCHAR(100),
            degree VARCHAR(100),
            job_preference VARCHAR(100),
            color VARCHAR(7),
            university VARCHAR(100),
            previousExperience TEXT
          )`;

          connection.query(createTableQuery, (error) => {
            if (error) {
              console.error('Error creating user_data table:', error);
              res.status(500).json({ error: 'Failed to create user_data table' });
            } else {
              console.log('user_data table created or already exists');

              // Insert user data into the user_data table
              const insertQuery = 'INSERT INTO user_data (firstname, lastname, email, phone, gender, birthday, age, job, language, degree, job_preference, color, university, previousExperience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
              const values = [
                userData.firstname,
                userData.lastname,
                userData.email,
                userData.phone,
                userData.gender,
                userData.birthday,
                userData.age,
                userData.job,
                userData.language,
                userData.degree,
                userData.job_preference,
                userData.color,
                userData.university,
                userData.previousExperience
              ];

              console.log(values);
              console.log('Values from Server.js file');
              connection.query(insertQuery, values, (insertError, results) => {
                if (insertError) {
                  console.error('Error inserting user data:', insertError);
                  res.status(500).json({ error: 'Failed to insert user data' });
                } else {
                  console.log('User data inserted successfully');
                  res.status(200).json({ message: 'User data inserted successfully' });
                }
              });
            }
          });
        }
      });
    }
  });
});

app.get('/displayResults', (req, res) => {
  // Fetch user data from the user_data table
  const selectQuery = 'SELECT * FROM user_data';
  connection.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    } else {
      console.log('User data fetched successfully');
      res.status(200).json(results);
    }
  });
});


// Start the server
//const port = 3000; 
const port=process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
