const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isDesktop: true,
  platform: process.platform,
  selectFolder: () => ipcRenderer.invoke('select-watched-folder'),
});

contextBridge.exposeInMainWorld('electronAPI', {
  hideSpotlight: () => ipcRenderer.send('hide-spotlight'),
  expandToFullApp: (query) => ipcRenderer.send('expand-to-full-app', query),
  querySpotlight: (data) => ipcRenderer.send('query-spotlight', data),
  onSpotlightResult: (callback) => ipcRenderer.on('spotlight-result', (event, val) => callback(val)),
});
