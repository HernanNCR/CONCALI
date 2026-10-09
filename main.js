const { app, BrowserWindow } = require('electron');
const path = require('path');
// const { spawn } = require('child_process');

let mainWindow;

app.whenReady().then(() => {
  try {
    require(path.join(__dirname, 'backend', 'server.js'));
    console.log('✅ Backend principal levantado');
  } catch (err) {
    console.error('❌ Error cargando server.js:', err);
  }


  // 🔹 Crear la ventana de Electron
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    maxWidth: 900,
    maxHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),  // Revisa que la ruta sea correcta
    },
    icon: path.join(__dirname, 'conagua-logo.ico'),
  });

  const isDev = !app.isPackaged;

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'frontend', 'build', 'index.html')}`;

  mainWindow.loadURL(startURL);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
