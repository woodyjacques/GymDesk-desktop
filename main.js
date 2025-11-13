const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let nestProcess;
let mainWindow;
let planFormWindow;
let partnerFormWindow;
let partnersListWindow;
let instructorFormWindow;
let personalTrainingListWindow;
let visitanteFormWindow;
const isDev = !app.isPackaged;

autoUpdater.autoDownload = false; 
autoUpdater.autoInstallOnAppQuit = true; 

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
  let nodePath;

  if (isDev) {
    nestPath = path.join(__dirname, '../GymDesk-backend/dist/main.js');
    backendDir = path.join(__dirname, '../GymDesk-backend');
    nodePath = 'node'; 
  } else {
    nestPath = path.join(process.resourcesPath, 'backend', 'main.js');
    backendDir = path.join(process.resourcesPath, 'backend');
    nodePath = process.execPath; 
  }

  nestProcess = spawn(nodePath, [nestPath], {
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
    // autoHideMenuBar: true,
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

// Función para abrir el formulario de plan en ventana modal
function openPlanForm(planData = null) {
  if (planFormWindow) {
    planFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  planFormWindow = new BrowserWindow({
    width: 700,
    height: 540,
    modal: true,
    parent: mainWindow,
    resizable: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  planFormWindow.loadFile('src/html/planForm.html');

  // Si hay datos de plan, enviarlos cuando la ventana esté lista
  if (planData) {
    planFormWindow.webContents.on('did-finish-load', () => {
      planFormWindow.webContents.send('load-plan-data', planData);
    });
  }

  planFormWindow.on('closed', () => {
    planFormWindow = null;
  });
}

ipcMain.on('open-plan-form', (event, planData) => {
  openPlanForm(planData);
});

ipcMain.on('close-plan-form', () => {
  if (planFormWindow) {
    planFormWindow.close();
  }
});

ipcMain.on('save-plan', (event, planData) => {
  if (mainWindow) {
    mainWindow.webContents.send('plan-saved');
  }
});

// Función para abrir el formulario de visitante en ventana modal
function openVisitanteForm(visitanteData = null) {
  if (visitanteFormWindow) {
    visitanteFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  visitanteFormWindow = new BrowserWindow({
    width: 700,
    height: 580,
    modal: true,
    parent: mainWindow,
    resizable: false,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  visitanteFormWindow.loadFile('src/html/visitantesForm.html');

  // Si hay datos de visitante, enviarlos cuando la ventana esté lista
  if (visitanteData) {
    visitanteFormWindow.webContents.on('did-finish-load', () => {
      visitanteFormWindow.webContents.send('load-visitante-data', visitanteData);
    });
  }

  visitanteFormWindow.on('closed', () => {
    visitanteFormWindow = null;
  });
}

ipcMain.on('open-visitante-form', (event, visitanteData) => {
  openVisitanteForm(visitanteData);
});

ipcMain.on('close-visitante-form', () => {
  if (visitanteFormWindow) {
    visitanteFormWindow.close();
  }
});

ipcMain.on('save-visitante', (event, visitanteData) => {
  if (mainWindow) {
    mainWindow.webContents.send('visitante-saved');
  }
});


function setupAutoUpdater() {

  if (isDev) {
    return;
  }

  autoUpdater.on('update-available', (info) => {
    
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

  autoUpdater.on('download-progress', (progressObj) => {
    let message = `Velocidad de descarga: ${progressObj.bytesPerSecond}`;
    message += ` - Descargado ${progressObj.percent}%`;
    message += ` (${progressObj.transferred}/${progressObj.total})`;
  });

  autoUpdater.on('update-downloaded', (info) => {
    
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

  autoUpdater.on('error', (err) => {
    console.error('Error en auto-updater:', err);
  });

  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000); 

}

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