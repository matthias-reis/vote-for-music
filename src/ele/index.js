const { join } = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');

const Logger = require('../be/logger');
const { initController, doVote, setQuery } = require('./controller');

const l = new Logger('electron');

let win;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const createWindow = () => {
  win = new BrowserWindow({
    width: 360,
    height: 720,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });
};

const handleVote = (_, vote) => doVote(vote);
const handleQuery = (_, query) => setQuery(query);

const handleReset = () => handleQuery('');

const run = async () => {
  l.log('starting VfM electron process');
  await app.whenReady();
  l.log('ready VfM electron process');
  createWindow();
  win.loadURL(process.env.ELECTRON_START_URL || '');

  await initController(win.webContents);
};

run();

ipcMain.handle('vote', handleVote);
ipcMain.handle('query', handleQuery);
ipcMain.handle('reset', handleReset);
