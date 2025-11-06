const { ipcRenderer } = require('electron');

function initActivitiesListeners() {
    // Botón para abrir el formulario de nueva actividad
    const openModalBtn = document.getElementById('openActivityModal');
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            console.log('Botón Nueva Actividad presionado');
            ipcRenderer.send('open-activity-form');
        });
    } else {
        console.error('No se encontró el botón openActivityModal');
    }

    // Botón para abrir el listado de actividades
    const openListBtn = document.getElementById('openActivitiesListModal');
    
    if (openListBtn) {
        openListBtn.addEventListener('click', () => {
            console.log('Botón Listado de Actividades presionado');
            ipcRenderer.send('open-activities-list');
        });
    } else {
        console.error('No se encontró el botón openActivitiesListModal');
    }
}

// Exportar para uso global
window.initActivitiesListeners = initActivitiesListeners;
