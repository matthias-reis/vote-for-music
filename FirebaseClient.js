// const firebase = require('firebase');
// require('firebase/firestore');

const admin = require('firebase-admin');
const serviceAccount = require('../vote-for-music.json');

const Logger = require('./Logger');

module.exports = class FirebaseClient {
  settingsCollection = null;
  tracksCollection = null;
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
    this.tracksCollection = db.collection('tracks');
    this.settingsCollection = db.collection('settings');
    this.spotifyAuthDoc = this.settingsCollection.doc('spotify');
  }

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
  getTrack = async trackId => {
    const track = await this.tracksCollection.doc(trackId).get();
    if (track.exists) {
      return track.data();
    } else {
      return null;
    }
  };

  setSpotifyAuth = auth => this.spotifyAuthDoc.set(auth);

  setSong = (id, track) => this.tracksCollection.doc(id).set(track);

  incrementVote = async vote => {
    const res = await this.votesCollection.doc('' + vote).get();
    let count = 0;
    if (res.exists) {
      count = res.data().count;
    }
    count = count + 1;
    await this.votesCollection.doc('' + vote).set({ vote, count });
  };

  getAllVotes = async () => {
    const resp = await this.votesCollection.get();
    const ret = [];
    resp.forEach(doc => {
      ret.push(doc.data());
    });
    return ret;
  };
  getAllTracks = async () => {
    const resp = await this.tracksCollection.get();
    const ret = [];
    resp.forEach(doc => {
      ret.push(doc.data());
    });
    return ret;
  };

  getCurrentStats = async () => {
    const allVotes = this.getAllVotes();
  };
};
