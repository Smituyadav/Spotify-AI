const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const querystring = require('querystring');

dotenv.config();

const app = express();
app.use(cors());

const PORT = 5000;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

// ✅ This is the fix for "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🎧 Spotify-AI backend is running!');
});

// 🔐 Generate random string for state
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// 🚪 Login Route
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-top-read user-read-playback-state user-read-recently-played';

  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// 🌀 Callback route
app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    res.redirect(`${FRONTEND_URI}?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error('Error getting tokens:', error.response.data);
    res.send('Something went wrong...');
  }
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}/login`);
});
// Export the app for testing purposes