// const firebase = require('firebase');
// require('firebase/firestore');

const admin = require('firebase-admin');
const serviceAccount = require('../vote-for-music.json');

const Logger = require('./Logger');

module.exports = class FirebaseClient {
  settingsCollection = null;
  votesCollection = null;
  spotifyAuthDoc = null;
  l = null;

  constructor() {
    this.l = new Logger('firebase');
    this.l.log('Initializing firebase client');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://vote-for-music.firebaseio.com',
    });

    const db = admin.firestore();

    this.votesCollection = db.collection('votes');
    this.settingsCollection = db.collection('settings');
    this.spotifyAuthDoc = this.settingsCollection.doc('spotify');
  }

  addVote = data => this.votesDoc.add(data);

  getSpotifyAuth = async () => {
    const auth = await this.spotifyAuthDoc.get();
    if (auth.exists) {
      return auth.data();
    } else {
      throw new Error(
        'FIREBASE: spotify auth data are not set on the firebase server.'
      );
    }
  };

  setSpotifyAuth = async (refreshToken, accessToken) => {
    const auth = await this.getSpotifyAuth();
    await this.spotifyAuthDoc.set({
      ...auth,
      refreshToken,
      accessToken,
    });
  };
};

// const main = async () => {
//   try {
//     const spotify = new Spotify({
//       clientId: spotifyClientId,
//       clientSecret: spotifyClientSecret,
//     });
//     const data = await spotify.clientCredentialsGrant();
//     spotify.setAccessToken(data.body['access_token']);

//     console.log(data.body['access_token']);
//     console.log(await spotify.getMe());

//     let docRef = collection.doc('votes');

//     docRef.set({
//       song: 'New Day',
//       last: 'Karnivool',
//       weight: 102,
//     });
//     snapshot = await collection.get();
//     console.log(snapshot);
//   } catch (e) {
//     console.error(e);
//   }
// };

// main();
