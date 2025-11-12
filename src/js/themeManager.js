// Sistema global de manejo de temas (modo claro/oscuro)

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.listeners = []; // Array de listeners para cambios de tema
    }
    
    // Agregar listener para cambios de tema
    addThemeChangeListener(callback) {
        // Evitar duplicados - solo agregar si no existe ya
        if (!this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }
    }
    
    // Limpiar todos los listeners
    clearListeners() {
        this.listeners = [];
    }
    
    // Notificar a todos los listeners
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.currentTheme);
            } catch (error) {
                console.error('Error en listener de tema:', error);
            }
        });
    }

    // Aplicar tema a cualquier página
    applyTheme(theme, elements) {
        if (theme === 'dark') {
            this.applyDarkTheme(elements);
        } else {
            this.applyLightTheme(elements);
        }
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Notificar a todos los listeners del cambio de tema
        this.notifyListeners();
        
        // Aplicar clases globales al body para transiciones
        document.body.setAttribute('data-theme', theme);
    }

    applyDarkTheme(elements) {
        // Fondo general
        if (elements.container) {
            this.updateClasses(elements.container, {
                remove: ['bg-gray-200'],
                add: ['bg-gray-900']
            });
        }
        
        // Tarjeta/Card principal
        if (elements.card) {
            this.updateClasses(elements.card, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        // Cards múltiples (para dashboard)
        if (elements.cards && elements.cards.length > 0) {
            elements.cards.forEach(card => {
                if (card) {
                    this.updateClasses(card, {
                        remove: ['bg-gray-100', 'border-gray-300'],
                        add: ['bg-gray-800', 'border-gray-700']
                    });
                }
            });
        }
        
        // Stat cards (para dashboard)
        if (elements.statCards && elements.statCards.length > 0) {
            elements.statCards.forEach(card => {
                if (card) {
                    this.updateClasses(card, {
                        remove: ['bg-gray-100', 'border-gray-300'],
                        add: ['bg-gray-800', 'border-gray-700']
                    });
                }
            });
        }
        
        // Header/Cabecera y barras superiores
        if (elements.header) {
            this.updateClasses(elements.header, {
                remove: ['bg-gray-200', 'border-gray-300'],
                add: ['bg-gray-900', 'border-gray-700']
            });
        }
        
        if (elements.topBar) {
            this.updateClasses(elements.topBar, {
                remove: ['bg-gray-200', 'border-gray-300'],
                add: ['bg-gray-900', 'border-gray-700']
            });
        }
        
        // Sidebar
        if (elements.sidebar) {
            this.updateClasses(elements.sidebar, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        if (elements.sidebarHeader) {
            this.updateClasses(elements.sidebarHeader, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        if (elements.sidebarNav) {
            this.updateClasses(elements.sidebarNav, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        if (elements.sidebarFooter) {
            this.updateClasses(elements.sidebarFooter, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        if (elements.sidebarUserCard) {
            this.updateClasses(elements.sidebarUserCard, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-900', 'border-gray-600']
            });
        }
        
        // Welcome card
        if (elements.welcomeCard) {
            this.updateClasses(elements.welcomeCard, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        // Títulos principales (ahora usando el array titles)
        if (elements.titles && elements.titles.length > 0) {
            elements.titles.forEach(title => {
                if (title) {
                    this.updateClasses(title, {
                        remove: ['text-gray-900'],
                        add: ['text-white']
                    });
                }
            });
        }
        
        // Título individual (para compatibilidad con otras páginas)
        if (elements.title) {
            this.updateClasses(elements.title, {
                remove: ['text-gray-900'],
                add: ['text-white']
            });
        }
        
        if (elements.statsTitle) {
            this.updateClasses(elements.statsTitle, {
                remove: ['text-gray-900'],
                add: ['text-white']
            });
        }
        
        // Labels (texto secundario)
        if (elements.labels && elements.labels.length > 0) {
            elements.labels.forEach(label => {
                if (label) {
                    this.updateClasses(label, {
                        remove: ['text-gray-700', 'text-gray-900'],
                        add: ['text-gray-300']
                    });
                }
            });
        }
        
        // Inputs
        if (elements.inputs && elements.inputs.length > 0) {
            elements.inputs.forEach(input => {
                if (input) {
                    this.updateClasses(input, {
                        remove: ['bg-gray-200', 'border-gray-300', 'text-gray-900', 'focus:border-orange-400'],
                        add: ['bg-gray-900', 'border-gray-600', 'text-white', 'focus:border-orange-400']
                    });
                }
            });
        }
        
        // Input de búsqueda (dashboard)
        if (elements.searchByName) {
            this.updateClasses(elements.searchByName, {
                remove: ['bg-gray-100', 'border-gray-300', 'text-gray-900'],
                add: ['bg-gray-800', 'border-gray-700', 'text-white']
            });
        }
        
        // Separadores
        if (elements.separators && elements.separators.length > 0) {
            elements.separators.forEach(separator => {
                if (separator) {
                    this.updateClasses(separator, {
                        remove: ['border-gray-300'],
                        add: ['border-gray-700']
                    });
                }
            });
        }
        
        // Modal de logout - Container
        if (elements.logoutModalContainer) {
            this.updateClasses(elements.logoutModalContainer, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-800', 'border-gray-700']
            });
        }
        
        // Modal de logout - Header
        if (elements.logoutModalHeader) {
            this.updateClasses(elements.logoutModalHeader, {
                remove: ['bg-gray-100', 'border-gray-300'],
                add: ['bg-gray-900', 'border-gray-700']
            });
        }
        
        // Modal de logout - Body
        if (elements.logoutModalBody) {
            this.updateClasses(elements.logoutModalBody, {
                remove: ['bg-gray-100'],
                add: ['bg-gray-800']
            });
        }
        
        // Modal de logout - Footer
        if (elements.logoutModalFooter) {
            this.updateClasses(elements.logoutModalFooter, {
                remove: ['border-gray-300'],
                add: ['border-gray-700']
            });
        }
        
        // Botón cancelar del modal (modo oscuro)
        if (elements.cancelLogoutBtn) {
            this.updateClasses(elements.cancelLogoutBtn, {
                remove: ['bg-gray-400', 'border-gray-500', 'text-gray-900', 'hover:bg-gray-500'],
                add: ['bg-gray-700', 'border-gray-600', 'text-white', 'hover:bg-gray-600']
            });
        }
        
        // Botones de acciones rápidas (modo oscuro)
        if (elements.addPartnerBtn) {
            this.updateClasses(elements.addPartnerBtn, {
                remove: ['bg-gray-100', 'border-gray-300', 'text-gray-900'],
                add: ['bg-gray-800', 'border-gray-700', 'text-white']
            });
        }
        if (elements.salesBtn) {
            this.updateClasses(elements.salesBtn, {
                remove: ['bg-gray-100', 'border-gray-300', 'text-gray-900'],
                add: ['bg-gray-800', 'border-gray-700', 'text-white']
            });
        }
        if (elements.visitorsBtn) {
            this.updateClasses(elements.visitorsBtn, {
                remove: ['bg-gray-100', 'border-gray-300', 'text-gray-900'],
                add: ['bg-gray-800', 'border-gray-700', 'text-white']
            });
        }
        
        // Textos normales
        if (elements.texts && elements.texts.length > 0) {
            elements.texts.forEach(text => {
                if (text) {
                    this.updateClasses(text, {
                        remove: ['text-gray-700', 'text-gray-900'],
                        add: ['text-gray-300']
                    });
                }
            });
        }
        
        // Botones secundarios
        if (elements.secondaryButtons && elements.secondaryButtons.length > 0) {
            elements.secondaryButtons.forEach(btn => {
                if (btn) {
                    this.updateClasses(btn, {
                        remove: ['bg-gray-300', 'border-gray-300', 'text-gray-900', 'hover:bg-gray-400'],
                        add: ['bg-gray-700', 'border-gray-600', 'text-white', 'hover:bg-gray-600']
                    });
                }
            });
        }
        
        // Botón de toggle tema
        if (elements.themeToggle) {
            this.updateClasses(elements.themeToggle, {
                remove: ['bg-gray-100', 'border-gray-300', 'text-gray-900'],
                add: ['bg-gray-800', 'border-gray-600', 'text-white']
            });
        }
        
        // Ícono de sección actual (en topBar)
        if (elements.sectionIcon) {
            this.updateClasses(elements.sectionIcon, {
                remove: ['text-gray-700', 'text-gray-900'],
                add: ['text-white']
            });
        }
        
        // Iconos
        if (elements.iconSun) elements.iconSun.classList.remove('hidden');
        if (elements.iconMoon) elements.iconMoon.classList.add('hidden');
    }

    applyLightTheme(elements) {
        // Fondo general
        if (elements.container) {
            this.updateClasses(elements.container, {
                remove: ['bg-gray-900'],
                add: ['bg-gray-200']
            });
        }
        
        // Tarjeta/Card principal
        if (elements.card) {
            this.updateClasses(elements.card, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        // Cards múltiples (para dashboard)
        if (elements.cards && elements.cards.length > 0) {
            elements.cards.forEach(card => {
                if (card) {
                    this.updateClasses(card, {
                        remove: ['bg-gray-800', 'border-gray-700'],
                        add: ['bg-gray-100', 'border-gray-300']
                    });
                }
            });
        }
        
        // Stat cards (para dashboard)
        if (elements.statCards && elements.statCards.length > 0) {
            elements.statCards.forEach(card => {
                if (card) {
                    this.updateClasses(card, {
                        remove: ['bg-gray-800', 'border-gray-700'],
                        add: ['bg-gray-100', 'border-gray-300']
                    });
                }
            });
        }
        
        // Header/Cabecera y barras superiores
        if (elements.header) {
            this.updateClasses(elements.header, {
                remove: ['bg-gray-900', 'border-gray-700'],
                add: ['bg-gray-200', 'border-gray-300']
            });
        }
        
        if (elements.topBar) {
            this.updateClasses(elements.topBar, {
                remove: ['bg-gray-900', 'border-gray-700'],
                add: ['bg-gray-200', 'border-gray-300']
            });
        }
        
        // Sidebar
        if (elements.sidebar) {
            this.updateClasses(elements.sidebar, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        if (elements.sidebarHeader) {
            this.updateClasses(elements.sidebarHeader, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        if (elements.sidebarNav) {
            this.updateClasses(elements.sidebarNav, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        if (elements.sidebarFooter) {
            this.updateClasses(elements.sidebarFooter, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        if (elements.sidebarUserCard) {
            this.updateClasses(elements.sidebarUserCard, {
                remove: ['bg-gray-900', 'border-gray-600'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        // Welcome card
        if (elements.welcomeCard) {
            this.updateClasses(elements.welcomeCard, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        // Títulos principales (ahora usando el array titles)
        if (elements.titles && elements.titles.length > 0) {
            elements.titles.forEach(title => {
                if (title) {
                    this.updateClasses(title, {
                        remove: ['text-white'],
                        add: ['text-gray-900']
                    });
                }
            });
        }
        
        // Título individual (para compatibilidad con otras páginas)
        if (elements.title) {
            this.updateClasses(elements.title, {
                remove: ['text-white'],
                add: ['text-gray-900']
            });
        }
        
        if (elements.statsTitle) {
            this.updateClasses(elements.statsTitle, {
                remove: ['text-white'],
                add: ['text-gray-900']
            });
        }
        
        // Labels (texto secundario)
        if (elements.labels && elements.labels.length > 0) {
            elements.labels.forEach(label => {
                if (label) {
                    this.updateClasses(label, {
                        remove: ['text-gray-300', 'text-white'],
                        add: ['text-gray-700']
                    });
                }
            });
        }
        
        // Inputs
        if (elements.inputs && elements.inputs.length > 0) {
            elements.inputs.forEach(input => {
                if (input) {
                    this.updateClasses(input, {
                        remove: ['bg-gray-900', 'border-gray-600', 'text-white', 'focus:border-orange-400'],
                        add: ['bg-gray-200', 'border-gray-300', 'text-gray-900', 'focus:border-orange-400']
                    });
                }
            });
        }
        
        // Input de búsqueda (dashboard)
        if (elements.searchByName) {
            this.updateClasses(elements.searchByName, {
                remove: ['bg-gray-800', 'border-gray-700', 'text-white'],
                add: ['bg-gray-100', 'border-gray-300', 'text-gray-900']
            });
        }
        
        // Separadores
        if (elements.separators && elements.separators.length > 0) {
            elements.separators.forEach(separator => {
                if (separator) {
                    this.updateClasses(separator, {
                        remove: ['border-gray-700'],
                        add: ['border-gray-300']
                    });
                }
            });
        }
        
        // Modal de logout - Container
        if (elements.logoutModalContainer) {
            this.updateClasses(elements.logoutModalContainer, {
                remove: ['bg-gray-800', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        // Modal de logout - Header
        if (elements.logoutModalHeader) {
            this.updateClasses(elements.logoutModalHeader, {
                remove: ['bg-gray-900', 'border-gray-700'],
                add: ['bg-gray-100', 'border-gray-300']
            });
        }
        
        // Modal de logout - Body
        if (elements.logoutModalBody) {
            this.updateClasses(elements.logoutModalBody, {
                remove: ['bg-gray-800'],
                add: ['bg-gray-100']
            });
        }
        
        // Modal de logout - Footer
        if (elements.logoutModalFooter) {
            this.updateClasses(elements.logoutModalFooter, {
                remove: ['border-gray-700'],
                add: ['border-gray-300']
            });
        }
        
        // Botón cancelar del modal (modo día)
        if (elements.cancelLogoutBtn) {
            this.updateClasses(elements.cancelLogoutBtn, {
                remove: ['bg-gray-700', 'border-gray-600', 'text-white', 'hover:bg-gray-600'],
                add: ['bg-gray-400', 'border-gray-500', 'text-gray-900', 'hover:bg-gray-500']
            });
        }
        
        // Botones de acciones rápidas (modo día)
        if (elements.addPartnerBtn) {
            this.updateClasses(elements.addPartnerBtn, {
                remove: ['bg-gray-800', 'border-gray-700', 'text-white'],
                add: ['bg-gray-100', 'border-gray-300', 'text-gray-900']
            });
        }
        if (elements.salesBtn) {
            this.updateClasses(elements.salesBtn, {
                remove: ['bg-gray-800', 'border-gray-700', 'text-white'],
                add: ['bg-gray-100', 'border-gray-300', 'text-gray-900']
            });
        }
        if (elements.visitorsBtn) {
            this.updateClasses(elements.visitorsBtn, {
                remove: ['bg-gray-800', 'border-gray-700', 'text-white'],
                add: ['bg-gray-100', 'border-gray-300', 'text-gray-900']
            });
        }
        
        // Textos normales
        if (elements.texts && elements.texts.length > 0) {
            elements.texts.forEach(text => {
                if (text) {
                    this.updateClasses(text, {
                        remove: ['text-gray-300', 'text-white'],
                        add: ['text-gray-700']
                    });
                }
            });
        }
        
        // Botones secundarios
        if (elements.secondaryButtons && elements.secondaryButtons.length > 0) {
            elements.secondaryButtons.forEach(btn => {
                if (btn) {
                    this.updateClasses(btn, {
                        remove: ['bg-gray-700', 'border-gray-600', 'text-white', 'hover:bg-gray-600'],
                        add: ['bg-gray-300', 'border-gray-300', 'text-gray-900', 'hover:bg-gray-400']
                    });
                }
            });
        }
        
        // Botón de toggle tema
        if (elements.themeToggle) {
            this.updateClasses(elements.themeToggle, {
                remove: ['bg-gray-800', 'border-gray-600', 'text-white'],
                add: ['bg-gray-100', 'border-gray-300', 'text-gray-900']
            });
        }
        
        // Ícono de sección actual (en topBar)
        if (elements.sectionIcon) {
            this.updateClasses(elements.sectionIcon, {
                remove: ['text-white'],
                add: ['text-gray-900']
            });
        }
        
        // Iconos
        if (elements.iconSun) elements.iconSun.classList.add('hidden');
        if (elements.iconMoon) elements.iconMoon.classList.remove('hidden');
    }

    // Método auxiliar para actualizar clases de forma segura
    updateClasses(element, { remove = [], add = [] }) {
        if (!element) return;
        
        // Remover clases antiguas
        remove.forEach(cls => {
            if (element.classList.contains(cls)) {
                element.classList.remove(cls);
            }
        });
        
        // Agregar clases nuevas
        add.forEach(cls => {
            if (!element.classList.contains(cls)) {
                element.classList.add(cls);
            }
        });
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    toggleTheme(elements) {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme, elements);
    }
}

// Crear instancia global
const themeManager = new ThemeManager();

// Exportar para uso global
window.themeManager = themeManager;
