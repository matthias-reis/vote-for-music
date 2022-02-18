const net = require('net');
const { spawn } = require('child_process');
const Logger = require('../be/logger');

process.env.ELECTRON_START_URL = `http://localhost:3000`;

const client = new net.Socket();
let startedElectron = false;
const l = new Logger('bootstrap');

const tryConnection = () => {
  l.log('bootstrapping VfM');
  client.connect({ port: 3000 }, () => {
    client.end();
    if (!startedElectron) {
      l.log('launching VfM electron process');
      startedElectron = true;
      spawn('yarn', ['ele'], {
        stdio: [process.stdin, process.stdout, process.stderr],
      });
    }
  });
};

tryConnection();

client.on('error', () => {
  setTimeout(tryConnection, 1000);
});
