// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

  // STEP 1: Get token from URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const _token = hashParams.get('access_token');
   if (_token) {
  setToken(_token);
  window.history.replaceState({}, document.title, "/");
}
  }, []);

  // STEP 2: Once token is available, fetch data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        // Get Profile Info
        const profileRes = await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(profileRes.data);

        // Get Top Tracks
        const topRes = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopTracks(topRes.data.items);
      } catch (err) {
        console.error('❌ Error fetching from Spotify:', err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="app">
      {!token ? (
        <a href="https://accounts.spotify.com/authorize?client_id=ef993022b8aa4870bdfe01a14d5ac039&redirect_uri=https://sponsors-oaks-released-naked.trycloudflare.com/callback&response_type=token&scope=user-read-private%20user-read-email%20user-top-read"
  className="login-button"
>
  Login with Spotify
        </a>
      ) : (
        <div className="glass-card">
          {profile && (
            <>
              <img src={profile.images?.[0]?.url} alt="Profile" className="profile-pic" />
              <h2>{profile.display_name}</h2>
              <p>{profile.email}</p>
            </>
          )}

          <h3>Your Top Tracks</h3>
          <div className="track-grid">
            {topTracks.map((track) => (
              <div className="track-card" key={track.id}>
                <img src={track.album.images[0].url} alt={track.name} />
                <div className="track-name">{track.name}</div>
                <div className="artist-name">{track.artists[0].name}</div>
                <div className="track-popularity">Popularity: {track.popularity}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
// Note: Make sure to replace the login URL with your server's URL when deploying.
// The current URL is set to `http://localhost:5000/login` for local development
// and should be updated to your production URL when deploying.
// Also, ensure that the server is running and accessible from the frontend.
// The server should handle the Spotify OAuth flow and redirect to this app with the access token.
// This app fetches the user's profile and top tracks from Spotify using the access token.
// Make sure to handle errors and edge cases in a production app.
// You can further enhance the UI and add more features like displaying playlists, liked songs, etc.
// This is a basic setup to get you started with Spotify API integration in a React app.
// Make sure to install the necessary dependencies:
// npm install axios react-router-dom
// Also, ensure that your Spotify app is configured correctly with the right redirect URIs.
// This code is a simple React app that integrates with the Spotify API to fetch user profile and top tracks.
// It uses the access token obtained from the OAuth flow to make API requests.