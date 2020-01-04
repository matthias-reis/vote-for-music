const FirebaseClient = require('./FirebaseClient');
const SpotifyClient = require('./SpotifyClient');
const DataLayer = require('./DataLayer');
const Logger = require('./Logger');

const main = async () => {
  const l = new Logger('vote');
  l.log('Voting process starting');

  try {
    if (process.argv.length < 3) {
      throw new Error('Please provide a vote');
    }

    // authenticating with all clients
    const firebaseClient = new FirebaseClient();
    const spotifyClient = new SpotifyClient(firebaseClient);
    await spotifyClient.authenticate();

    // retrieve datas of current track
    const spotifyTrack = await spotifyClient.getCurrentTrack();
    const trackId = DataLayer.getTrackId(spotifyTrack);
    const firebaseTrack = await firebaseClient.getTrack(trackId);
    const currentTrack = firebaseTrack || spotifyTrack;

    // persist vote
    const date = new Date().toISOString();
    const vote = process.argv[2];

    const votes = [...(currentTrack.votes || []), { vote, date }];
    await firebaseClient.setSong(trackId, {
      ...currentTrack,
      trackId,
      votes,
    });
    await firebaseClient.incrementVote(vote);

    l.log(`${l.b('VOTED: ' + vote)} for <<${trackId}>>`);

    // get overall vote average
    const currentTrackAverage =
      votes.map(v => v.vote).reduce((p, n) => p + parseInt(n), 0) /
      votes.length;
    const dl = new DataLayer(firebaseClient);
    await dl.init();

    // print out results for song
    l.log(`(${votes.map(v => v.vote).join(', ')})`);
    l.log(`current vote: ${l.b(vote)}`);
    l.log(
      `current average: ${l.b(currentTrackAverage)} in ${l.b(
        vote.length
      )} votes`
    );
    l.log(`overallvotes cast so far: ${l.b(dl.getVotesCount())}`);
    l.log(
      `current evaluation: ${l.b(
        dl.evaluateSong(currentTrackAverage).toFixed(1)
      )}`
    );

    // get overview of all votes.
    // retrieve all voted songs
    const allTracks = await firebaseClient.getAllTracks();
    const allEvaluations = dl.evaluateSongs(allTracks);

    const presentation = [];
    allEvaluations
      .sort((a, b) => b.value - a.value)
      .forEach((evaluation, i) => {
        const top = 3;
        const bottom = allEvaluations.length - 2;
        if (i < top || i > bottom) {
          presentation.push({ evaluation, i });
        } else if (evaluation.trackId === trackId && i > top && i < bottom) {
          presentation.push({ evaluation: allEvaluations[i - 1], i: i - 1 });
          presentation.push({ evaluation: allEvaluations[i], i });
          presentation.push({ evaluation: allEvaluations[i + 1], i: i + 1 });
        } else if (evaluation.trackId === trackId && i === bottom) {
          presentation.push({ evaluation: allEvaluations[i - 1], i: i - 1 });
          presentation.push({ evaluation: allEvaluations[i], i });
        } else if (evaluation.trackId === trackId && i === top) {
          presentation.push({ evaluation: allEvaluations[i], i });
          presentation.push({ evaluation: allEvaluations[i + 1], i: i + 1 });
        }
      });
    presentation.forEach(item => {
      const str = `${item.i + 1}.   ${item.evaluation.value.toFixed(1)} : ${
        item.evaluation.trackId
      }`;
      if (item.evaluation.trackId === trackId) {
        l.log(l.b(str));
      } else {
        l.log(str);
      }
    });
  } catch (e) {
    l.err(e);
  }
};

main();
