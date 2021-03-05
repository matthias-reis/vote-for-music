const net = require('net');
const { exec } = require('child_process');

process.env.ELECTRON_START_URL = `http://localhost:3000`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => {
  client.connect({ port: 3000 }, () => {
    client.end();
    if (!startedElectron) {
      console.log('starting electron');
      startedElectron = true;
      exec('yarn ele', (e, so, se) => {
        e && console.error(e);
        so && console.log(so);
        se && console.log(se);
      });
    }
  });
};

tryConnection();

client.on('error', () => {
  setTimeout(tryConnection, 1000);
});
