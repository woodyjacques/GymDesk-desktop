(function() {
    'use strict';
    
    let ipcRenderer;
    try {
        const electron = require('electron');
        ipcRenderer = electron.ipcRenderer;
    } catch (e) {
        console.warn('Electron no disponible aún para visitantes');
    }

    let allVisitantes = [];

    // Sistema de tema para la página de visitantes
    function initThemeToggleVisitantes() {
        const elements = {
            visitantesCard: document.getElementById('visitantesCard'),
            visitantesTableCard: document.getElementById('visitantesTableCard'),
            visitantesTitle: document.getElementById('visitantesTitle'),
        searchVisitantesInput: document.getElementById('searchVisitantesInput'),
        loadingVisitantesMessage: document.getElementById('loadingVisitantesMessage'),
        noVisitantesTitle: document.getElementById('noVisitantesTitle'),
        noVisitantesText: document.getElementById('noVisitantesText'),
        visitantesTableHead: document.getElementById('visitantesTableHead'),
        visitantesTableBody: document.getElementById('visitantesTableBody')
    };
    
    // Aplicar tema inicial
    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        applyThemeToVisitantes(currentTheme, elements);
        
        // Escuchar cambios de tema
        window.themeManager.addThemeChangeListener((newTheme) => {
            applyThemeToVisitantes(newTheme, elements);
        });
    }
}

function applyThemeToVisitantes(theme, elements) {
    const isDark = theme === 'dark';
    
    // Cards
    if (elements.visitantesCard) {
        elements.visitantesCard.className = isDark 
            ? 'bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 mb-6'
            : 'bg-gray-100 rounded-xl shadow-md p-6 border border-gray-300 mb-6';
    }
    
    if (elements.visitantesTableCard) {
        elements.visitantesTableCard.className = isDark
            ? 'bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden'
            : 'bg-gray-100 rounded-xl shadow-md border border-gray-300 overflow-hidden';
    }
    
    // Títulos
    if (elements.visitantesTitle) {
        elements.visitantesTitle.className = isDark
            ? 'text-xl font-bold text-white'
            : 'text-xl font-bold text-gray-900';
    }
    
    if (elements.noVisitantesTitle) {
        elements.noVisitantesTitle.className = isDark
            ? 'text-lg font-semibold text-white mb-2'
            : 'text-lg font-semibold text-gray-900 mb-2';
    }
    
    // Textos
    if (elements.noVisitantesText) {
        elements.noVisitantesText.className = isDark
            ? 'text-gray-300'
            : 'text-gray-600';
    }
    
    if (elements.loadingVisitantesMessage) {
        // Preservar el estado de visibilidad (hidden)
        const isHidden = elements.loadingVisitantesMessage.classList.contains('hidden');
        elements.loadingVisitantesMessage.className = isDark
            ? 'p-8 text-center text-gray-300'
            : 'p-8 text-center text-gray-500';
        // Re-aplicar hidden si estaba oculto
        if (isHidden) {
            elements.loadingVisitantesMessage.classList.add('hidden');
        }
    }
    
    // Input de búsqueda
    if (elements.searchVisitantesInput) {
        elements.searchVisitantesInput.className = isDark
            ? 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-700 text-white outline-none'
            : 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-200 text-gray-900 outline-none';
    }
    
    // Tabla
    if (elements.visitantesTableHead) {
        elements.visitantesTableHead.className = isDark
            ? 'bg-gray-700'
            : 'bg-gray-50';
    }
    
    if (elements.visitantesTableBody) {
        elements.visitantesTableBody.className = isDark
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
    
    // Actualizar filas de la tabla si ya existen
    updateTableRowsTheme(isDark);
}

function updateTableRowsTheme(isDark) {
    const rows = document.querySelectorAll('#visitantesTableBody tr');
    rows.forEach(row => {
        row.className = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
        
        // Actualizar celdas
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
            if (index === 0 || index === 1 || index === 2 || index === 3) {
                // Columnas de texto
                if (!cell.querySelector('span')) {
                    cell.className = isDark
                        ? 'px-6 py-4 whitespace-nowrap text-sm text-gray-300'
                        : 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                }
            } else if (index === 4) {
                // Columna de estado - preservar el estilo del badge
                const badge = cell.querySelector('span');
                if (badge) {
                    // No cambiar el estilo del badge, ya tiene sus propios colores
                }
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

function initVisitantesListeners() {
    const checkInterval = setInterval(() => {
        const openModalBtn = document.getElementById('openVisitanteModal');
        const searchInput = document.getElementById('searchVisitantesInput');
        const loadingMessage = document.getElementById('loadingVisitantesMessage');
        
        if (openModalBtn && searchInput && loadingMessage) {
            clearInterval(checkInterval);
            
            // Re-inicializar ipcRenderer si no está disponible
            if (!ipcRenderer) {
                try {
                    const electron = require('electron');
                    ipcRenderer = electron.ipcRenderer;
                } catch (e) {
                    console.error('Error al cargar ipcRenderer:', e);
                }
            }
            
            openModalBtn.addEventListener('click', () => {
                if (ipcRenderer) {
                    ipcRenderer.send('open-visitante-form');
                }
            });

            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                filterVisitantes(searchTerm);
            });

            // Inicializar el tema
            initThemeToggleVisitantes();

            loadVisitantes();
        }
    }, 50);
    
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 3000);
}

async function loadVisitantes() {
    const loadingMessage = document.getElementById('loadingVisitantesMessage');
    const noDataMessage = document.getElementById('noVisitantesMessage');
    const tableContainer = document.getElementById('visitantesTableContainer');
    const tableBody = document.getElementById('visitantesTableBody');
    
    if (!loadingMessage || !tableContainer || !tableBody) {
        console.error('Elementos del DOM no encontrados');
        return;
    }

    // Mostrar mensaje de carga
    loadingMessage.classList.remove('hidden');
    tableContainer.classList.add('hidden');
    if (noDataMessage) noDataMessage.classList.add('hidden');

    try {
        const response = await axios.get('http://localhost:4001/persons?type=visitante');
        allVisitantes = response.data;

        // Ocultar mensaje de carga
        loadingMessage.classList.add('hidden');

        if (allVisitantes.length === 0) {
            if (noDataMessage) noDataMessage.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        } else {
            if (noDataMessage) noDataMessage.classList.add('hidden');
            tableContainer.classList.remove('hidden');
            renderVisitantes(allVisitantes, tableBody);
        }
    } catch (error) {
        console.error('Error al cargar visitantes:', error);
        loadingMessage.innerHTML = `<div class="text-red-600">Error al cargar los visitantes: ${error.message}</div>`;
        loadingMessage.classList.remove('hidden');
        tableContainer.classList.add('hidden');
    }
}

function renderVisitantes(visitantes, tableBody) {
    tableBody.innerHTML = '';
    
    // Obtener el tema actual
    const isDark = window.themeManager ? window.themeManager.getCurrentTheme() === 'dark' : true;

    visitantes.forEach(visitante => {
        const row = document.createElement('tr');
        row.className = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
        
        const fullName = `${visitante.nombre || ''} ${visitante.apellido || ''}`.trim();
        const phone = visitante.telefono || 'N/A';
        const email = visitante.email || 'N/A';
        const dni = visitante.dni || 'N/A';
        const profesion = visitante.profesion || 'N/A';
        
        // Colores según el tema
        const textColor = isDark ? 'text-gray-300' : 'text-gray-500';
        const buttonColor = isDark ? 'text-white hover:text-orange-500' : 'text-black hover:text-gray-700';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                ${fullName}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                ${phone}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                ${email}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                ${dni}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${textColor}">
                ${profesion}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button onclick="window.editVisitante(${visitante.id})" 
                    class="${buttonColor} transition" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onclick="window.deleteVisitante(${visitante.id}, '${fullName.replace(/'/g, "\\'")}')" 
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

function editVisitante(id) {
    return async () => {
        try {
            const response = await axios.get(`http://localhost:4001/persons/${id}`);
            if (ipcRenderer) {
                ipcRenderer.send('open-visitante-form', response.data);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };
}

function deleteVisitante(id, name) {
    return async () => {
        if (confirm(`¿Estás seguro de eliminar al visitante "${name}"?`)) {
            try {
                await axios.delete(`http://localhost:4001/persons/${id}`);
                loadVisitantes();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };
}

// Exportar funciones para uso en onclick
window.editVisitante = (id) => {
    (async () => {
        try {
            const response = await axios.get(`http://localhost:4001/persons/${id}`);
            if (ipcRenderer) {
                ipcRenderer.send('open-visitante-form', response.data);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    })();
};

window.deleteVisitante = (id, name) => {
    (async () => {
        if (confirm(`¿Estás seguro de eliminar al visitante "${name}"?`)) {
            try {
                await axios.delete(`http://localhost:4001/persons/${id}`);
                if (window.loadVisitantes) {
                    window.loadVisitantes();
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    })();
};

function filterVisitantes(searchTerm) {
    const tableBody = document.getElementById('visitantesTableBody');
    
    if (!searchTerm) {
        renderVisitantes(allVisitantes, tableBody);
        return;
    }

    const filteredVisitantes = allVisitantes.filter(visitante => {
        const fullName = `${visitante.nombre || ''} ${visitante.apellido || ''}`.toLowerCase();
        const phone = (visitante.telefono || '').toLowerCase();
        const email = (visitante.email || '').toLowerCase();
        const dni = (visitante.dni || '').toLowerCase();
        
        return fullName.includes(searchTerm) || 
               phone.includes(searchTerm) || 
               email.includes(searchTerm) ||
               dni.includes(searchTerm);
    });

    renderVisitantes(filteredVisitantes, tableBody);
}

// Escuchar evento de visitante guardado
if (ipcRenderer) {
    ipcRenderer.on('visitante-saved', loadVisitantes);
}

// Exportar funciones al scope global
window.initVisitantesListeners = initVisitantesListeners;
window.loadVisitantes = loadVisitantes;
window.initThemeToggleVisitantes = initThemeToggleVisitantes;

})(); // Cerrar función anónima
