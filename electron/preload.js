const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isDesktop: true,
  platform: process.platform,
  selectFolder: () => ipcRenderer.invoke('select-watched-folder'),
});
