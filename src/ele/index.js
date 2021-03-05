const { app, BrowserWindow, ipcMain } = require('electron');

console.log(process.env.ELECTRON_START_URL);

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 360,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(process.env.ELECTRON_START_URL || '');
};

app.whenReady().then(createWindow);

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

ipcMain.on('vote', (...props) => console.log(props));
ipcMain.on('search', (...props) => console.log(props));
