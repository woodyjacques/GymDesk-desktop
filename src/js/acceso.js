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
        const dispositivoContainer = document.getElementById('dispositivoContainer');
        const searchInput = document.getElementById('searchDispositivoInput');
        
        if (dispositivoContainer && searchInput) {
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
    searchDispositivoInput = document.getElementById('searchDispositivoInput');
}

function initializeEventListeners() {
    if (searchDispositivoInput) {
        searchDispositivoInput.addEventListener('input', searchAsistencias);
    }
    
    // Cargar dispositivo al iniciar
    loadDispositivo();
    
    // Escuchar cuando se guarda un dispositivo
    if (ipcRenderer) {
        ipcRenderer.on('dispositivo-saved', (event, dispositivoData) => {
            loadDispositivo();
        });
    }
    
    // Escuchar cambios de tema para actualizar el dispositivo
    if (window.themeManager) {
        window.themeManager.addThemeChangeListener(() => {
            loadDispositivo();
        });
    }
}

function openDispositivoForm(dispositivoData = null) {
    if (ipcRenderer) {
        ipcRenderer.send('open-dispositivo-form', dispositivoData);
    }
}

function searchAsistencias() {
    const searchTerm = searchDispositivoInput.value.trim().toLowerCase();
    console.log('Buscando asistencias:', searchTerm);
    // Aquí se implementará la búsqueda de asistencias en el futuro
}

async function loadDispositivo() {
    try {
        const axios = require('axios');
        const response = await axios.get(`${window.API_URL}/dispositivos`);
        displayDispositivo(response.data[0]); // Solo mostrar el primero
    } catch (error) {
        console.error('Error al cargar dispositivo:', error);
        displayDispositivo(null);
    }
}

function displayDispositivo(dispositivo) {
    const container = document.getElementById('dispositivoContainer');
    
    if (!container) return;
    
    const theme = window.themeManager ? window.themeManager.getCurrentTheme() : 'light';
    const isDark = theme === 'dark';
    
    if (!dispositivo) {
        container.innerHTML = `
            <div class="${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}">Sin dispositivo configurado</h3>
                            <p class="text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}">Configure un dispositivo de control de acceso</p>
                        </div>
                    </div>
                    <button onclick="window.addDispositivo()" class="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium transition flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Agregar Dispositivo</span>
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                            ${dispositivo.conectado 
                                ? '<span class="flex h-3 w-3"><span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>'
                                : '<span class="inline-flex rounded-full h-3 w-3 bg-red-500"></span>'
                            }
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}">${dispositivo.ip}:${dispositivo.puerto}</h3>
                            <p class="text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}">Usuario: ${dispositivo.usuario}</p>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center space-x-4 text-xs">
                        <span class="${dispositivo.conectado ? 'text-green-600' : 'text-red-600'} font-medium">
                            ${dispositivo.conectado ? '● Conectado' : '● Desconectado'}
                        </span>
                        ${dispositivo.ultimaConexion 
                            ? `<span class="${isDark ? 'text-gray-400' : 'text-gray-500'}">Última: ${new Date(dispositivo.ultimaConexion).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>`
                            : `<span class="${isDark ? 'text-gray-400' : 'text-gray-500'}">Sin conexión previa</span>`
                        }
                    </div>
                </div>
                <button onclick="window.updateDispositivo(${dispositivo.id})" class="px-4 py-2 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded font-medium transition">
                    Actualizar
                </button>
            </div>
        </div>
    `;
}

window.addDispositivo = function() {
    openDispositivoForm(null);
};

window.updateDispositivo = async function(id) {
    try {
        const axios = require('axios');
        const response = await axios.get(`${window.API_URL}/dispositivos/${id}`);
        openDispositivoForm(response.data);
    } catch (error) {
        console.error('Error al cargar dispositivo:', error);
    }
};

window.initAccesoListeners = initAccesoListeners;

})();