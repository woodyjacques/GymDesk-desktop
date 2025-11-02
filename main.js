const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let nestProcess;
let mainWindow;
const isDev = !app.isPackaged;

// Configuración del auto-updater
autoUpdater.autoDownload = false; // No descargar automáticamente
autoUpdater.autoInstallOnAppQuit = true; // Instalar al cerrar la app

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: require(`${__dirname}/node_modules/electron`)
  });
}

function killNestProcess() {
  if (nestProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', nestProcess.pid, '/f', '/t']);
      } else {
        nestProcess.kill('SIGTERM');
      }
      nestProcess = null;
    } catch (err) {
      console.error('Error al matar proceso NestJS:', err);
    }
  }
}

function startNestServer() {

  let nestPath;
  let backendDir;

  if (isDev) {
    nestPath = path.join(__dirname, '../GymDesk-backend/dist/main.js');
    backendDir = path.join(__dirname, '../GymDesk-backend');
  } else {
    nestPath = path.join(process.resourcesPath, 'backend', 'main.js');
    backendDir = path.join(process.resourcesPath, 'backend');
  }

  nestProcess = spawn('node', [nestPath], {
    stdio: 'ignore',
    shell: false,
    cwd: backendDir,
    detached: false,
    windowsHide: true,
    env: { ...process.env, PORT: '4001', NODE_ENV: isDev ? 'development' : 'production' }
  });

  nestProcess.on('close', (code) => {
    nestProcess = null;
  });

}

function createWindow() {

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1080,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.maximize();
  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    killNestProcess();
    mainWindow = null;
  });
}

// ============================================
// AUTO-UPDATER - Sistema de actualizaciones
// ============================================

function setupAutoUpdater() {
  // Solo verificar updates en producción
  if (isDev) {
    console.log('Modo desarrollo - Auto-update deshabilitado');
    return;
  }

  // Evento: Verificando actualizaciones
  autoUpdater.on('checking-for-update', () => {
    console.log('Verificando actualizaciones...');
  });

  // Evento: Actualización disponible
  autoUpdater.on('update-available', (info) => {
    console.log('Actualización disponible:', info.version);
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización disponible',
      message: `Una nueva versión ${info.version} está disponible.`,
      detail: '¿Deseas descargar e instalar la actualización?',
      buttons: ['Descargar', 'Más tarde'],
      defaultId: 0,
      cancelId: 1
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  // Evento: No hay actualizaciones
  autoUpdater.on('update-not-available', (info) => {
    console.log('La aplicación está actualizada:', info.version);
  });

  // Evento: Progreso de descarga
  autoUpdater.on('download-progress', (progressObj) => {
    let message = `Velocidad de descarga: ${progressObj.bytesPerSecond}`;
    message += ` - Descargado ${progressObj.percent}%`;
    message += ` (${progressObj.transferred}/${progressObj.total})`;
    console.log(message);
  });

  // Evento: Actualización descargada
  autoUpdater.on('update-downloaded', (info) => {
    console.log('Actualización descargada:', info.version);
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Actualización lista',
      message: 'La actualización se ha descargado correctamente.',
      detail: 'La aplicación se reiniciará para instalar la actualización.',
      buttons: ['Reiniciar ahora', 'Reiniciar al cerrar'],
      defaultId: 0,
      cancelId: 1
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Evento: Error en la actualización
  autoUpdater.on('error', (err) => {
    console.error('Error en auto-updater:', err);
  });

  // Verificar actualizaciones al iniciar
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000); // Esperar 3 segundos después de iniciar
}

// ============================================
// FIN AUTO-UPDATER
// ============================================

app.whenReady().then(() => {
  startNestServer();
  createWindow();
  setupAutoUpdater();
});

app.on('window-all-closed', () => {
  killNestProcess();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  killNestProcess();
});

app.on('will-quit', () => {
  killNestProcess();
});


// require('electron-reload')(__dirname, {
//   electron: require(`${__dirname}/node_modules/electron`)
// });

// const { app, BrowserWindow } = require('electron')
// const path = require("path");

// function createWindow() {

//   const win = new BrowserWindow({
//     width: 1600,
//     height: 1080,
//     // autoHideMenuBar: true,
//     icon: path.join(__dirname, "src", "assets", "img", "logo.png"),
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     }
//   });
//   win.maximize();
//   win.loadFile('index.html')

// }

// app.whenReady().then(createWindow)