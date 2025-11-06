// ipcRenderer ya está disponible globalmente desde activities.js
function initInstructorsListeners() {
    const { ipcRenderer } = require('electron');
    
    // Botón para abrir el formulario de nuevo instructor
    const openNewInstructorBtn = document.getElementById('openNewInstructorBtn');
    
    if (openNewInstructorBtn) {
        openNewInstructorBtn.addEventListener('click', () => {
            console.log('Botón Nuevo Instructor presionado');
            ipcRenderer.send('open-instructor-form');
        });
    } else {
        console.error('No se encontró el botón openNewInstructorBtn');
    }

    // Botón para abrir el listado de instructores
    const openInstructorsListBtn = document.getElementById('openInstructorsListBtn');
    
    if (openInstructorsListBtn) {
        openInstructorsListBtn.addEventListener('click', () => {
            console.log('Botón Listado de Instructores presionado');
            ipcRenderer.send('open-instructors-list');
        });
    } else {
        console.error('No se encontró el botón openInstructorsListBtn');
    }
}

// Exportar para uso global
window.initInstructorsListeners = initInstructorsListeners;
