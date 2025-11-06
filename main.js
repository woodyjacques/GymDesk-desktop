const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let nestProcess;
let mainWindow;
let activityFormWindow;
let activitiesListWindow;
let partnerFormWindow;
let partnersListWindow;
let instructorFormWindow;
let instructorsListWindow;
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

// Función para abrir el formulario de actividad en ventana modal
function openActivityForm(activityData = null) {
  if (activityFormWindow) {
    activityFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  activityFormWindow = new BrowserWindow({
    width: 700,
    height: 600,
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

  activityFormWindow.loadFile('src/html/activityForm.html');

  // Si hay datos de actividad, enviarlos cuando la ventana esté lista
  if (activityData) {
    activityFormWindow.webContents.on('did-finish-load', () => {
      activityFormWindow.webContents.send('load-activity-data', activityData);
    });
  }

  activityFormWindow.on('closed', () => {
    activityFormWindow = null;
  });
}

// Función para abrir el formulario de socio en ventana modal
function openPartnerForm(partnerData = null) {
  if (partnerFormWindow) {
    partnerFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  partnerFormWindow = new BrowserWindow({
    width: 900,
    height: 700,
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

  partnerFormWindow.loadFile('src/html/partnerForm.html');

  if (partnerData) {
    partnerFormWindow.webContents.on('did-finish-load', () => {
      partnerFormWindow.webContents.send('load-partner-data', partnerData);
    });
  }

  partnerFormWindow.on('closed', () => {
    partnerFormWindow = null;
  });

}

// Función para abrir el formulario de instructor en ventana modal
function openInstructorForm(instructorData = null) {
  if (instructorFormWindow) {
    instructorFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  instructorFormWindow = new BrowserWindow({
    width: 900,
    height: 700,
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

  instructorFormWindow.loadFile('src/html/instructorForm.html');

  if (instructorData) {
    instructorFormWindow.webContents.on('did-finish-load', () => {
      instructorFormWindow.webContents.send('load-instructor-data', instructorData);
    });
  }

  instructorFormWindow.on('closed', () => {
    instructorFormWindow = null;
  });
}

// Función para abrir el listado de instructores en ventana modal
function openInstructorsList() {
  if (instructorsListWindow) {
    instructorsListWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  instructorsListWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    parent: mainWindow,
    resizable: true,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  instructorsListWindow.loadFile('src/html/instructorsList.html');

  instructorsListWindow.on('closed', () => {
    instructorsListWindow = null;
  });
}

// Función para abrir el listado de socios en ventana modal
function openPartnersList() {
  if (partnersListWindow) {
    partnersListWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  partnersListWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    parent: mainWindow,
    resizable: true,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  partnersListWindow.loadFile('src/html/partnersList.html');

  partnersListWindow.on('closed', () => {
    partnersListWindow = null;
  });
}

// Función para abrir el listado de actividades en ventana modal
function openActivitiesList() {
  if (activitiesListWindow) {
    activitiesListWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  activitiesListWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    modal: true,
    parent: mainWindow,
    resizable: true,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  activitiesListWindow.loadFile('src/html/activitiesList.html');

  activitiesListWindow.on('closed', () => {
    activitiesListWindow = null;
  });
}

// Escuchar eventos IPC
ipcMain.on('open-activity-form', (event, activityData) => {
  openActivityForm(activityData);
});

ipcMain.on('open-partner-form', (event, partnerData) => {
  openPartnerForm(partnerData);
});

ipcMain.on('close-activity-form', () => {
  if (activityFormWindow) {
    activityFormWindow.close();
  }
});

ipcMain.on('open-activities-list', () => {
  openActivitiesList();
});

ipcMain.on('close-activities-list', () => {
  if (activitiesListWindow) {
    activitiesListWindow.close();
  }
});

ipcMain.on('close-partner-form', () => {
  if (partnerFormWindow) {
    partnerFormWindow.close();
  }
});

ipcMain.on('save-partner', (event, partnerData) => {
  console.log('Partner guardado (demo):', partnerData);
  // Si hay otras ventanas que necesiten recargar, enviar evento
  if (activitiesListWindow) {
    activitiesListWindow.webContents.send('partner-saved');
  }
});

ipcMain.on('save-activity', (event, activityData) => {
  console.log('Actividad guardada:', activityData);
  
  // Si el listado está abierto, notificar para recargar
  if (activitiesListWindow) {
    activitiesListWindow.webContents.send('activity-saved');
  }
});

// IPC handlers para instructores
ipcMain.on('open-instructor-form', (event, instructorData) => {
  openInstructorForm(instructorData);
});

ipcMain.on('close-instructor-form', () => {
  if (instructorFormWindow) {
    instructorFormWindow.close();
  }
});

ipcMain.on('open-instructors-list', () => {
  openInstructorsList();
});

ipcMain.on('close-instructors-list', () => {
  if (instructorsListWindow) {
    instructorsListWindow.close();
  }
});

ipcMain.on('instructor-saved', () => {
  console.log('Instructor guardado');
  // Si el listado está abierto, notificar para recargar
  if (instructorsListWindow) {
    instructorsListWindow.webContents.send('instructor-saved');
  }
});

// IPC Handlers para Partners
ipcMain.on('open-partners-list', () => {
  openPartnersList();
});

ipcMain.on('close-partners-list', () => {
  if (partnersListWindow) {
    partnersListWindow.close();
  }
});

ipcMain.on('partner-saved', () => {
  console.log('Socio guardado');
  // Si el listado está abierto, notificar para recargar
  if (partnersListWindow) {
    partnersListWindow.webContents.send('partner-saved');
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