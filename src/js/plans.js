const { ipcRenderer } = require('electron');

let allPlans = [];

// Sistema de tema para la página de planes
function initThemeTogglePlans() {
    const elements = {
        plansCard: document.getElementById('plansCard'),
        plansTableCard: document.getElementById('plansTableCard'),
        plansTitle: document.getElementById('plansTitle'),
        searchInput: document.getElementById('searchInput'),
        loadingMessage: document.getElementById('loadingMessage'),
        noDataTitle: document.getElementById('noDataTitle'),
        noDataText: document.getElementById('noDataText'),
        tableHead: document.getElementById('tableHead'),
        plansTableBody: document.getElementById('plansTableBody'),
        deletePlanModalContainer: document.getElementById('deletePlanModalContainer'),
        deletePlanModalHeader: document.getElementById('deletePlanModalHeader'),
        deletePlanModalBody: document.getElementById('deletePlanModalBody'),
        deletePlanModalFooter: document.getElementById('deletePlanModalFooter'),
        deletePlanModalTitle: document.getElementById('deletePlanModalTitle'),
        deletePlanModalQuestion: document.getElementById('deletePlanModalQuestion'),
        deletePlanModalDescription: document.getElementById('deletePlanModalDescription'),
        cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
        viewSchedulesModalContainer: document.getElementById('viewSchedulesModalContainer'),
        viewSchedulesModalHeader: document.getElementById('viewSchedulesModalHeader'),
        viewSchedulesModalBody: document.getElementById('viewSchedulesModalBody'),
        viewSchedulesModalFooter: document.getElementById('viewSchedulesModalFooter'),
        viewSchedulesModalTitle: document.getElementById('viewSchedulesModalTitle'),
        viewSchedulesModalQuestion: document.getElementById('viewSchedulesModalQuestion')
    };
    
    // Aplicar tema inicial
    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        applyThemeToPlans(currentTheme, elements);
        
        // Escuchar cambios de tema
        window.themeManager.addThemeChangeListener((newTheme) => {
            applyThemeToPlans(newTheme, elements);
        });
    }
}

function applyThemeToPlans(theme, elements) {
    const isDark = theme === 'dark';
    
    // Cards
    if (elements.plansCard) {
        elements.plansCard.className = isDark 
            ? 'bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 mb-6'
            : 'bg-gray-100 rounded-xl shadow-md p-6 border border-gray-300 mb-6';
    }
    
    if (elements.plansTableCard) {
        elements.plansTableCard.className = isDark
            ? 'bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden'
            : 'bg-gray-100 rounded-xl shadow-md border border-gray-300 overflow-hidden';
    }
    
    // Títulos
    if (elements.plansTitle) {
        elements.plansTitle.className = isDark
            ? 'text-xl font-bold text-white'
            : 'text-xl font-bold text-gray-900';
    }
    
    if (elements.noDataTitle) {
        elements.noDataTitle.className = isDark
            ? 'text-lg font-semibold text-white mb-2'
            : 'text-lg font-semibold text-gray-900 mb-2';
    }
    
    // Textos
    if (elements.noDataText) {
        elements.noDataText.className = isDark
            ? 'text-gray-300'
            : 'text-gray-600';
    }
    
    if (elements.loadingMessage) {
        // Preservar el estado de visibilidad (hidden)
        const isHidden = elements.loadingMessage.classList.contains('hidden');
        elements.loadingMessage.className = isDark
            ? 'p-8 text-center text-gray-300'
            : 'p-8 text-center text-gray-500';
        // Re-aplicar hidden si estaba oculto
        if (isHidden) {
            elements.loadingMessage.classList.add('hidden');
        }
    }
    
    // Input de búsqueda
    if (elements.searchInput) {
        elements.searchInput.className = isDark
            ? 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-700 text-white outline-none'
            : 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-200 text-gray-900 outline-none';
    }
    
    // Tabla
    if (elements.tableHead) {
        elements.tableHead.className = isDark
            ? 'bg-gray-700'
            : 'bg-gray-50';
    }
    
    if (elements.plansTableBody) {
        elements.plansTableBody.className = isDark
            ? 'bg-gray-800 divide-y divide-gray-700'
            : 'bg-white divide-y divide-gray-200';
    }
    
    // Headers de tabla
    const tableHeaders = document.querySelectorAll('.table-header');
    tableHeaders.forEach(header => {
        header.className = isDark
            ? 'table-header px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'
            : 'table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
    });
    
    // Modales - Delete Modal
    if (elements.deletePlanModalContainer) {
        elements.deletePlanModalContainer.className = isDark
            ? 'bg-gray-800 border-2 border-gray-700 max-w-md w-full mx-4 rounded-lg shadow-xl'
            : 'bg-gray-100 border-2 border-gray-300 max-w-md w-full mx-4 rounded-lg shadow-xl';
    }
    
    if (elements.deletePlanModalHeader) {
        elements.deletePlanModalHeader.className = isDark
            ? 'bg-gray-900 px-4 py-3 flex items-center justify-between border-b-2 border-gray-700 rounded-t-lg'
            : 'bg-gray-100 px-4 py-3 flex items-center justify-between border-b-2 border-gray-300 rounded-t-lg';
    }
    
    if (elements.deletePlanModalBody) {
        elements.deletePlanModalBody.className = isDark
            ? 'p-4 bg-gray-800'
            : 'p-4 bg-gray-100';
    }
    
    if (elements.deletePlanModalFooter) {
        elements.deletePlanModalFooter.className = isDark
            ? 'border-t border-gray-700 pt-3 flex justify-end gap-2'
            : 'border-t border-gray-300 pt-3 flex justify-end gap-2';
    }
    
    if (elements.deletePlanModalTitle) {
        elements.deletePlanModalTitle.className = isDark
            ? 'text-white font-bold text-sm'
            : 'text-gray-900 font-bold text-sm';
    }
    
    if (elements.deletePlanModalQuestion) {
        elements.deletePlanModalQuestion.className = isDark
            ? 'text-sm font-bold text-white mb-2'
            : 'text-sm font-bold text-gray-900 mb-2';
    }
    
    if (elements.deletePlanModalDescription) {
        elements.deletePlanModalDescription.className = isDark
            ? 'text-xs text-gray-300'
            : 'text-xs text-gray-700';
    }
    
    if (elements.cancelDeleteBtn) {
        elements.cancelDeleteBtn.className = isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded text-sm transition-colors border border-gray-600'
            : 'bg-gray-400 hover:bg-gray-500 text-gray-900 font-bold py-2 px-6 rounded text-sm transition-colors border border-gray-500';
    }
    
    // Modales - View Schedules Modal
    if (elements.viewSchedulesModalContainer) {
        elements.viewSchedulesModalContainer.className = isDark
            ? 'bg-gray-800 border-2 border-gray-700 max-w-md w-full mx-4 rounded-lg shadow-xl'
            : 'bg-gray-100 border-2 border-gray-300 max-w-md w-full mx-4 rounded-lg shadow-xl';
    }
    
    if (elements.viewSchedulesModalHeader) {
        elements.viewSchedulesModalHeader.className = isDark
            ? 'bg-gray-900 px-4 py-3 border-b-2 border-gray-700 rounded-t-lg flex items-center justify-between'
            : 'bg-gray-100 px-4 py-3 border-b-2 border-gray-300 rounded-t-lg flex items-center justify-between';
    }
    
    if (elements.viewSchedulesModalBody) {
        elements.viewSchedulesModalBody.className = isDark
            ? 'p-4 bg-gray-800'
            : 'p-4 bg-gray-100';
    }
    
    if (elements.viewSchedulesModalFooter) {
        elements.viewSchedulesModalFooter.className = isDark
            ? 'border-t border-gray-700 pt-3 mt-4 flex justify-end'
            : 'border-t border-gray-300 pt-3 mt-4 flex justify-end';
    }
    
    if (elements.viewSchedulesModalTitle) {
        elements.viewSchedulesModalTitle.className = isDark
            ? 'text-white font-bold text-sm'
            : 'text-gray-900 font-bold text-sm';
    }
    
    if (elements.viewSchedulesModalQuestion) {
        elements.viewSchedulesModalQuestion.className = isDark
            ? 'text-sm font-bold text-white mb-1'
            : 'text-sm font-bold text-gray-900 mb-1';
    }
    
    // Actualizar filas de la tabla si ya existen
    updateTableRowsTheme(isDark);
}

function updateTableRowsTheme(isDark) {
    const rows = document.querySelectorAll('#plansTableBody tr');
    rows.forEach(row => {
        row.className = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
        
        // Actualizar celdas
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            if (index === 0 || index === 2 || index === 3) {
                // Columnas de texto secundario
                const spans = cell.querySelectorAll('span:not(.bg-orange-500)');
                spans.forEach(span => {
                    if (span.classList.contains('rounded')) {
                        span.className = isDark
                            ? 'px-3 py-1 text-xs rounded bg-gray-700 text-gray-300'
                            : 'px-3 py-1 text-xs rounded bg-gray-100 text-gray-700';
                    }
                });
                
                if (!cell.querySelector('span')) {
                    cell.className = isDark
                        ? 'px-6 py-4 whitespace-nowrap text-sm text-gray-300'
                        : 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                }
            } else if (index === 1 || index === 4) {
                // Columnas de texto principal (nombre y precio)
                cell.className = isDark
                    ? 'px-6 py-4 whitespace-nowrap text-sm font-medium text-white'
                    : 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900';
            }
        });
        
        // Actualizar botones de acción
        const buttons = row.querySelectorAll('button');
        buttons.forEach(button => {
            button.className = isDark
                ? 'text-white hover:text-orange-500 transition'
                : 'text-black hover:text-gray-700 transition';
        });
    });
}

function initPlansListeners() {
    const checkInterval = setInterval(() => {
        const openModalBtn = document.getElementById('openPlanModal');
        const searchInput = document.getElementById('searchInput');
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (openModalBtn && searchInput && loadingMessage) {
            clearInterval(checkInterval);
            
            openModalBtn.addEventListener('click', () => {
                ipcRenderer.send('open-plan-form');
            });

            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                filterPlans(searchTerm);
            });

            // Inicializar el tema
            initThemeTogglePlans();

            loadPlans();
        }
    }, 50);
    
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 3000);
}

async function loadPlans() {
    const loadingMessage = document.getElementById('loadingMessage');
    const noDataMessage = document.getElementById('noDataMessage');
    const tableContainer = document.getElementById('tableContainer');
    const tableBody = document.getElementById('plansTableBody');
    
    if (!loadingMessage || !tableContainer || !tableBody) {
        console.error('Elementos del DOM no encontrados');
        return;
    }

    // Mostrar mensaje de carga
    loadingMessage.classList.remove('hidden');
    tableContainer.classList.add('hidden');
    if (noDataMessage) noDataMessage.classList.add('hidden');

    try {
        const response = await axios.get('http://localhost:4001/plans');
        allPlans = response.data;

        // Ocultar mensaje de carga
        loadingMessage.classList.add('hidden');

        if (allPlans.length === 0) {
            if (noDataMessage) noDataMessage.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        } else {
            if (noDataMessage) noDataMessage.classList.add('hidden');
            tableContainer.classList.remove('hidden');
            renderPlans(allPlans, tableBody);
        }
    } catch (error) {
        console.error('Error al cargar planes:', error);
        loadingMessage.innerHTML = `<div class="text-red-600">Error al cargar los planes: ${error.message}</div>`;
        loadingMessage.classList.remove('hidden');
        tableContainer.classList.add('hidden');
    }
}

function renderPlans(plans, tableBody) {
    tableBody.innerHTML = '';
    
    // Obtener el tema actual
    const isDark = window.themeManager ? window.themeManager.getCurrentTheme() === 'dark' : true;

    plans.forEach(plan => {
        const row = document.createElement('tr');
        row.className = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
        
        const cantidad = plan.cantidad || 0;
        const precio = plan.precio || 0;
        
        let cantidadText = `${cantidad} ${cantidad === 1 ? 'mes' : 'meses'}`;
        
        // Colores según el tema
        const textColor = isDark ? 'text-gray-300' : 'text-gray-500';
        const textBoldColor = isDark ? 'text-white' : 'text-gray-900';
        const badgeBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
        const badgeText = isDark ? 'text-gray-300' : 'text-gray-700';
        const buttonColor = isDark ? 'text-white hover:text-orange-500' : 'text-black hover:text-gray-700';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                <span class="px-2 py-1 text-xs rounded-full bg-orange-500 text-white">
                    ${plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${textBoldColor}">
                ${plan.name}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                ${cantidadText}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                <button onclick="window.viewSchedules(${plan.id}, '${plan.name}')" class="px-3 py-1 text-xs rounded ${badgeBg} ${badgeText} hover:bg-orange-500 hover:text-white transition cursor-pointer">
                    0 horarios
                </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold ${textBoldColor}">
                $${parseFloat(precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button onclick="window.editPlan(${plan.id})" 
                    class="${buttonColor} transition" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onclick="window.deletePlan(${plan.id}, '${plan.name}')" 
                    class="${buttonColor} transition" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

window.editPlan = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4001/plans/${id}`);
        ipcRenderer.send('open-plan-form', response.data);
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

window.deletePlan = async (id, name) => {
    const modal = document.getElementById('deletePlanModal');
    const planNameSpan = document.getElementById('deletePlanName');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    
    if (planNameSpan) planNameSpan.textContent = name;
    if (modal) modal.classList.remove('hidden');
    
    // Limpiar eventos anteriores
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Confirmar eliminación
    newConfirmBtn.addEventListener('click', async () => {
        try {
            await axios.delete(`http://localhost:4001/plans/${id}`);
            modal.classList.add('hidden');
            loadPlans();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
    
    // Cancelar
    newCancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
};

window.viewSchedules = async (planId, planName) => {
    const modal = document.getElementById('viewSchedulesModal');
    const planNameSpan = document.getElementById('schedulePlanName');
    const schedulesList = document.getElementById('schedulesList');
    const closeBtn = document.getElementById('closeSchedulesBtn');
    const closeModalBtn = document.getElementById('closeSchedulesModalBtn');
    
    if (planNameSpan) planNameSpan.textContent = planName;
    if (modal) modal.classList.remove('hidden');
    
    // Obtener el tema actual
    const isDark = window.themeManager ? window.themeManager.getCurrentTheme() === 'dark' : true;
    const bgClass = isDark ? 'bg-gray-700' : 'bg-gray-100';
    const textClass = isDark ? 'text-gray-300' : 'text-gray-700';
    const borderClass = isDark ? 'border-gray-600' : 'border-gray-300';
    
    try {
        const response = await axios.get(`http://localhost:4001/plans/${planId}`);
        const plan = response.data;
        
        if (schedulesList) {
            if (plan.schedules && plan.schedules.length > 0) {
                schedulesList.innerHTML = plan.schedules.map(schedule => `
                    <div class="p-3 ${bgClass} rounded-lg border ${borderClass}">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-semibold ${textClass}">
                                    ${schedule.dayOfWeek || 'Día no especificado'}
                                </p>
                                <p class="text-xs ${textClass}">
                                    ${schedule.startTime || '00:00'} - ${schedule.endTime || '00:00'}
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('');
            } else {
                schedulesList.innerHTML = `
                    <div class="p-4 text-center ${textClass}">
                        <p>No hay horarios registrados para este plan</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        if (schedulesList) {
            schedulesList.innerHTML = `
                <div class="p-4 text-center text-red-500">
                    <p>Error al cargar horarios: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Cerrar modal
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }
    
    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }
};

function filterPlans(searchTerm) {
    const tableBody = document.getElementById('plansTableBody');
    
    if (!searchTerm) {
        renderPlans(allPlans, tableBody);
        return;
    }

    const filteredPlans = allPlans.filter(plan => {
        return plan.name.toLowerCase().includes(searchTerm) || 
               plan.type.toLowerCase().includes(searchTerm);
    });

    renderPlans(filteredPlans, tableBody);
}

ipcRenderer.on('plan-saved', loadPlans);

window.initPlansListeners = initPlansListeners;
window.loadPlans = loadPlans;