const { join } = require('path');
const { readFileSync } = require('fs');

const FirebaseClient = require('./FirebaseClient');
const SpotifyClient = require('./SpotifyClient');
const DataLayer = require('./DataLayer');
const Logger = require('./Logger');

const ranges = [95, 94, 93, 91, 89, 85, 80, 70, 60, 50, 40, 30, 20, 10, 0]; // 1 to 15

const translate = vote => ranges.map(min => vote >= min).filter(Boolean).length;

const wait = sec => new Promise(resolve => setTimeout(resolve, sec));

const main = async () => {
  const l = new Logger('bulk');
  l.log('bulk processing starting');

  try {
    const firebaseClient = new FirebaseClient();
    const spotifyClient = new SpotifyClient(firebaseClient);
    await spotifyClient.authenticate();

    const data = readFileSync(join(__dirname, 'data.tsv'), 'utf-8')
      .split('\n')
      .map(line => {
        const [title, artist, meta] = line.split('\t');
        let [_, votes] = meta.replace(']', '').split('[');
        votes = votes.split(',');
        const vote = votes[votes.length - 1];
        const translated = translate(vote);
        return { title, artist, vote, translated };
      });
    for (const { artist, title, translated } of data) {
      const trackName = `${artist} - ${title}`;
      l.log(`checking track: ${trackName}`);
      await wait(500);

      const track = await spotifyClient.find(artist, title);
      if (!track) {
        l.err(`track not found: ${trackName}`);
      } else {
        l.log(`track found: ${trackName}. Voting ${translated}`);
        const trackId = DataLayer.getTrackId(track);
        const firebaseTrack = await firebaseClient.getTrack(trackId);
        const currentTrack = firebaseTrack || track;

        const date = new Date().toISOString();
        const vote = translated;

        const votes = [...(currentTrack.votes || []), { vote, date }];
        await firebaseClient.setSong(trackId, {
          ...currentTrack,
          trackId,
          votes,
        });
        await firebaseClient.incrementVote(vote);
      }
    }
  } catch (e) {
    l.err(e);
  }
};

main();
