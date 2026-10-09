// const { contextBridge, ipcRenderer } = require('electron');

// // Aquí exponemos funciones seguras para que el frontend (React) pueda usar
// contextBridge.exposeInMainWorld('electronAPI', {
//   // Método para enviar mensajes al main
//   send: (channel, data) => {
//     const validChannels = ['toMain'];
//     if (validChannels.includes(channel)) {
//       ipcRenderer.send(channel, data);
//     }
//   },

//   // Método para recibir mensajes del main
//   on: (channel, func) => {
//     const validChannels = ['fromMain'];
//     if (validChannels.includes(channel)) {
//       // Aquí recibe el evento y argumentos
//       ipcRenderer.on(channel, (event, ...args) => func(...args));
//     }
//   }
// });



