// ipcRenderer ya está disponible globalmente desde activities.js
function initPartnersListModal() {
    const { ipcRenderer } = require('electron');
    
    // Botón para abrir el listado de socios
    const openPartnersListBtn = document.getElementById('openPartnersListBtn');
    
    if (openPartnersListBtn) {
        openPartnersListBtn.addEventListener('click', () => {
            console.log('Botón Listado de Socios presionado');
            ipcRenderer.send('open-partners-list');
        });
    } else {
        console.error('No se encontró el botón openPartnersListBtn');
    }
}

// Exportar para uso global
window.initPartnersListModal = initPartnersListModal;
