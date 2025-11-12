// ipcRenderer para comunicación con Electron
function initPersonalTrainingListeners() {
    const { ipcRenderer } = require('electron');
    
    // Botón para abrir el formulario de nuevo personal training
    const openNewInstructorBtn = document.getElementById('openNewPersonalTrainingBtn');
    
    if (openNewInstructorBtn) {
        openNewInstructorBtn.addEventListener('click', () => {
            console.log('Botón Nuevo Personal Training presionado');
            ipcRenderer.send('open-instructor-form');
        });
    } else {
        console.error('No se encontró el botón openNewPersonalTrainingBtn');
    }

    // Botón para abrir el listado de personal training
    const openPersonalTrainingListBtn = document.getElementById('openPersonalTrainingListBtn');
    
    if (openPersonalTrainingListBtn) {
        openPersonalTrainingListBtn.addEventListener('click', () => {
            console.log('Botón Listado de Personal Training presionado');
            ipcRenderer.send('open-personal-training-list');
        });
    } else {
        console.error('No se encontró el botón openPersonalTrainingListBtn');
    }
}

// Exportar para uso global
window.initPersonalTrainingListeners = initPersonalTrainingListeners;
