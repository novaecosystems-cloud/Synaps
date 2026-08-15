const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isDesktop: true,
  platform: process.platform,
  selectFolder: () => ipcRenderer.invoke('select-watched-folder'),
});

contextBridge.exposeInMainWorld('electronAPI', {
  hideSpotlight: () => ipcRenderer.send('hide-spotlight'),
  expandToFullApp: (query) => ipcRenderer.send('expand-to-full-app', query),
  querySpotlight: (data) => ipcRenderer.invoke('query-spotlight', data),
  captureScreen: () => ipcRenderer.invoke('capture-screen'),
  analyzeScreen: (data) => ipcRenderer.invoke('analyze-screen', data),
  getLegalConsent: () => ipcRenderer.invoke('get-legal-consent'),
  setLegalConsent: (granted) => ipcRenderer.invoke('set-legal-consent', granted),
  onSpotlightResult: (callback) => ipcRenderer.on('spotlight-result', (event, val) => callback(val)),
});
