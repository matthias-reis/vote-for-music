const { mean, std } = require('mathjs');
module.exports = class DataLayer {
  constructor(firebaseClient) {
    this.firebaseClient = firebaseClient;
  }

  init = async () => {
    this.allVotes = await this.firebaseClient.getAllVotes();
    const { average, deviation } = this.calculateStats(this.allVotes);
    this.average = average;
    this.deviation = deviation;
  };

  calculateStats = votes => {
    const votesArr = votes.reduce((res, { vote, count }) => {
      res = [...res, ...Array(count).fill(parseInt(vote))];
      return res;
    }, []);

    const average = mean(votesArr);
    const deviation = std(votesArr);

    return { average, deviation };
  };

  evaluateSong = songValue =>
    100 + (15 * (songValue - this.average)) / this.deviation;

  evaluateSongs = songs =>
    songs.map(song => {
      const currentTrackAverage =
        song.votes.map(v => v.vote).reduce((p, n) => p + parseInt(n), 0) /
        song.votes.length;
      return {
        value: this.evaluateSong(currentTrackAverage),
        trackId: song.trackId,
      };
    });

  getVotesCount = () =>
    this.allVotes.reduce((res, { vote, count }) => {
      res = res + count;
      return res;
    }, 0);
};

module.exports.getTrackId = track =>
  `${track.artist} - ${track.title}`.replace(/\//g, '-');
