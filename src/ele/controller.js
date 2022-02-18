const { mean, std } = require('mathjs');

const FirebaseClient = require('../be/firebase-client');
const SpotifyClient = require('../be/spotify-client');
const Logger = require('../be/logger');

let firebase;
let spotify;
let client;
let state = require('./state');

const l = new Logger('controller');

const c = {
  initController: async (electronClient) => {
    l.log('CALL initController');
    client = electronClient;
    firebase = new FirebaseClient();
    spotify = new SpotifyClient(firebase);
    await spotify.authenticate();
    state.setSyncHandler(sync);
    await c.retrieveData();
  },
  retrieveData: async () => {
    l.log('CALL retreive data');
    try {
      const tracks = await firebase.getAllTracks();
      const votes = await firebase.getAllVotes();
      const evaluatedTracks = evaluateSongs(tracks, votes);
      state.setRawState(evaluatedTracks);
    } catch (e) {
      l.err(e);
    }
  },
  setQuery: (query) => {
    l.log('CALL setQuery', query);
    state.setQuery(query);
  },
  doVote: async (vote) => {
    l.log('CALL doVote', vote);
    const spotifyTrack = await spotify.getCurrentTrack();
    const currentTrackId = `${spotifyTrack.artist} - ${spotifyTrack.title}`.replace(
      /\//g,
      '-'
    );
    const firebaseTrack = await firebase.getTrack(currentTrackId);
    const currentTrack = firebaseTrack || spotifyTrack;
    const date = new Date().toISOString();
    const votes = [...(currentTrack.votes || []), { vote, date }];
    const trackToStore = {
      ...currentTrack,
      trackId: currentTrackId,
      votes,
    };
    await firebase.setSong(currentTrackId, trackToStore);
    await firebase.incrementVote(vote);

    const rawState = [...state.getRawState()];

    const foundIndex = rawState.findIndex(
      (item) => item.trackId === currentTrackId
    );

    if (foundIndex === -1) {
      rawState.push(trackToStore);
      l.log('inserting item to local data');
    } else {
      rawState[foundIndex] = trackToStore;
      l.log('updating local data', foundIndex);
    }
    const allVotes = await firebase.getAllVotes();
    const evaluatedTracks = evaluateSongs(rawState, allVotes);
    state.setRawState(evaluatedTracks);

    const query = `track: ${trackToStore.trackId}`;
    state.setQuery(query);
    client.send('query', query);
  },
};

const sync = (state) => {
  l.log('CALL sync');
  client.send('state', state);
};

const evaluateSongs = (songs, votes) => {
  const { average, deviation } = calculateStats(votes);
  return songs.map((song) => {
    if (!song.votes) {
      l.err('no votes found', song);
    }
    const currentTrackAverage =
      song.votes.map((v) => v.vote).reduce((p, n) => p + parseInt(n), 0) /
      song.votes.length;
    return {
      artist: song.artist,
      title: song.title,
      album: song.album,
      value: evaluateSong(currentTrackAverage, average, deviation),
      votes: song.votes,
      trackId: song.trackId,
    };
  });
};

const evaluateSong = (songValue, average, deviation) =>
  100 + (15 * (songValue - average)) / deviation;

const calculateStats = (votes) => {
  const votesArr = votes.reduce((res, { vote, count }) => {
    res = [...res, ...Array(count).fill(parseInt(vote))];
    return res;
  }, []);

  const average = mean(votesArr);
  const deviation = std(votesArr);

  return { average, deviation };
};

module.exports = c;
