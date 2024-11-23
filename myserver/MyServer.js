const express = require('express');
const session = require('express-session');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // For serving static files like html and css

// Session setup
app.use(
  session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
  })
);

// In-memory storage for demo purposes
const users = {};

// Route to Root, login page in this case
app.get('/', (req, res) => {
  res.send(
    `<link rel = "stylesheet" href = "/style.css">
    <dic class = "welcome-container">
    <h1> Welcome to the App </h1>
    <p><a href = "/register.html">Register</a> | <a href = "/login.html">Login</a></p>
    </div>`
  );
});

// Render registration page. If not using express static
// app.get('/register', (req, res) => {
//   res.sendFile('register.html');
// });

// Handle registration (no password encryption)
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send('Username and password are required!');
  }

  users[username] = { password };
  res.redirect('/login.html');
});

// Render login page. Not using express static
// app.get('/login', (req, res) => {
//   res.sendFile('login.html');
// });

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  // Displays error message and redirect to login page for reattempt
  if (!user || user.password !== password) {
    // res.send('Invalid username or password');
    // req.session.error = 'Invalid Username or Password';

    return res.send(`<script> alert('Invalid Username or Password');
              window.location.href = '/login.html';
              </script>`);
  }

  req.session.username = username;
  res.redirect('/profile');
});

// Logout and destroy session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send('Error logging out');
    res.redirect('/login.html');
  });
});

// Display profile if logged in
app.get('/profile', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login.html');
  }

  fs.readFile(__dirname + '/profile.html', 'utf-8', (err, data)=>{
    if(err){
      return res.status(500).send("Error loading profile page");
    }
    // Replacing placeholder in profile.html
    // const user_details = {
    //   '{{username}}' : req.session.username, 
    //   '{{password}}' : res.session.password
    // };

    res.send(data.replace('{{username}}', req.session.username));
  });

  // res.send(`
  //   <h1>Welcome, ${req.session.username}</h1>
  //   <a href="/logout">Logout</a>
  // `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
