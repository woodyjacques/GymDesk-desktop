const { ipcRenderer } = require('electron');

// Variable global para almacenar todos los planes
let allPlans = [];

function initPlansListeners() {
    // Botón para abrir el formulario de nuevo plan
    const openModalBtn = document.getElementById('openActivityModal');
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            ipcRenderer.send('open-activity-form');
        });
    }

    // Input de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterPlans(searchTerm);
        });
    }

    // Cargar los planes al iniciar
    loadPlans();
    
    // Aplicar tema inicial
    applyCurrentTheme();
}

// Elementos del DOM
function getElements() {
    return {
        loadingMessage: document.getElementById('loadingMessage'),
        noDataMessage: document.getElementById('noDataMessage'),
        tableContainer: document.getElementById('tableContainer'),
        tableBody: document.getElementById('plansTableBody'),
        plansCard: document.getElementById('plansCard'),
        plansTableCard: document.getElementById('plansTableCard'),
        plansTitle: document.getElementById('plansTitle'),
        noDataTitle: document.getElementById('noDataTitle'),
        noDataText: document.getElementById('noDataText'),
        searchInput: document.getElementById('searchInput'),
        loadingText: document.querySelector('#loadingMessage'),
        // Modales - EXACTAMENTE como logout modal
        deletePlanModalContainer: document.getElementById('deletePlanModalContainer'),
        deletePlanModalHeader: document.getElementById('deletePlanModalHeader'),
        deletePlanModalBody: document.getElementById('deletePlanModalBody'),
        deletePlanModalTitle: document.getElementById('deletePlanModalTitle'),
        deletePlanModalQuestion: document.getElementById('deletePlanModalQuestion'),
        deletePlanModalDescription: document.getElementById('deletePlanModalDescription'),
        viewSchedulesModalContainer: document.getElementById('viewSchedulesModalContainer'),
        viewSchedulesModalHeader: document.getElementById('viewSchedulesModalHeader'),
        viewSchedulesModalBody: document.getElementById('viewSchedulesModalBody'),
        viewSchedulesModalTitle: document.getElementById('viewSchedulesModalTitle'),
        viewSchedulesModalQuestion: document.getElementById('viewSchedulesModalQuestion'),
        cancelDeleteBtn: document.getElementById('cancelDeleteBtn')
    };
}

// Cargar planes desde el backend
async function loadPlans() {
    const elements = getElements();
    
    if (!elements.loadingMessage || !elements.noDataMessage || !elements.tableContainer || !elements.tableBody) {
        console.error('Elementos del DOM no encontrados');
        return;
    }

    try {
        const response = await axios.get('http://localhost:4001/plans');
        allPlans = response.data;

        elements.loadingMessage.classList.add('hidden');

        if (allPlans.length === 0) {
            elements.noDataMessage.classList.remove('hidden');
            elements.tableContainer.classList.add('hidden');
        } else {
            elements.noDataMessage.classList.add('hidden');
            elements.tableContainer.classList.remove('hidden');
            renderPlans(allPlans, elements.tableBody);
        }
    } catch (error) {
        console.error('Error al cargar planes:', error);
        elements.loadingMessage.innerHTML = `
            <div class="text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Error al cargar los planes: ${error.message}
            </div>
        `;
        elements.loadingMessage.classList.remove('hidden');
    }
}

// Renderizar planes en la tabla
function renderPlans(plans, tableBody) {
    tableBody.innerHTML = '';

    plans.forEach(plan => {
        const row = document.createElement('tr');
        row.className = 'plan-row hover:bg-gray-50';
        
        const cantidad = plan.cantidad || plan.days || 0;
        const precio = plan.precio || plan.price || 0;
        
        let cantidadText = '';
        if (plan.type === 'mensual') {
            cantidadText = `${cantidad} ${cantidad === 1 ? 'mes' : 'meses'}`;
        } else if (plan.type === 'semanal') {
            cantidadText = `${cantidad} ${cantidad === 1 ? 'semana' : 'semanas'}`;
        } else if (plan.type === 'diario') {
            cantidadText = `${cantidad} ${cantidad === 1 ? 'día' : 'días'}`;
        } else {
            cantidadText = cantidad.toString();
        }

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm plan-text-secondary">
                <span class="px-2 py-1 text-xs rounded-full ${
                    plan.type === 'mensual' 
                        ? 'bg-orange-500 text-white' 
                        : plan.type === 'semanal'
                        ? 'bg-orange-400 text-white'
                        : 'bg-orange-300 text-white'
                }">
                    ${plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium plan-text-primary">
                ${plan.name}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm plan-text-secondary">
                ${cantidadText}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm plan-text-secondary">
                <button onclick="window.viewSchedules(${plan.id}, '${plan.name}')" 
                    class="schedule-btn px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition flex items-center space-x-1"
                    title="Ver horarios">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>${(plan.schedules && plan.schedules.length) || 0}</span>
                </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold plan-text-primary">
                $${parseFloat(precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button onclick="window.editPlan(${plan.id})" 
                    class="text-orange-500 hover:text-orange-600 transition"
                    title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onclick="window.deletePlan(${plan.id}, '${plan.name}')" 
                    class="text-red-500 hover:text-red-600 transition"
                    title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
    
    // Aplicar tema solo después de renderizar las filas
    applyCurrentTheme();
}

// Editar plan
window.editPlan = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4001/plans/${id}`);
        const planData = response.data;
        ipcRenderer.send('open-activity-form', planData);
    } catch (error) {
        console.error('Error al cargar plan:', error);
        alert('Error: ' + (error.response?.data?.message || error.message));
    }
};

// Ver horarios
window.viewSchedules = async (id, name) => {
    try {
        const response = await axios.get(`http://localhost:4001/plans/${id}`);
        const schedules = response.data.schedules || [];
        
        const modal = document.getElementById('viewSchedulesModal');
        const planNameSpan = document.getElementById('schedulePlanName');
        const schedulesList = document.getElementById('schedulesList');
        const closeBtn = document.getElementById('closeSchedulesBtn');
        const closeModalBtn = document.getElementById('closeSchedulesModalBtn');
        
        if (!modal || !planNameSpan || !schedulesList) {
            console.error('Modal de horarios no encontrado');
            return;
        }
        
        // Obtener tema actual cuando se abre el modal
        const currentTheme = window.themeManager ? window.themeManager.getCurrentTheme() : 'dark';
        const isDark = currentTheme === 'dark';
        
        // Establecer el nombre del plan
        planNameSpan.textContent = name;
        
        // Limpiar lista anterior
        schedulesList.innerHTML = '';
        
        if (schedules.length === 0) {
            schedulesList.innerHTML = `
                <div class="flex items-start space-x-3 p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded border ${isDark ? 'border-gray-700' : 'border-gray-300'}">
                    <div class="bg-orange-500 p-2 flex-shrink-0 rounded">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex-1 pt-1">
                        <p class="text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1">Sin horarios definidos</p>
                        <p class="text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}">El plan "${name}" no tiene horarios definidos.</p>
                    </div>
                </div>
            `;
        } else {
            schedules.forEach((schedule, index) => {
                const scheduleItem = document.createElement('div');
                scheduleItem.className = `flex items-center space-x-3 p-3 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'} rounded border`;
                scheduleItem.innerHTML = `
                    <div class="bg-orange-500 p-2 flex-shrink-0 rounded">
                        <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}">${schedule.dayOfWeek}</p>
                        <p class="text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}">${schedule.startTime} - ${schedule.endTime}</p>
                    </div>
                `;
                schedulesList.appendChild(scheduleItem);
            });
        }
        
        // Mostrar el modal
        modal.classList.remove('hidden');
        
        // Función para cerrar el modal
        const closeModal = () => {
            modal.classList.add('hidden');
            closeBtn.removeEventListener('click', closeModal);
            closeModalBtn.removeEventListener('click', closeModal);
        };
        
        // Agregar event listeners
        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        
        // Cerrar modal al hacer clic fuera de él
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    } catch (error) {
        console.error('Error al cargar horarios:', error);
        // Mostrar modal de error
        const modal = document.getElementById('viewSchedulesModal');
        const planNameSpan = document.getElementById('schedulePlanName');
        const schedulesList = document.getElementById('schedulesList');
        
        if (modal && planNameSpan && schedulesList) {
            const currentTheme = window.themeManager ? window.themeManager.getCurrentTheme() : 'dark';
            const isDark = currentTheme === 'dark';
            
            planNameSpan.textContent = name;
            schedulesList.innerHTML = `
                <div class="flex items-start space-x-3 p-3 ${isDark ? 'bg-red-900 bg-opacity-20 border-red-700' : 'bg-red-100 border-red-300'} rounded border">
                    <div class="bg-red-500 p-2 flex-shrink-0 rounded">
                        <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex-1 pt-1">
                        <p class="text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1">Error al cargar horarios</p>
                        <p class="text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}">No se pudieron cargar los horarios del plan.</p>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            
            const closeBtn = document.getElementById('closeSchedulesBtn');
            const closeModalBtn = document.getElementById('closeSchedulesModalBtn');
            const closeModal = () => modal.classList.add('hidden');
            closeBtn.addEventListener('click', closeModal);
            closeModalBtn.addEventListener('click', closeModal);
        }
    }
};

// Eliminar plan
window.deletePlan = async (id, name) => {
    // Mostrar modal de confirmación
    const modal = document.getElementById('deletePlanModal');
    const planNameSpan = document.getElementById('deletePlanName');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    
    if (!modal || !planNameSpan) {
        console.error('Modal de eliminación no encontrado');
        return;
    }
    
    // Establecer el nombre del plan en el modal
    planNameSpan.textContent = name;
    
    // Mostrar el modal
    modal.classList.remove('hidden');
    
    // Función para cerrar el modal
    const closeModal = () => {
        modal.classList.add('hidden');
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', closeModal);
    };
    
    // Función para confirmar eliminación
    const handleConfirm = async () => {
        try {
            await axios.delete(`http://localhost:4001/plans/${id}`);
            closeModal();
            loadPlans();
        } catch (error) {
            console.error('Error al eliminar plan:', error);
            alert('Error: ' + (error.response?.data?.message || error.message));
            closeModal();
        }
    };
    
    // Agregar event listeners
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera de él
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
};

// Filtrar planes
function filterPlans(searchTerm) {
    const elements = getElements();
    
    if (!searchTerm) {
        renderPlans(allPlans, elements.tableBody);
        return;
    }

    const filteredPlans = allPlans.filter(plan => {
        const name = plan.name.toLowerCase();
        const type = plan.type.toLowerCase();
        const precio = (plan.precio || plan.price || 0).toString();
        
        return name.includes(searchTerm) || type.includes(searchTerm) || precio.includes(searchTerm);
    });

    if (filteredPlans.length === 0) {
        elements.tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="font-medium">No se encontraron planes</p>
                    <p class="text-sm mt-1">Intenta con otro término de búsqueda</p>
                </td>
            </tr>
        `;
    } else {
        renderPlans(filteredPlans, elements.tableBody);
    }
}

// Escuchar eventos
ipcRenderer.on('activity-saved', loadPlans);

// Aplicar tema al cargar
function applyCurrentTheme() {
    const elements = getElements();
    
    // Agregar elementos dinámicos de la tabla
    const planRows = document.querySelectorAll('.plan-row');
    const planTextPrimary = document.querySelectorAll('.plan-text-primary');
    const planTextSecondary = document.querySelectorAll('.plan-text-secondary');
    const scheduleButtons = document.querySelectorAll('.schedule-btn');
    const tableHead = document.getElementById('tableHead');
    const tableHeaders = document.querySelectorAll('.table-header');
    const tableBody = document.getElementById('plansTableBody');
    
    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        const isDark = currentTheme === 'dark';
        
        // IGUAL QUE DASHBOARD - pasar elementos con los mismos nombres
        window.themeManager.applyTheme(currentTheme, {
            card: elements.plansCard,
            cards: [elements.plansTableCard].filter(Boolean),
            title: elements.plansTitle,
            titles: [elements.noDataTitle, elements.deletePlanModalTitle, elements.viewSchedulesModalTitle].filter(Boolean),
            texts: [
                elements.noDataText, 
                elements.loadingMessage, 
                elements.deletePlanModalQuestion,
                elements.deletePlanModalDescription,
                elements.viewSchedulesModalQuestion,
                ...planTextSecondary
            ].filter(Boolean),
            inputs: [elements.searchInput].filter(Boolean),
            secondaryButtons: [...scheduleButtons, elements.cancelDeleteBtn].filter(Boolean),
            // Modales - EXACTAMENTE como logout modal en dashboard
            logoutModalContainer: elements.deletePlanModalContainer,
            logoutModalHeader: elements.deletePlanModalHeader,
            logoutModalBody: elements.deletePlanModalBody,
            separators: []
        });
        
        // También aplicar al modal de horarios (segundo modal)
        if (elements.viewSchedulesModalContainer) {
            window.themeManager.applyTheme(currentTheme, {
                logoutModalContainer: elements.viewSchedulesModalContainer,
                logoutModalHeader: elements.viewSchedulesModalHeader,
                logoutModalBody: elements.viewSchedulesModalBody
            });
        }
        
        // Aplicar tema al thead
        if (tableHead) {
            tableHead.classList.toggle('bg-gray-50', !isDark);
            tableHead.classList.toggle('bg-gray-800', isDark);
        }
        
        // Aplicar tema a los headers (th)
        tableHeaders.forEach(th => {
            th.classList.toggle('text-gray-500', !isDark);
            th.classList.toggle('text-gray-300', isDark);
        });
        
        // Aplicar tema al tbody
        if (tableBody) {
            tableBody.classList.toggle('bg-white', !isDark);
            tableBody.classList.toggle('bg-gray-900', isDark);
            tableBody.classList.toggle('divide-gray-200', !isDark);
            tableBody.classList.toggle('divide-gray-700', isDark);
        }
        
        // Aplicar colores específicos para texto de tabla
        planTextPrimary.forEach(el => {
            el.classList.toggle('text-gray-900', !isDark);
            el.classList.toggle('text-white', isDark);
        });
        
        // Cambiar hover de las filas
        planRows.forEach(row => {
            row.classList.toggle('hover:bg-gray-50', !isDark);
            row.classList.toggle('hover:bg-gray-700', isDark);
        });
    }
}

// Exportar para uso global
window.initPlansListeners = initPlansListeners;
window.applyPlansTheme = applyCurrentTheme;
