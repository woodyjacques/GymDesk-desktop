(function() {
    'use strict';
    
    let ipcRenderer;
    try {
        const electron = require('electron');
        ipcRenderer = electron.ipcRenderer;
    } catch (e) {
        console.warn('Electron no disponible aún para acceso');
    }

let accesoRecords = [];
let deviceConnected = false;
let eventSource = null;

// Elementos del DOM
let accesoCard;
let accesoTitle;
let addDispositivoBtn;
let searchDispositivoInput;

// Sistema de tema para la página de acceso
function initThemeToggleAcceso() {
    const elements = {
        accesoCard: document.getElementById('accesoCard'),
        accesoTitle: document.getElementById('accesoTitle'),
        searchDispositivoInput: document.getElementById('searchDispositivoInput')
    };
    
    // Aplicar tema inicial
    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        applyThemeToAcceso(currentTheme, elements);
        
        // Escuchar cambios de tema
        window.themeManager.addThemeChangeListener((newTheme) => {
            applyThemeToAcceso(newTheme, elements);
        });
    }
}

function applyThemeToAcceso(theme, elements) {
    const isDark = theme === 'dark';
    
    // Card principal
    if (elements.accesoCard) {
        elements.accesoCard.className = isDark
            ? 'bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 mb-6'
            : 'bg-gray-100 rounded-xl shadow-md p-6 border border-gray-300 mb-6';
    }
    
    // Título
    if (elements.accesoTitle) {
        elements.accesoTitle.className = isDark
            ? 'text-xl font-bold text-white'
            : 'text-xl font-bold text-gray-900';
    }
    
    // Input de búsqueda
    if (elements.searchDispositivoInput) {
        elements.searchDispositivoInput.className = isDark
            ? 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-700 text-white outline-none'
            : 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-200 text-gray-900 outline-none';
    }
}

function initAccesoListeners() {
    const checkInterval = setInterval(() => {
        const addDispositivoBtn = document.getElementById('addDispositivoBtn');
        const searchInput = document.getElementById('searchDispositivoInput');
        
        if (addDispositivoBtn && searchInput) {
            clearInterval(checkInterval);
            
            initializeElements();
            initializeEventListeners();
            initThemeToggleAcceso();
        }
    }, 100);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initAccesoListeners();
});

function initializeElements() {
    accesoCard = document.getElementById('accesoCard');
    accesoTitle = document.getElementById('accesoTitle');
    addDispositivoBtn = document.getElementById('addDispositivoBtn');
    searchDispositivoInput = document.getElementById('searchDispositivoInput');
}

function initializeEventListeners() {
    if (addDispositivoBtn) {
        addDispositivoBtn.addEventListener('click', openDispositivoForm);
    }
    
    if (searchDispositivoInput) {
        searchDispositivoInput.addEventListener('input', searchDispositivos);
    }
    
    // Escuchar cuando se guarda un dispositivo
    if (ipcRenderer) {
        ipcRenderer.on('dispositivo-saved', (event, dispositivoData) => {
            loadDispositivos();
        });
    }
}

function openDispositivoForm() {
    if (ipcRenderer) {
        ipcRenderer.send('open-dispositivo-form');
    }
}

function searchDispositivos() {
    const searchTerm = searchDispositivoInput.value.trim().toLowerCase();
    console.log('Buscando dispositivos:', searchTerm);
    // Aquí se implementará la lógica de búsqueda
}

async function loadDispositivos() {
    try {
        const axios = require('axios');
        const { API_URL } = require('./config');
        const response = await axios.get(`${API_URL}/dispositivos`);
        console.log('Dispositivos cargados:', response.data);
        // Aquí se renderizarán los dispositivos en una tabla
    } catch (error) {
        console.error('Error al cargar dispositivos:', error);
    }
}

window.initAccesoListeners = initAccesoListeners;

})();