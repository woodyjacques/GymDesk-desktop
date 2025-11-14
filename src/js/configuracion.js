(function() {
    'use strict';
    
    let ipcRenderer;
    let axios;
    
    try {
        const electron = require('electron');
        ipcRenderer = electron.ipcRenderer;
        axios = require('axios');
    } catch (e) {
        console.warn('Electron no disponible aún para configuración');
    }

// Elementos del DOM
let configuracionCard;
let configuracionTitle;
let gymInfoSection;
let visitantesMontoSection;
let dispositivoSection;
let aparienciaSection;

// Sistema de tema para la página de configuración
function initThemeToggleConfiguracion() {
    const elements = {
        configuracionCard: document.getElementById('configuracionCard'),
        configuracionTitle: document.getElementById('configuracionTitle'),
        gymInfoSection: document.getElementById('gymInfoSection'),
        visitantesMontoSection: document.getElementById('visitantesMontoSection'),
        dispositivoSection: document.getElementById('dispositivoSection'),
        aparienciaSection: document.getElementById('aparienciaSection')
    };
    
    // Aplicar tema inicial
    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        applyThemeToConfiguracion(currentTheme, elements);
        
        // Escuchar cambios de tema
        window.themeManager.addThemeChangeListener((newTheme) => {
            applyThemeToConfiguracion(newTheme, elements);
        });
    }
}

function applyThemeToConfiguracion(theme, elements) {
    const isDark = theme === 'dark';
    
    // Card principal
    if (elements.configuracionCard) {
        elements.configuracionCard.className = isDark
            ? 'bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 mb-6'
            : 'bg-gray-100 rounded-xl shadow-md p-6 border border-gray-300 mb-6';
    }
    
    // Título
    if (elements.configuracionTitle) {
        elements.configuracionTitle.className = isDark
            ? 'text-xl font-bold text-white'
            : 'text-xl font-bold text-gray-900';
    }
    
    // Secciones
    const sections = [
        elements.gymInfoSection,
        elements.visitantesMontoSection,
        elements.dispositivoSection,
        elements.aparienciaSection
    ];
    
    sections.forEach(section => {
        if (section) {
            section.className = isDark
                ? 'bg-gray-700 border-gray-600 border rounded-lg p-4'
                : 'bg-white border-gray-300 border rounded-lg p-4';
                
            // Títulos de sección
            const h3 = section.querySelector('h3');
            if (h3) {
                h3.className = isDark
                    ? 'text-lg font-semibold text-white mb-3'
                    : 'text-lg font-semibold text-gray-900 mb-3';
            }
            
            // Labels
            const labels = section.querySelectorAll('label, p.text-sm, p.text-xs');
            labels.forEach(label => {
                if (label.classList.contains('text-xs')) {
                    label.className = isDark
                        ? 'text-xs text-gray-400'
                        : 'text-xs text-gray-500';
                } else {
                    label.className = isDark
                        ? 'block text-sm font-medium text-gray-300 mb-1'
                        : 'block text-sm font-medium text-gray-700 mb-1';
                }
            });
            
            // Inputs
            const inputs = section.querySelectorAll('input');
            inputs.forEach(input => {
                input.className = isDark
                    ? 'w-full px-3 py-2 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-600 text-white outline-none'
                    : 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-white outline-none';
            });
        }
    });
    
    // Botón de tema en apariencia
    const themeToggleConfig = document.getElementById('themeToggleConfig');
    if (themeToggleConfig) {
        themeToggleConfig.className = isDark
            ? 'p-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition'
            : 'p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition';
    }
}

function initConfiguracionListeners() {
    const checkInterval = setInterval(() => {
        const configuracionCard = document.getElementById('configuracionCard');
        
        if (configuracionCard) {
            clearInterval(checkInterval);
            
            initializeElements();
            initializeEventListeners();
            initThemeToggleConfiguracion();
        }
    }, 100);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initConfiguracionListeners();
});

function initializeElements() {
    configuracionCard = document.getElementById('configuracionCard');
    configuracionTitle = document.getElementById('configuracionTitle');
    gymInfoSection = document.getElementById('gymInfoSection');
    visitantesMontoSection = document.getElementById('visitantesMontoSection');
    dispositivoSection = document.getElementById('dispositivoSection');
    aparienciaSection = document.getElementById('aparienciaSection');
}

function initializeEventListeners() {
    // Botón guardar información del gimnasio
    const saveGymInfoBtn = document.getElementById('saveGymInfoBtn');
    if (saveGymInfoBtn) {
        saveGymInfoBtn.addEventListener('click', saveGymInfo);
    }
    
    // Botón guardar monto
    const saveMontoBtn = document.getElementById('saveMontoBtn');
    if (saveMontoBtn) {
        saveMontoBtn.addEventListener('click', saveMonto);
    }
    
    // Botón de tema
    const themeToggleConfig = document.getElementById('themeToggleConfig');
    if (themeToggleConfig) {
        themeToggleConfig.addEventListener('click', () => {
            if (window.themeManager) {
                window.themeManager.toggleTheme();
            }
        });
    }
    
    // Cargar datos iniciales
    loadConfiguracion();
    
    // Escuchar cuando se guarda un dispositivo
    if (ipcRenderer) {
        ipcRenderer.on('dispositivo-saved', (event, dispositivoData) => {
            loadDispositivoInfo();
        });
    }
}

async function loadConfiguracion() {
    try {
        if (!axios) {
            console.error('Axios no está disponible');
            return;
        }
        
        // Cargar información del gimnasio desde el backend
        const response = await axios.get(`${window.API_URL}/gym-info/config`);
        const gymData = response.data;
        
        // Llenar los inputs con los datos del backend
        document.getElementById('gymRfc').value = gymData.rfc || '';
        document.getElementById('gymCalle').value = gymData.calle || '';
        document.getElementById('gymColonia').value = gymData.colonia || '';
        document.getElementById('gymMunicipio').value = gymData.municipio || '';
        document.getElementById('gymCiudad').value = gymData.ciudad || '';
        document.getElementById('gymCp').value = gymData.cp || '';
        document.getElementById('gymEstado').value = gymData.estado || '';
        document.getElementById('gymPais').value = gymData.pais || '';
        document.getElementById('gymPhone').value = gymData.telefono || '';
        document.getElementById('gymCorreo').value = gymData.correo || '';
        document.getElementById('gymIvaServicios').value = gymData.ivaServicios || '';
        document.getElementById('gymIvaProductos').value = gymData.ivaProductos || '';
        
    } catch (error) {
        console.error('Error al cargar información del gimnasio:', error);
    }
    
    // Cargar monto predeterminado de visitantes
    try {
        const montoResponse = await axios.get(`${window.API_URL}/monto-visitante/config/default`);
        document.getElementById('visitanteMonto').value = montoResponse.data || '';
    } catch (error) {
        console.error('Error al cargar monto predeterminado:', error);
    }
    
    // Cargar información del dispositivo
    await loadDispositivoInfo();
}

async function loadDispositivoInfo() {
    try {
        if (!axios) {
            console.error('Axios no está disponible');
            return;
        }
        
        const response = await axios.get(`${window.API_URL}/dispositivos`);
        const dispositivo = response.data[0];
        
        const dispositivoInfo = document.getElementById('dispositivoInfo');
        const nuevoDispositivoBtn = document.querySelector('#dispositivoSection button');
        
        if (dispositivo) {
            dispositivoInfo.innerHTML = `
                <div class="space-y-2">
                    <p class="text-sm"><span class="font-medium">IP:</span> ${dispositivo.ip}:${dispositivo.puerto}</p>
                    <p class="text-sm"><span class="font-medium">Usuario:</span> ${dispositivo.usuario}</p>
                    <p class="text-sm"><span class="font-medium">Estado:</span> 
                        <span class="${dispositivo.conectado ? 'text-green-600' : 'text-red-600'} font-semibold">
                            ${dispositivo.conectado ? '● Conectado' : '● Desconectado'}
                        </span>
                    </p>
                </div>
            `;
            
            // Cambiar botón a "Actualizar"
            if (nuevoDispositivoBtn) {
                nuevoDispositivoBtn.onclick = () => window.updateDispositivo(dispositivo.id);
                nuevoDispositivoBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Actualizar</span>
                `;
            }
        } else {
            dispositivoInfo.innerHTML = '<p class="text-sm text-gray-500">No hay dispositivo configurado</p>';
            
            // Cambiar botón a "Nuevo Dispositivo"
            if (nuevoDispositivoBtn) {
                nuevoDispositivoBtn.onclick = () => window.addDispositivo();
                nuevoDispositivoBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Nuevo Dispositivo</span>
                `;
            }
        }
    } catch (error) {
        console.error('Error al cargar dispositivo:', error);
    }
}

async function saveGymInfo() {
    const statusDiv = document.getElementById('gymInfoStatus');
    const saveBtn = document.getElementById('saveGymInfoBtn');
    
    try {
        if (!axios) {
            showStatus('error', 'Error: Sistema no disponible');
            return;
        }
        
        // Deshabilitar botón y mostrar cargando
        saveBtn.disabled = true;
        saveBtn.textContent = 'Guardando...';
        showStatus('info', 'Enviando información al servidor...');
        
        const gymData = {
            rfc: document.getElementById('gymRfc').value || null,
            calle: document.getElementById('gymCalle').value || null,
            colonia: document.getElementById('gymColonia').value || null,
            municipio: document.getElementById('gymMunicipio').value || null,
            ciudad: document.getElementById('gymCiudad').value || null,
            cp: document.getElementById('gymCp').value || null,
            estado: document.getElementById('gymEstado').value || null,
            pais: document.getElementById('gymPais').value || null,
            telefono: document.getElementById('gymPhone').value || null,
            correo: document.getElementById('gymCorreo').value || null,
            ivaServicios: document.getElementById('gymIvaServicios').value ? parseFloat(document.getElementById('gymIvaServicios').value) : null,
            ivaProductos: document.getElementById('gymIvaProductos').value ? parseFloat(document.getElementById('gymIvaProductos').value) : null
        };
        
        console.log('📤 Enviando datos:', gymData);
        console.log('🌐 URL:', `${window.API_URL}/gym-info/config`);
        
        const response = await axios.patch(`${window.API_URL}/gym-info/config`, gymData);
        
        console.log('✅ Respuesta exitosa:', response.data);
        showStatus('success', '✓ Información guardada correctamente');
        
        // Recargar datos para asegurar sincronización
        setTimeout(() => {
            loadConfiguracion();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error completo:', error);
        
        let errorMessage = 'Error al guardar la información';
        
        if (error.response) {
            console.error('📋 Detalles del error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
            
            if (error.response.data && error.response.data.message) {
                const messages = Array.isArray(error.response.data.message) 
                    ? error.response.data.message.join(', ') 
                    : error.response.data.message;
                errorMessage = `Error: ${messages}`;
            } else {
                errorMessage = `Error del servidor (${error.response.status})`;
            }
        } else if (error.request) {
            console.error('🔌 No hay respuesta del servidor:', error.request);
            errorMessage = 'Error: No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
            console.error('⚠️ Error en la petición:', error.message);
            errorMessage = `Error: ${error.message}`;
        }
        
        showStatus('error', errorMessage);
        
    } finally {
        // Rehabilitar botón
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar Información';
    }
}

function showStatus(type, message) {
    const statusDiv = document.getElementById('gymInfoStatus');
    if (!statusDiv) return;
    
    statusDiv.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
    
    if (type === 'success') {
        statusDiv.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        statusDiv.classList.add('bg-red-100', 'text-red-800');
    } else if (type === 'info') {
        statusDiv.classList.add('bg-blue-100', 'text-blue-800');
    }
    
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');
    
    // Ocultar mensaje después de 5 segundos si es éxito
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    }
}

async function saveMonto() {
    try {
        if (!axios) {
            alert('Error: Sistema no disponible');
            return;
        }
        
        const visitanteMonto = document.getElementById('visitanteMonto').value;
        
        if (!visitanteMonto || parseFloat(visitanteMonto) < 0) {
            alert('Por favor ingresa un monto válido');
            return;
        }
        
        await axios.patch(`${window.API_URL}/monto-visitante/config/default`, {
            monto: parseFloat(visitanteMonto)
        });
        
        alert('Monto guardado correctamente');
        
    } catch (error) {
        console.error('Error al guardar monto:', error);
        alert('Error al guardar el monto');
    }
}

function openDispositivoForm(dispositivoData = null) {
    if (ipcRenderer) {
        ipcRenderer.send('open-dispositivo-form', dispositivoData);
    }
}

window.addDispositivo = function() {
    openDispositivoForm(null);
};

window.updateDispositivo = async function(id) {
    try {
        const response = await axios.get(`${window.API_URL}/dispositivos/${id}`);
        openDispositivoForm(response.data);
    } catch (error) {
        console.error('Error al cargar dispositivo:', error);
    }
};

window.initConfiguracionListeners = initConfiguracionListeners;

})();
