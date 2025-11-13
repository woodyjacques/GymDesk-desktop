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
}

window.initThemeToggleVisitantes = initThemeToggleVisitantes;
