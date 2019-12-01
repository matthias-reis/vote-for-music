// const firebase = require('firebase');
// require('firebase/firestore');
const spotifyClientId = 'dbd2e1b11ff54b62a3155e6db2476662';
const spotifyClientSecret = '32950415165c4c3f947ca64910233565';

const Spotify = require('spotify-web-api-node');

const Logger = require('./Logger');

module.exports = class SpotifyClient {
  l = null;
  firebase = null;

  constructor(firebaseClient) {
    this.l = new Logger('spotify');
    this.firebase = firebaseClient;
    this.l.log('Initializing spotify client');
  }

  async authenticate() {
    const authData = await this.firebase.getSpotifyAuth();
    this.l.log(authData);
  }
};
