const { ipcRenderer } = require('electron');
const axios = require('axios');

// Elementos del DOM
const closeBtn = document.getElementById('closeBtn');
const loadingMessage = document.getElementById('loadingMessage');
const noDataMessage = document.getElementById('noDataMessage');
const tableContainer = document.getElementById('tableContainer');
const tableBody = document.getElementById('activitiesTableBody');

// Escuchar cuando se guarda una actividad para recargar
ipcRenderer.on('activity-saved', () => {
    console.log('Actividad guardada, recargando lista...');
    loadActivities();
});

// Cerrar ventana
closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-activities-list');
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.send('close-activities-list');
    }
});

// Cargar actividades al abrir la ventana
async function loadActivities() {
    try {
        const response = await axios.get('http://localhost:4001/activities');
        const activities = response.data;

        loadingMessage.classList.add('hidden');

        if (activities.length === 0) {
            // No hay actividades: mostrar mensaje y ocultar tabla
            noDataMessage.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        } else {
            // Hay actividades: ocultar mensaje y mostrar tabla
            noDataMessage.classList.add('hidden');
            tableContainer.classList.remove('hidden');
            renderActivities(activities);
        }
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        loadingMessage.innerHTML = `
            <div class="text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error al cargar las actividades
            </div>
        `;
    }
}

// Renderizar actividades en la tabla
function renderActivities(activities) {
    tableBody.innerHTML = '';

    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        // Formatear días según tipo
        const daysText = activity.type === 'mensual' 
            ? `${activity.days} días al mes`
            : `${activity.days} días a la semana`;

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${activity.name}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span class="px-2 py-1 text-xs rounded-full ${
                    activity.type === 'mensual' 
                        ? 'bg-black text-white' 
                        : 'bg-gray-300 text-gray-800'
                }">
                    ${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                ${daysText}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                ${activity.membersCount || 0}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                $${parseFloat(activity.price).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button onclick="editActivity(${activity.id})" 
                    class="text-gray-900 hover:text-gray-600 transition"
                    title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onclick="deleteActivity(${activity.id}, '${activity.name}')" 
                    class="text-gray-900 hover:text-gray-600 transition"
                    title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Editar actividad
window.editActivity = async (id) => {
    try {
        // Obtener los datos de la actividad
        const response = await axios.get(`http://localhost:4001/activities/${id}`);
        const activityData = response.data;
        
        console.log('Editar actividad:', activityData);
        
        // Enviar señal al main para abrir formulario con datos
        ipcRenderer.send('open-activity-form', activityData);
        
        // Cerrar el listado
        ipcRenderer.send('close-activities-list');
        
    } catch (error) {
        console.error('Error al cargar actividad:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error al cargar la actividad';
        alert('Error: ' + errorMessage);
    }
};

// Eliminar actividad
window.deleteActivity = async (id, name) => {
    const confirmed = confirm(`¿Estás seguro de eliminar la actividad "${name}"?`);
    
    if (!confirmed) return;

    try {
        await axios.delete(`http://localhost:4001/activities/${id}`);
        console.log('Actividad eliminada:', id);
        
        // Recargar la lista
        loadActivities();
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar la actividad';
        alert('Error: ' + errorMessage);
    }
};

// Cargar actividades al iniciar
loadActivities();
