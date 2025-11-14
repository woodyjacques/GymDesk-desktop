(function() {
    'use strict';
    
    let ipcRenderer;
    try {
        const electron = require('electron');
        ipcRenderer = electron.ipcRenderer;
    } catch (e) {
        console.warn('Electron no disponible aún para entrenadores');
    }

    let allEntrenadores = [];

    // Sistema de tema para la página de entrenadores
    function initThemeToggleEntrenadores() {
        const elements = {
            entrenadoresCard: document.getElementById('entrenadoresCard'),
            entrenadoresTableCard: document.getElementById('entrenadoresTableCard'),
            entrenadoresTitle: document.getElementById('entrenadoresTitle'),
            searchEntrenadoresInput: document.getElementById('searchEntrenadoresInput'),
            loadingEntrenadoresMessage: document.getElementById('loadingEntrenadoresMessage'),
            noEntrenadoresTitle: document.getElementById('noEntrenadoresTitle'),
            noEntrenadoresText: document.getElementById('noEntrenadoresText'),
            entrenadoresTableHead: document.getElementById('entrenadoresTableHead'),
            entrenadoresTableBody: document.getElementById('entrenadoresTableBody')
        };
        
        // Aplicar tema inicial
        if (window.themeManager) {
            const currentTheme = window.themeManager.getCurrentTheme();
            applyThemeToEntrenadores(currentTheme, elements);
            
            // Escuchar cambios de tema
            window.themeManager.addThemeChangeListener((newTheme) => {
                applyThemeToEntrenadores(newTheme, elements);
            });
        }
    }

    function applyThemeToEntrenadores(theme, elements) {
        const isDark = theme === 'dark';
        
        // Cards
        if (elements.entrenadoresCard) {
            elements.entrenadoresCard.className = isDark 
                ? 'bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 mb-6'
                : 'bg-gray-100 rounded-xl shadow-md p-6 border border-gray-300 mb-6';
        }
        
        if (elements.entrenadoresTableCard) {
            elements.entrenadoresTableCard.className = isDark
                ? 'bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden'
                : 'bg-gray-100 rounded-xl shadow-md border border-gray-300 overflow-hidden';
        }
        
        // Títulos
        if (elements.entrenadoresTitle) {
            elements.entrenadoresTitle.className = isDark
                ? 'text-xl font-bold text-white'
                : 'text-xl font-bold text-gray-900';
        }
        
        if (elements.noEntrenadoresTitle) {
            elements.noEntrenadoresTitle.className = isDark
                ? 'text-lg font-semibold text-white mb-2'
                : 'text-lg font-semibold text-gray-900 mb-2';
        }
        
        // Textos
        if (elements.noEntrenadoresText) {
            elements.noEntrenadoresText.className = isDark
                ? 'text-gray-300'
                : 'text-gray-600';
        }
        
        if (elements.loadingEntrenadoresMessage) {
            const isHidden = elements.loadingEntrenadoresMessage.classList.contains('hidden');
            elements.loadingEntrenadoresMessage.className = isDark
                ? 'p-8 text-center text-gray-300'
                : 'p-8 text-center text-gray-500';
            if (isHidden) {
                elements.loadingEntrenadoresMessage.classList.add('hidden');
            }
        }
        
        // Input de búsqueda
        if (elements.searchEntrenadoresInput) {
            elements.searchEntrenadoresInput.className = isDark
                ? 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-700 text-white outline-none'
                : 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-200 text-gray-900 outline-none';
        }
        
        // Tabla
        if (elements.entrenadoresTableHead) {
            elements.entrenadoresTableHead.className = isDark
                ? 'bg-gray-700'
                : 'bg-gray-50';
        }
        
        if (elements.entrenadoresTableBody) {
            elements.entrenadoresTableBody.className = isDark
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
        
        updateTableRowsTheme(isDark);
    }

    function updateTableRowsTheme(isDark) {
        const rows = document.querySelectorAll('#entrenadoresTableBody tr');
        rows.forEach(row => {
            row.className = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
            
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4) {
                    if (!cell.querySelector('span')) {
                        cell.className = isDark
                            ? 'px-6 py-4 whitespace-nowrap text-sm text-gray-300'
                            : 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
                    }
                }
            });
            
            const buttons = row.querySelectorAll('button');
            buttons.forEach(button => {
                button.className = isDark
                    ? 'text-white hover:text-orange-500 transition'
                    : 'text-black hover:text-gray-700 transition';
            });
        });
    }

    function initEntrenadoresListeners() {
        const checkInterval = setInterval(() => {
            const openModalBtn = document.getElementById('openEntrenadorModal');
            const searchInput = document.getElementById('searchEntrenadoresInput');
            const loadingMessage = document.getElementById('loadingEntrenadoresMessage');
            
            if (openModalBtn && searchInput && loadingMessage) {
                clearInterval(checkInterval);
                
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
                        ipcRenderer.send('open-entrenador-form');
                    }
                });

                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase().trim();
                    filterEntrenadores(searchTerm);
                });

                initThemeToggleEntrenadores();
                loadEntrenadores();
            }
        }, 50);
        
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 3000);
    }

    async function loadEntrenadores() {
        const loadingMessage = document.getElementById('loadingEntrenadoresMessage');
        const noDataMessage = document.getElementById('noEntrenadoresMessage');
        const tableContainer = document.getElementById('entrenadoresTableContainer');
        const tableBody = document.getElementById('entrenadoresTableBody');
        
        if (!loadingMessage || !tableContainer || !tableBody) {
            console.error('Elementos del DOM no encontrados');
            return;
        }

        loadingMessage.classList.remove('hidden');
        tableContainer.classList.add('hidden');
        if (noDataMessage) noDataMessage.classList.add('hidden');

        try {
            const response = await axios.get('http://localhost:4001/persons?type=entrenador');
            allEntrenadores = response.data;

            loadingMessage.classList.add('hidden');

            if (allEntrenadores.length === 0) {
                if (noDataMessage) noDataMessage.classList.remove('hidden');
                tableContainer.classList.add('hidden');
            } else {
                if (noDataMessage) noDataMessage.classList.add('hidden');
                tableContainer.classList.remove('hidden');
                renderEntrenadores(allEntrenadores, tableBody);
            }
        } catch (error) {
            console.error('Error al cargar entrenadores:', error);
            loadingMessage.innerHTML = `<div class="text-red-600">Error al cargar los entrenadores: ${error.message}</div>`;
            loadingMessage.classList.remove('hidden');
            tableContainer.classList.add('hidden');
        }
    }

    function renderEntrenadores(entrenadores, tableBody) {
        tableBody.innerHTML = '';
        
        const isDark = window.themeManager ? window.themeManager.getCurrentTheme() === 'dark' : true;

        entrenadores.forEach(entrenador => {
            const row = document.createElement('tr');
            row.className = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
            
            const fullName = `${entrenador.nombre || ''} ${entrenador.apellido || ''}`.trim();
            const phone = entrenador.telefono || 'N/A';
            const email = entrenador.email || 'N/A';
            const dni = entrenador.dni || 'N/A';
            
            const textColor = isDark ? 'text-gray-300' : 'text-gray-500';
            const buttonColor = isDark ? 'text-white hover:text-orange-500' : 'text-black hover:text-gray-700';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded">
                        ${fullName}
                    </span>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button onclick="window.viewEntrenador(${entrenador.id})" 
                        class="${buttonColor} transition" title="Ver detalles">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button onclick="window.editEntrenador(${entrenador.id})" 
                        class="${buttonColor} transition" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onclick="window.deleteEntrenador(${entrenador.id}, '${fullName.replace(/'/g, "\\'")}')" 
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

    window.viewEntrenador = (id) => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:4001/persons/${id}`);
                if (ipcRenderer) {
                    ipcRenderer.send('open-person-details', response.data);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        })();
    };

    window.editEntrenador = (id) => {
        (async () => {
            try {
                const response = await axios.get(`http://localhost:4001/persons/${id}`);
                if (ipcRenderer) {
                    ipcRenderer.send('open-entrenador-form', response.data);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        })();
    };

window.deleteEntrenador = (id, name) => {
    showDeleteModal({
        personName: name,
        personType: 'entrenador',
        onConfirm: async () => {
            try {
                await axios.delete(`http://localhost:4001/persons/${id}`);
                if (window.loadEntrenadores) {
                    window.loadEntrenadores();
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    });
};    function filterEntrenadores(searchTerm) {
        const tableBody = document.getElementById('entrenadoresTableBody');
        
        if (!searchTerm) {
            renderEntrenadores(allEntrenadores, tableBody);
            return;
        }

        const filteredEntrenadores = allEntrenadores.filter(entrenador => {
            const fullName = `${entrenador.nombre || ''} ${entrenador.apellido || ''}`.toLowerCase();
            const phone = (entrenador.telefono || '').toLowerCase();
            const email = (entrenador.email || '').toLowerCase();
            const dni = (entrenador.dni || '').toLowerCase();
            
            return fullName.includes(searchTerm) || 
                   phone.includes(searchTerm) || 
                   email.includes(searchTerm) ||
                   dni.includes(searchTerm);
        });

        renderEntrenadores(filteredEntrenadores, tableBody);
    }

    if (ipcRenderer) {
        ipcRenderer.on('entrenador-saved', (event, entrenadorData) => {
            console.log('Entrenador guardado:', entrenadorData);
            loadEntrenadores();
        });
    }

    window.initEntrenadoresListeners = initEntrenadoresListeners;
    window.loadEntrenadores = loadEntrenadores;
    window.initThemeToggleEntrenadores = initThemeToggleEntrenadores;

})();
