const FirebaseClient = require('./FirebaseClient');
const SpotifyClient = require('./SpotifyClient');
const DataLayer = require('./DataLayer');
const Logger = require('./Logger');

const main = async () => {
  const l = new Logger('decrement');
  l.log('Decrementing all votes by `4`');

  try {
    const firebaseClient = new FirebaseClient();

    // retrieve all songs from the database
    const allTracks = await firebaseClient.getAllTracks();
    const votes = {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
    };
    // decrement their votes by 4
    for (const track of allTracks) {
      for (const trackVote of track.votes) {
        const vote = '' + trackVote.vote;
        votes[vote]++;
      }
    }

    for (const vote in votes) {
      await firebaseClient.setVote(vote, votes[vote]);
    }
  } catch (e) {
    l.err(e);
  }
};

main();
