const { ipcRenderer } = require('electron');

// Elementos del DOM
const form = document.getElementById('activityForm');
const cancelBtn = document.getElementById('cancelBtn');
const typeSelect = document.getElementById('activityType');
const daysInput = document.getElementById('activityDays');
const daysLabel = document.getElementById('daysLabel');
const daysHelp = document.getElementById('daysHelp');
const formTitleText = document.getElementById('formTitleText');
const submitBtnText = document.getElementById('submitBtnText');

// Elementos de horarios
const scheduleDayInput = document.getElementById('scheduleDay');
const scheduleStartInput = document.getElementById('scheduleStart');
const scheduleEndInput = document.getElementById('scheduleEnd');
const addScheduleBtn = document.getElementById('addScheduleBtn');
const schedulesList = document.getElementById('schedulesList');

// Variable para almacenar el ID del plan (null = crear, número = editar)
let activityId = null;

// Array para almacenar horarios
let schedules = [];

// Escuchar datos de plan para edición
ipcRenderer.on('load-plan-data', (event, data) => {
    activityId = data.id;
    
    // Cambiar título y botón a modo edición
    formTitleText.textContent = 'Editar Plan';
    submitBtnText.textContent = 'Actualizar Plan';
    document.title = 'Editar Plan';
    
    // Cargar datos en el formulario
    document.getElementById('activityName').value = data.name;
    document.getElementById('activityType').value = data.type;
    document.getElementById('activityDays').value = data.cantidad || data.days; // Soportar ambos campos
    document.getElementById('activityPrice').value = data.precio || data.price; // Soportar ambos campos
    
    // Cargar horarios si existen
    if (data.schedules && data.schedules.length > 0) {
        schedules = data.schedules.map(s => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime
        }));
        renderSchedules();
    }
    
    // Actualizar el label de días según el tipo
    typeSelect.dispatchEvent(new Event('change'));
});

// Cambiar validación según el tipo seleccionado
typeSelect.addEventListener('change', (e) => {
    const type = e.target.value;
    
    if (type === 'mensual') {
        daysInput.min = 1;
        daysInput.max = 12;
        daysLabel.textContent = 'Meses';
        daysHelp.textContent = 'De 1 a 12 meses';
        daysInput.placeholder = 'Ej: 6 (meses)';
    } else if (type === 'semanal') {
        daysInput.min = 1;
        daysInput.max = 4;
        daysLabel.textContent = 'Semanas';
        daysHelp.textContent = 'De 1 a 4 semanas';
        daysInput.placeholder = 'Ej: 2 (semanas)';
    } else if (type === 'diario') {
        daysInput.min = 1;
        daysInput.max = 365;
        daysLabel.textContent = 'Días';
        daysHelp.textContent = 'De 1 a 365 días';
        daysInput.placeholder = 'Ej: 30 (días)';
    } else {
        daysInput.min = 1;
        daysInput.max = 365;
        daysLabel.textContent = 'Cantidad';
        daysHelp.textContent = 'Seleccione un tipo primero';
        daysInput.placeholder = 'Ingrese cantidad';
    }
    
    // Resetear valor si excede el nuevo máximo o está por debajo del mínimo
    if (daysInput.value > daysInput.max) {
        daysInput.value = daysInput.max;
    }
    if (daysInput.value && daysInput.value < daysInput.min) {
        daysInput.value = daysInput.min;
    }
});

// Renderizar lista de horarios
function renderSchedules() {
    schedulesList.innerHTML = '';
    
    if (schedules.length === 0) {
        schedulesList.innerHTML = '<p class="text-xs text-gray-500 text-center py-2">No hay horarios agregados</p>';
        return;
    }
    
    schedules.forEach((schedule, index) => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item flex items-center justify-between bg-gray-50 px-2 py-1.5 rounded text-xs';
        scheduleItem.innerHTML = `
            <span class="schedule-text text-gray-700">
                <span class="font-medium">${schedule.dayOfWeek}</span>: ${schedule.startTime} - ${schedule.endTime}
            </span>
            <button type="button" onclick="removeSchedule(${index})" 
                class="text-red-600 hover:text-red-800 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        schedulesList.appendChild(scheduleItem);
    });
    
    // Reaplicar tema a los nuevos elementos
    applyFormTheme();
}

// Agregar horario
addScheduleBtn.addEventListener('click', () => {
    const day = scheduleDayInput.value;
    const start = scheduleStartInput.value;
    const end = scheduleEndInput.value;
    
    if (!day || !start || !end) {
        alert('Por favor complete todos los campos del horario');
        return;
    }
    
    if (start >= end) {
        alert('La hora de inicio debe ser menor que la hora de fin');
        return;
    }
    
    schedules.push({
        dayOfWeek: day,
        startTime: start,
        endTime: end
    });
    
    renderSchedules();
    
    // Limpiar inputs
    scheduleDayInput.value = '';
    scheduleStartInput.value = '';
    scheduleEndInput.value = '';
});

// Eliminar horario
window.removeSchedule = (index) => {
    schedules.splice(index, 1);
    renderSchedules();
};

// Cancelar - cerrar ventana
cancelBtn.addEventListener('click', () => {
    ipcRenderer.send('close-plan-form');
});

// Enviar formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const planData = {
        name: document.getElementById('activityName').value,
        type: document.getElementById('activityType').value,
        cantidad: parseInt(document.getElementById('activityDays').value),
        precio: parseFloat(document.getElementById('activityPrice').value),
        schedules: schedules
    };

    try {
        let response;
        
        if (activityId) {
            // ACTUALIZAR - PATCH
            response = await axios.patch(`http://localhost:4001/plans/${activityId}`, planData);
        } else {
            // CREAR - POST
            response = await axios.post('http://localhost:4001/plans', planData);
        }

        // Enviar datos al proceso principal
        ipcRenderer.send('save-plan', response.data);
        
        // Cerrar ventana
        ipcRenderer.send('close-plan-form');
        
    } catch (error) {
        console.error('Error al guardar plan:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error al guardar el plan';
        alert('Error al guardar el plan: ' + errorMessage);
    }
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.send('close-plan-form');
    }
});

// Aplicar tema al cargar el formulario
function applyFormTheme() {
    const scheduleItems = document.querySelectorAll('.schedule-item');
    const scheduleTexts = document.querySelectorAll('.schedule-text');
    
    const elements = {
        container: document.body,
        card: document.getElementById('formCard'),
        title: document.getElementById('formTitleText'),
        labels: document.querySelectorAll('label'),
        inputs: [
            document.getElementById('activityName'),
            document.getElementById('activityPrice'),
            document.getElementById('activityType'),
            document.getElementById('activityDays'),
            document.getElementById('scheduleDay'),
            document.getElementById('scheduleStart'),
            document.getElementById('scheduleEnd')
        ],
        texts: [document.getElementById('daysHelp'), ...scheduleTexts],
        separators: document.querySelectorAll('.border-t'),
        secondaryButtons: [
            document.getElementById('addScheduleBtn'),
            ...scheduleItems
        ]
    };

    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        window.themeManager.applyTheme(currentTheme, elements);
    }
}

// Aplicar tema al cargar
setTimeout(() => {
    applyFormTheme();
}, 100);
