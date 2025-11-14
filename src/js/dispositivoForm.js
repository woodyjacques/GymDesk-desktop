const { ipcRenderer } = require('electron');
const axios = require('axios');

// Cargar API_URL desde window o usar valor por defecto
let API_URL = 'http://localhost:4001';
if (typeof window !== 'undefined' && window.API_URL) {
    API_URL = window.API_URL;
}

console.log('API_URL en dispositivoForm:', API_URL);

let currentDispositivo = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dispositivoForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');
    const testConnectionBtn = document.getElementById('testConnectionBtn');

    // Aplicar tema inicial
    applyTheme();

    // Recibir datos del dispositivo si es edición
    ipcRenderer.on('load-dispositivo-data', (event, dispositivoData) => {
        if (dispositivoData) {
            currentDispositivo = dispositivoData;
            formTitle.textContent = 'Editar Dispositivo';
            fillForm(dispositivoData);
        }
    });

    cancelBtn.addEventListener('click', () => {
        ipcRenderer.send('close-dispositivo-form');
    });

    testConnectionBtn.addEventListener('click', async () => {
        await testConnection();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSubmit();
    });

    // Deshabilitar botón guardar si cambian los campos
    const inputs = ['ip', 'puerto', 'usuario', 'contrasena'];
    inputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', () => {
            document.getElementById('saveBtn').disabled = true;
            const statusDiv = document.getElementById('connectionStatus');
            statusDiv.style.display = 'none';
        });
    });
});

function fillForm(data) {
    document.getElementById('ip').value = data.ip || '';
    document.getElementById('puerto').value = data.puerto || '80';
    document.getElementById('usuario').value = data.usuario || 'admin';
    document.getElementById('contrasena').value = data.contrasena || '';
}

async function testConnection() {
    const ip = document.getElementById('ip').value.trim();
    const puerto = document.getElementById('puerto').value;
    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    if (!ip || !puerto || !usuario || !contrasena) {
        alert('Por favor completa todos los campos');
        return;
    }

    const testBtn = document.getElementById('testConnectionBtn');
    const saveBtn = document.getElementById('saveBtn');
    testBtn.disabled = true;
    testBtn.textContent = 'Probando...';

    try {
        const response = await axios.post(`${API_URL}/dispositivos/test-connection`, {
            ip,
            puerto: parseInt(puerto),
            usuario,
            contrasena
        });

        if (response.data.connected) {
            showStatus('success', `✓ Conectado - ${response.data.deviceInfo || 'Dispositivo Hikvision'}`);
            saveBtn.disabled = false; // Habilitar botón guardar
        } else {
            showStatus('error', `✗ No conectado: ${response.data.message || 'Error'}`);
            saveBtn.disabled = true; // Mantener deshabilitado
        }
    } catch (error) {
        console.error('Error al probar conexión:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Error de conexión';
        showStatus('error', `✗ Error: ${errorMsg}`);
        saveBtn.disabled = true; // Mantener deshabilitado
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = 'Probar Conexión';
    }
}

function showStatus(type, message) {
    const statusDiv = document.getElementById('connectionStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');

    // Remover clases anteriores
    statusDiv.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800', 'bg-blue-100', 'text-blue-800');
    
    if (type === 'success') {
        statusDiv.classList.add('bg-green-100', 'text-green-800');
        statusIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
    } else if (type === 'info') {
        statusDiv.classList.add('bg-blue-100', 'text-blue-800');
        statusIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />';
    } else {
        statusDiv.classList.add('bg-red-100', 'text-red-800');
        statusIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }
    
    statusText.textContent = message;
    
    // Asegurar que sea visible
    statusDiv.style.display = 'block';
}

async function handleSubmit() {
    const dispositivoData = {
        ip: document.getElementById('ip').value.trim(),
        puerto: parseInt(document.getElementById('puerto').value),
        usuario: document.getElementById('usuario').value.trim(),
        contrasena: document.getElementById('contrasena').value
    };

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';

    try {
        let response;
        if (currentDispositivo && currentDispositivo.id) {
            response = await axios.patch(`${API_URL}/dispositivos/${currentDispositivo.id}`, dispositivoData);
        } else {
            response = await axios.post(`${API_URL}/dispositivos`, dispositivoData);
        }

        showStatus('success', '✓ Dispositivo guardado correctamente');
        
        setTimeout(() => {
            ipcRenderer.send('save-dispositivo', response.data);
        }, 1000);

    } catch (error) {
        console.error('Error:', error);
        showStatus('error', error.response?.data?.message || error.message || 'Error al guardar');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Guardar';
    }
}

function applyTheme() {
    const theme = themeManager.getCurrentTheme();
    const body = document.getElementById('dispositivoFormBody');
    const formTitle = document.getElementById('formTitle');
    const labels = document.querySelectorAll('label');
    const inputs = document.querySelectorAll('input');
    const cancelBtn = document.getElementById('cancelBtn');

    if (theme === 'dark') {
        body.classList.remove('bg-gray-100');
        body.classList.add('bg-gray-800');
        
        formTitle.classList.remove('text-gray-900');
        formTitle.classList.add('text-white');
        
        labels.forEach(label => {
            label.classList.remove('text-gray-700');
            label.classList.add('text-gray-300');
        });
        
        inputs.forEach(input => {
            input.classList.remove('bg-white', 'border-gray-300', 'text-gray-900');
            input.classList.add('bg-gray-700', 'border-gray-600', 'text-white');
        });
        
        cancelBtn.classList.remove('text-gray-700', 'bg-gray-200', 'hover:bg-gray-300');
        cancelBtn.classList.add('text-gray-300', 'bg-gray-700', 'hover:bg-gray-600');
    } else {
        body.classList.remove('bg-gray-800');
        body.classList.add('bg-gray-100');
        
        formTitle.classList.remove('text-white');
        formTitle.classList.add('text-gray-900');
        
        labels.forEach(label => {
            label.classList.remove('text-gray-300');
            label.classList.add('text-gray-700');
        });
        
        inputs.forEach(input => {
            input.classList.remove('bg-gray-700', 'border-gray-600', 'text-white');
            input.classList.add('bg-white', 'border-gray-300', 'text-gray-900');
        });
        
        cancelBtn.classList.remove('text-gray-300', 'bg-gray-700', 'hover:bg-gray-600');
        cancelBtn.classList.add('text-gray-700', 'bg-gray-200', 'hover:bg-gray-300');
    }
}
