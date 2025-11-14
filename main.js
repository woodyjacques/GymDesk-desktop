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
let personFormWindow;
let personDetailsWindow;
let dispositivoFormWindow;
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
function openPersonForm(personData = null, personType = 'visitante') {
  if (personFormWindow) {
    personFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  personFormWindow = new BrowserWindow({
    width: 700,
    height: personType === 'visitante' ? 280 : (personType === 'empleado' || personType === 'entrenador') ? 400 : 580,
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

  personFormWindow.loadFile('src/html/visitantesForm.html');

  personFormWindow.webContents.on('did-finish-load', () => {
    // Enviar el tipo de persona al formulario
    const typeNames = {
      'visitante': 'Visitante',
      'cliente': 'Cliente',
      'empleado': 'Empleado',
      'entrenador': 'Entrenador'
    };
    personFormWindow.webContents.send('set-person-type', personType, typeNames[personType] || 'Visitante');
    
    // Si hay datos de persona, enviarlos
    if (personData) {
      personFormWindow.webContents.send('load-visitante-data', personData);
    }
  });

  personFormWindow.on('closed', () => {
    personFormWindow = null;
  });
}

// IPC handlers para visitantes
ipcMain.on('open-visitante-form', (event, visitanteData) => {
  openPersonForm(visitanteData, 'visitante');
});

// IPC handlers para clientes
ipcMain.on('open-cliente-form', (event, clienteData) => {
  openPersonForm(clienteData, 'cliente');
});

// IPC handlers para empleados
ipcMain.on('open-empleado-form', (event, empleadoData) => {
  openPersonForm(empleadoData, 'empleado');
});

// IPC handlers para entrenadores
ipcMain.on('open-entrenador-form', (event, entrenadorData) => {
  openPersonForm(entrenadorData, 'entrenador');
});

// Cerrar formulario
ipcMain.on('close-visitante-form', () => {
  if (personFormWindow) {
    personFormWindow.close();
  }
});

// Guardar visitante
ipcMain.on('save-visitante', (event, visitanteData) => {
  if (mainWindow) {
    mainWindow.webContents.send('visitante-saved', visitanteData);
  }
  if (personFormWindow) {
    personFormWindow.close();
  }
});

// Guardar cliente
ipcMain.on('save-cliente', (event, clienteData) => {
  if (mainWindow) {
    mainWindow.webContents.send('cliente-saved', clienteData);
  }
  if (personFormWindow) {
    personFormWindow.close();
  }
});

// Guardar empleado
ipcMain.on('save-empleado', (event, empleadoData) => {
  if (mainWindow) {
    mainWindow.webContents.send('empleado-saved', empleadoData);
  }
  if (personFormWindow) {
    personFormWindow.close();
  }
});

// Guardar entrenador
ipcMain.on('save-entrenador', (event, entrenadorData) => {
  if (mainWindow) {
    mainWindow.webContents.send('entrenador-saved', entrenadorData);
  }
  if (personFormWindow) {
    personFormWindow.close();
  }
});

// Función para abrir modal de detalles de persona
function openPersonDetails(personData) {
  if (personDetailsWindow) {
    personDetailsWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  personDetailsWindow = new BrowserWindow({
    width: 550,
    height: 440,
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

  personDetailsWindow.loadFile('src/html/personDetailsModal.html');

  personDetailsWindow.webContents.on('did-finish-load', () => {
    personDetailsWindow.webContents.send('load-person-details', personData);
  });

  personDetailsWindow.on('closed', () => {
    personDetailsWindow = null;
  });
}

ipcMain.on('open-person-details', (event, personData) => {
  openPersonDetails(personData);
});

ipcMain.on('close-person-details', () => {
  if (personDetailsWindow) {
    personDetailsWindow.close();
  }
});

ipcMain.on('adjust-person-details-height', (event, height) => {
  if (personDetailsWindow) {
    const currentSize = personDetailsWindow.getSize();
    personDetailsWindow.setSize(currentSize[0], height);
    personDetailsWindow.center();
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

// IPC handlers para dispositivos
ipcMain.on('open-dispositivo-form', (event, dispositivoData) => {
  openDispositivoForm(dispositivoData);
});

ipcMain.on('close-dispositivo-form', () => {
  if (dispositivoFormWindow) {
    dispositivoFormWindow.close();
  }
});

ipcMain.on('save-dispositivo', (event, dispositivoData) => {
  if (mainWindow) {
    mainWindow.webContents.send('dispositivo-saved', dispositivoData);
  }
  if (dispositivoFormWindow) {
    dispositivoFormWindow.close();
  }
});

// Función para abrir formulario de dispositivo
function openDispositivoForm(dispositivoData = null) {
  if (dispositivoFormWindow) {
    dispositivoFormWindow.focus();
    return;
  }

  let iconPath;
  if (isDev) {
    iconPath = path.join(__dirname, "build", "icon.ico");
  } else {
    iconPath = path.join(process.resourcesPath, "app.asar.unpacked", "build", "icon.ico");
  }

  dispositivoFormWindow = new BrowserWindow({
    width: 450,
    height: 480,
    resizable: false,
    autoHideMenuBar: true,
    icon: iconPath,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  dispositivoFormWindow.loadFile('src/html/dispositivoForm.html');

  dispositivoFormWindow.webContents.on('did-finish-load', () => {
    if (dispositivoData) {
      dispositivoFormWindow.webContents.send('load-dispositivo-data', dispositivoData);
    }
  });

  dispositivoFormWindow.on('closed', () => {
    dispositivoFormWindow = null;
  });
}

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