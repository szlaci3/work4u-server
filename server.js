const express = require('express');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
const redis = new Redis('redis://red-ci6l9mp8g3nfucbohhu0:6379');

app.use(express.json()); // Enable JSON request body parsing

const whitelist = ['https://work4u.onrender.com', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// client.set('usernames', JSON.stringify(['22']));
client.set('credentials', JSON.stringify({'22': '22'}));

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Get the credentials from Redis
  redis.get('credentials', (err, storedCredentials) => {
    if (err) {
      console.error('Error retrieving credentials from Redis:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Parse the stored credentials from JSON
    const credentials = JSON.parse(storedCredentials);

    // Check if the username exists in the credentials
    if (credentials.hasOwnProperty(username) && password === credentials[username]) {
      // Passwords match, return successful login status
      return res.json({ status: 'success', message: 'Login successful' });
    }

    // Invalid username or password    
    return res.json({ status: 'error', message: 'Invalid username or password' });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

