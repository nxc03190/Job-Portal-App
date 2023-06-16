const express = require('express');
const mysql = require('mysql');
const path = require('path')
const app = express();
app.use(express.json());



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





// Configure MySQL connection
const connection = mysql.createConnection({
  host: 'localhost', // Replace with your MySQL host
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'myjobportaldb', // Replace with your MySQL database name
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
  
    // Insert user data into the MySQL database
    const query = 'INSERT INTO users (firstname, lastname, email, Phone, password, gender, birthday, quantity, language1, color, login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      userData.firstname,
      userData.lastname,
      userData.email,
      userData.Phone,
      userData.password,
      userData.gender,
      userData.birthday,
      userData.quantity,
      userData.language1,
      userData.color,
      userData.login
    ];

    console.log(values)
    console.log('Values from Server.js file')
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error inserting user data:', error);
        res.status(500).json({ error: 'Failed to insert user data' });
      } else {
        console.log('User data inserted successfully');
        res.status(200).json({ message: 'User data inserted successfully' });
      }
    });
  });
  

// Start the server
const port = 3000; // Replace with your desired port number
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
