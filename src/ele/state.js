const Logger = require('../be/logger');
const elasticlunr = require('elasticlunr');
const l = new Logger('state');

const STATE_SIZE = 10;

let rawState = [];
let refinedState = [];
let indexedState = {};
let index;
let state = [];
let query = '';
let sync = () => {};

const refine = () => {
  l.log('CALL refine');

  if (rawState.length > 0) {
    refinedState = rawState
      .sort((a, b) => (b.artist < a.artist ? 1 : -1))
      .sort((a, b) => b.value - a.value)
      .map((s, i) => {
        const doc = { ...s, rank: i + 1, type: 'entry' };
        return doc;
      });
    indexedState = refinedState.reduce((index, next) => {
      index[next.trackId] = next;
      return index;
    }, {});
  }
};

const select = () => {
  l.log('CALL select', query);

  if (refinedState.length > 0) {
    // if query is empty, we deliver the first 5 and the last 1
    if (query === '') {
      l.log('select top 100');
      state = refinedState.slice(0, 100);
    } else if (query.startsWith('track:')) {
      // the track is in the center
      const trackId = query.replace('track:', '').trim();
      l.log('select single track', trackId);
      const inspectedRank = indexedState[trackId].rank;
      let start = 0;
      if (inspectedRank > STATE_SIZE / 2) {
        start = inspectedRank - STATE_SIZE / 2;
      }
      if (inspectedRank > refinedState.length - STATE_SIZE / 2) {
        start = inspectedRank - STATE_SIZE - 1;
      }
      state = refinedState.slice(start, start + STATE_SIZE);
    } else if (!isNaN(parseInt(query, 10))) {
      const start = parseInt(query, 10) - 1;
      state = refinedState.slice(start, start + 100);
    } else {
      //query is an arbitrary string
      l.log('select search', query);
      state = refinedState.filter(
        (item) => item.trackId?.toLowerCase().indexOf(query.toLowerCase()) > -1
      );
    }
    sync(state);
  }
};

const s = {
  setQuery: (q = '') => {
    l.log('CALL setQuery', q);
    query = q;
    select();
  },
  setRawState: (incomingRawState) => {
    l.log('CALL setRawState');
    rawState = incomingRawState;
    refine();
    select();
  },
  setSyncHandler: (handler) => {
    l.log('CALL setSyncHandler');
    sync = handler;
  },
  getRawState: () => {
    l.log('CALL getRawState');
    return rawState;
  },
};

module.exports = s;
