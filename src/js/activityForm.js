const { ipcRenderer } = require('electron');
const axios = require('axios');

// Elementos del DOM
const form = document.getElementById('activityForm');
const cancelBtn = document.getElementById('cancelBtn');
const typeSelect = document.getElementById('activityType');
const daysInput = document.getElementById('activityDays');
const daysLabel = document.getElementById('daysLabel');
const daysHelp = document.getElementById('daysHelp');
const formTitleText = document.getElementById('formTitleText');
const submitBtnText = document.getElementById('submitBtnText');

// Variable para almacenar el ID de la actividad (null = crear, número = editar)
let activityId = null;

// Escuchar datos de actividad para edición
ipcRenderer.on('load-activity-data', (event, data) => {
    activityId = data.id;
    
    // Cambiar título y botón a modo edición
    formTitleText.textContent = 'Editar Actividad';
    submitBtnText.textContent = 'Actualizar Actividad';
    document.title = 'Editar Actividad';
    
    // Cargar datos en el formulario
    document.getElementById('activityName').value = data.name;
    document.getElementById('activityType').value = data.type;
    document.getElementById('activityDays').value = data.days;
    document.getElementById('activityPrice').value = data.price;
    
    // Actualizar el label de días según el tipo
    typeSelect.dispatchEvent(new Event('change'));
});

// Cambiar validación según el tipo seleccionado
typeSelect.addEventListener('change', (e) => {
    const type = e.target.value;
    
    if (type === 'semanal') {
        daysInput.max = 7;
        daysLabel.textContent = 'Días a la semana';
        daysHelp.textContent = 'Máximo 7 días a la semana';
        daysInput.placeholder = 'Ej: 3 (días a la semana)';
    } else if (type === 'mensual') {
        daysInput.max = 30;
        daysLabel.textContent = 'Días al mes';
        daysHelp.textContent = 'Máximo 30 días al mes';
        daysInput.placeholder = 'Ej: 12 (días al mes)';
    } else {
        daysInput.max = 30;
        daysLabel.textContent = 'Días';
        daysHelp.textContent = 'Seleccione un tipo primero';
        daysInput.placeholder = 'Ingrese cantidad de días';
    }
    
    // Resetear valor si excede el nuevo máximo
    if (daysInput.value > daysInput.max) {
        daysInput.value = daysInput.max;
    }
});

// Cancelar - cerrar ventana
cancelBtn.addEventListener('click', () => {
    ipcRenderer.send('close-activity-form');
});

// Enviar formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const activityData = {
        name: document.getElementById('activityName').value,
        type: document.getElementById('activityType').value,
        days: parseInt(document.getElementById('activityDays').value),
        price: parseFloat(document.getElementById('activityPrice').value)
    };

    console.log(activityId ? 'Actualizando actividad:' : 'Creando actividad:', activityData);

    try {
        let response;
        
        if (activityId) {
            // ACTUALIZAR - PATCH
            response = await axios.patch(`http://localhost:4001/activities/${activityId}`, activityData);
            console.log('Actividad actualizada exitosamente:', response.data);
        } else {
            // CREAR - POST
            response = await axios.post('http://localhost:4001/activities', activityData);
            console.log('Actividad creada exitosamente:', response.data);
        }

        // Enviar datos al proceso principal
        ipcRenderer.send('save-activity', response.data);
        
        // Cerrar ventana
        ipcRenderer.send('close-activity-form');
        
    } catch (error) {
        console.error('Error al guardar actividad:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error al guardar la actividad';
        alert('Error al guardar la actividad: ' + errorMessage);
    }
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.send('close-activity-form');
    }
});
