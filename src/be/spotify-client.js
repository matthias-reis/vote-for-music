const express = require('express');
const open = require('open');
const Spotify = require('spotify-web-api-node');

const Logger = require('./logger');

const scopes = ['user-read-currently-playing'];

module.exports = class SpotifyClient {
  constructor(firebaseClient) {
    this.l = new Logger('spotify');
    this.firebase = firebaseClient;
    this.l.log('Initializing spotify client');
  }

  authenticate = async () => {
    this.l.log('Starting authentication');
    if (!this.authData) {
      this.l.log('Fetching auth data');
      this.authData = {
        ...(await this.firebase.getSpotifyAuth()),
        redirectUri: 'http://localhost:3456/return',
      };
    }

    if (!this.spotify) {
      this.spotify = new Spotify(this.authData);
    }

    if (this.authData.accessToken) {
      this.l.log('auth ready');
      this.currentAccessToken = this.authData.accessToken;
    } else if (this.authData.refreshToken) {
      this.l.log('no access token - refreshing');
      await this.authenticateWithRefreshToken();
    } else {
      this.l.log('no authorisation - starting full process');
      await this.authenticateWithAuthorization();
    }
  };
  authenticateWithRefreshToken = async () => {
    this.l.log('Refreshing access token');

    const { body } = await this.spotify.refreshAccessToken();
    this.authData.accessToken = body['access_token'];
    this.spotify.setCredentials(this.authData);

    await this.persistAuthData();

    this.accessToken = body.accessToken;
  };

  authenticateWithAuthorization = async () =>
    new Promise((resolve, reject) => {
      const app = express();

      app.get('/return', async (req, res) => {
        res.set('Content-Type', 'text/html');
        res.end('<script>window.close();</script>');

        const code = req.query.code;

        const { body } = await this.spotify.authorizationCodeGrant(code);

        this.authData.accessToken = body['access_token'];
        this.authData.refreshToken = body['refresh_token'];
        this.spotify.setCredentials(this.authData);

        await this.persistAuthData();

        this.accessToken = body.accessToken;
        resolve();
      });

      app.listen(3456, () => {
        this.l.log('Waiting for authentication');
      });

      const url = this.spotify.createAuthorizeURL(scopes);
      open(url);
    });

  persistAuthData = () => this.firebase.setSpotifyAuth(this.authData);

  getCurrentTrack = async () => {
    this.l.log('Retrieving current track');
    try {
      const {
        body: { item },
      } = await this.spotify.getMyCurrentPlayingTrack();
      if (!item) {
        this.l.err('Please play a song before voting.');
        process.exit(0);
      }
      const artist = item.artists[0].name;
      const album = item.album.name;
      const title = item.name;
      const url = item['preview_url'];

      this.l.log(`current track: ${artist} - ${title}`);
      return { artist, album, title, url };
    } catch (e) {
      this.l.err('not authorized, refreshing token');
      await this.authenticateWithRefreshToken();
      return await this.getCurrentTrack();
    }
  };

  find = async (artist, title) => {
    // this.l.log(`searching for ${this.l.b(title)} from ${this.l.b(artist)}`);
    try {
      const {
        body: {
          tracks: { items },
        },
      } = await this.spotify.searchTracks(`${artist} ${title}`);
      if (items.length === 0) {
        // this.l.err(`not found: ${this.l.b(title)} from ${this.l.b(artist)}`);
        return null;
      }
      const hits = items
        .map(({ name, artists, album, preview_url }) => ({
          title: name,
          album: album.name,
          artist: artists.map((i) => i.name)[0],
          url: preview_url,
        }))
        .filter(
          ({ title: incomingTitle, artist: incomingArtist }) =>
            incomingTitle.toLowerCase() === title.toLowerCase() &&
            incomingArtist.toLowerCase() === artist.toLowerCase()
        );
      if (hits.length === 0) {
        // this.l.err(
        //   `nothing adequate found: ${this.l.b(title)} from ${this.l.b(artist)}`
        // );
        return null;
      }

      return hits[0];
    } catch (e) {
      this.l.err(`not authorized, refreshing token (${e.message})`);
      await this.authenticateWithRefreshToken();
      return await this.find(artist, title);
    }
  };
};
