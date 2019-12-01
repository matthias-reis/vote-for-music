const FirebaseClient = require('./FirebaseClient');
const SpotifyClient = require('./SpotifyClient');
const Logger = require('./Logger');

const main = async () => {
  const l = new Logger('main');
  l.log('Voting process starting');

  try {
    const firebaseClient = new FirebaseClient();
    const spotifyClient = new SpotifyClient(firebaseClient);
    await spotifyClient.authenticate();

    // const spotify = new Spotify({
    //   clientId: spotifyClientId,
    //   clientSecret: spotifyClientSecret,
    // });

    // const data = await spotify.clientCredentialsGrant();
    // spotify.setAccessToken(data.body['access_token']);

    // console.log(data.body['access_token']);
    // console.log(await spotify.getMe());

    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount),
    //   databaseURL: 'https://vote-for-music.firebaseio.com',
    // });

    // const db = admin.firestore();

    // const collection = db.collection('vote-for-music');

    // let docRef = collection.doc('votes');

    // docRef.set({
    //   song: 'New Day',
    //   last: 'Karnivool',
    //   weight: 102,
    // });
    // snapshot = await collection.get();
    // console.log(snapshot);
  } catch (e) {
    l.err(e);
  }
};

main();
