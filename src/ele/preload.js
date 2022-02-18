const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  send: (name, value) => {
    ipcRenderer.invoke(name, value);
  },
  receive: (name, cb) => {
    console.log('receive called', name);
    ipcRenderer.on(name, cb);
  },
});
