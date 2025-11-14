// Sistema de tema claro/oscuro para el dashboard
let currentLoadedUrl = null; // Variable para guardar la URL actual

function initThemeToggleDashboard() {
    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        iconSun: document.getElementById('iconSun'),
        iconMoon: document.getElementById('iconMoon'),
        sectionIcon: document.getElementById('sectionIcon'),
        container: document.getElementById('dashboardContainer'),
        topBar: document.getElementById('topBar'),
        sidebar: document.getElementById('sidebar'),
        sidebarHeader: document.getElementById('sidebarHeader'),
        sidebarNav: document.getElementById('sidebarNav'),
        sidebarFooter: document.getElementById('sidebarFooter'),
        sidebarUserCard: document.getElementById('sidebarUserCard'),
        welcomeCard: document.getElementById('welcomeCard'),
        statsTitle: document.getElementById('statsTitle'),
        statCards: [
            document.getElementById('statCard1'),
            document.getElementById('statCard2'),
            document.getElementById('statCard3'),
            document.getElementById('statCard4'),
            document.getElementById('statCard5'),
            document.getElementById('statCard6'),
            document.getElementById('statCard7'),
            document.getElementById('statCard8'),
            document.getElementById('statCard9'),
            document.getElementById('statCard10'),
            document.getElementById('statCard11'),
            document.getElementById('statCard12')
        ],
        separators: [
            document.getElementById('separator1'),
            document.getElementById('welcomeSeparator'),
            document.getElementById('stat1Separator'),
            document.getElementById('stat2Separator'),
            document.getElementById('stat3Separator'),
            document.getElementById('stat4Separator'),
            document.getElementById('modalSeparator')
        ],
        // Modal de logout
        logoutModalContainer: document.getElementById('logoutModalContainer'),
        logoutModalHeader: document.getElementById('logoutModalHeader'),
        logoutModalBody: document.getElementById('logoutModalBody'),
        logoutModalFooter: document.getElementById('logoutModalFooter'),
        cancelLogoutBtn: document.getElementById('cancelLogoutBtn'),
        // Input de búsqueda
        searchByName: document.getElementById('searchByName'),
        // Botones de acciones rápidas
        addPartnerBtn: document.getElementById('addPartnerBtn'),
        salesBtn: document.getElementById('salesBtn'),
        visitorsBtn: document.getElementById('visitorsBtn'),
        // Elementos con text-white (títulos principales y valores)
        titles: [
            document.getElementById('sidebarAppTitle'),
            document.getElementById('welcomeTitle'),
            document.getElementById('statsTitle'),
            document.getElementById('quickActionsTitle'),
            document.getElementById('currentSection'),
            document.getElementById('userEmailSidebar'),
            document.getElementById('stat7Value'),
            document.getElementById('stat9Value'),
            document.getElementById('stat11Value'),
            document.getElementById('stat12Value'),
            document.getElementById('logoutModalTitle'),
            document.getElementById('logoutModalQuestion')
        ],
        // Elementos con text-gray-300/text-gray-700 (labels y descripciones)
        labels: [
            document.getElementById('topBarUserLabel'),
            document.getElementById('welcomeGym'),
            document.getElementById('welcomeDate'),
            document.getElementById('stat1Label'),
            document.getElementById('stat2Label'),
            document.getElementById('stat3Label'),
            document.getElementById('stat4Label'),
            document.getElementById('stat5Label'),
            document.getElementById('stat6Label'),
            document.getElementById('stat7Label'),
            document.getElementById('stat8Label'),
            document.getElementById('stat9Label'),
            document.getElementById('stat10Label'),
            document.getElementById('stat11Label'),
            document.getElementById('stat12Label'),
            document.getElementById('logoutModalDescription'),
            document.getElementById('searchByNameLabel'),
            document.getElementById('emailCardLabel'),
            document.getElementById('gymCardLabel'),
            document.getElementById('roleCardLabel'),
            document.getElementById('sidebarUserLabel'),
            document.getElementById('userRoleSidebar'),
            // Botones de navegación del sidebar
            document.getElementById('sidebarHome'),
            document.getElementById('acceso-link'),
            document.getElementById('plans-link'),
            document.getElementById('visitantes-link'),
            document.getElementById('clientes-link'),
            document.getElementById('empleados-link'),
            document.getElementById('entrenadores-link'),
            document.getElementById('configuracion-link')
        ],
        cards: [
            document.getElementById('quickActionsCard'),
            document.getElementById('userInfoCard'),
            document.getElementById('emailCard'),
            document.getElementById('gymCard'),
            document.getElementById('roleCard'),
            document.getElementById('modalCard')
        ]
    };

    // Aplicar tema guardado
    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        window.themeManager.applyTheme(currentTheme, elements);
    }

    // Toggle al hacer clic
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', () => {
            if (window.themeManager) {
                window.themeManager.toggleTheme(elements);

                // Aplicar tema a planes si está cargado
                if (window.applyPlansTheme && document.getElementById('plansCard')) {
                    window.applyPlansTheme();
                }

                // Aplicar tema a visitantes si está cargado
                if (window.applyVisitantesTheme && document.getElementById('visitantesCard')) {
                    window.applyVisitantesTheme();
                }
            }
        });
    }
}

function initDashboard() {

    const token = localStorage.getItem('authToken');
    const userDataStr = localStorage.getItem('userData');

    if (!token || !userDataStr) {

        fetch('src/html/login.html')
            .then(res => res.text())
            .then(html => {
                document.getElementById('main').innerHTML = html;
                if (window.initLoginForm) {
                    window.initLoginForm();
                }
            });
        return;
    }

    const userData = JSON.parse(userDataStr);

    // Actualizar múltiples elementos de usuario
    const userEmailElements = document.querySelectorAll('#userEmail, #userEmailDetail, #userEmailSidebar, #userEmailTopBar');
    userEmailElements.forEach(el => {
        if (el) el.textContent = userData.email || 'Usuario';
    });

    const userGymElements = document.querySelectorAll('#userGym, #userGymDetail');
    userGymElements.forEach(el => {
        if (el) el.textContent = userData.gym || 'Sin gimnasio';
    });

    const userRoleElements = document.querySelectorAll('#userRole, #userRoleDetail, #userRoleSidebar');
    userRoleElements.forEach(el => {
        if (el) el.textContent = userData.role;
    });

    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        currentDateEl.textContent = now.toLocaleDateString('es-ES', options);
    }

    if (window.addListeners) {
        window.addListeners();
    }

    initNavigationLinks();
    initDashboardQuickButtons();
    initLogoutButtons();
    initThemeToggleDashboard();
    initGymLogo();

}

// Función para manejar el logo del gimnasio
function initGymLogo() {
    const changeLogoBtn = document.getElementById('changeLogo');
    const logoInput = document.getElementById('logoInput');
    const gymLogo = document.getElementById('gymLogo');
    const defaultLogoPlaceholder = document.getElementById('defaultLogoPlaceholder');

    // Cargar logo guardado si existe
    const savedLogo = localStorage.getItem('gymLogo');
    if (savedLogo && gymLogo && defaultLogoPlaceholder) {
        gymLogo.src = savedLogo;
        gymLogo.classList.remove('hidden');
        defaultLogoPlaceholder.classList.add('hidden');
    }

    // Click en el botón abre el selector de archivos
    if (changeLogoBtn && logoInput) {
        changeLogoBtn.addEventListener('click', () => {
            logoInput.click();
        });
    }

    // Cuando se selecciona una imagen
    if (logoInput && gymLogo && defaultLogoPlaceholder) {
        logoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageData = event.target.result;

                    // Guardar en localStorage
                    localStorage.setItem('gymLogo', imageData);

                    // Mostrar la imagen
                    gymLogo.src = imageData;
                    gymLogo.classList.remove('hidden');
                    defaultLogoPlaceholder.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Función separada para inicializar botones rápidos del dashboard
function initDashboardQuickButtons() {
    // Aquí puedes agregar botones rápidos en el futuro
}

// Función para actualizar la sección actual en el top bar
function updateCurrentSection(sectionName, iconSvg) {
    const currentSectionEl = document.getElementById('currentSection');
    const sectionIconContainer = document.getElementById('sectionIcon');

    if (currentSectionEl) {
        currentSectionEl.textContent = sectionName;
    }

    if (sectionIconContainer && iconSvg) {
        sectionIconContainer.innerHTML = iconSvg;
    }
}

// Función para marcar el botón activo en el sidebar
function setActiveNavButton(buttonId) {
    // Remover clase activa de todos los botones
    const allNavButtons = document.querySelectorAll('#sidebarNav button');
    allNavButtons.forEach(btn => {
        btn.classList.remove('bg-orange-500', 'text-white');
    });

    // Agregar clase activa al botón seleccionado
    const activeButton = document.getElementById(buttonId);
    if (activeButton) {
        activeButton.classList.add('bg-orange-500', 'text-white');
    }
}

function initNavigationLinks() {

    const navigationMap = {
        'sidebarHome': {
            url: null,
            name: 'Inicio',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />'
        },
        'plans-link': {
            url: 'src/html/plans.html',
            name: 'Planes',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />'
        },
        'visitantes-link': {
            url: 'src/html/visitantes.html',
            name: 'Visitantes',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />'
        },
        'clientes-link': {
            url: 'src/html/clientes.html',
            name: 'Clientes',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />'
        },
        'empleados-link': {
            url: 'src/html/empleados.html',
            name: 'Empleados',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />'
        },
        'entrenadores-link': {
            url: 'src/html/entrenadores.html',
            name: 'Entrenadores',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />'
        },
        'acceso-link': {
            url: 'src/html/acceso.html',
            name: 'Acceso',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />'
        },
        'configuracion-link': {
            url: 'src/html/configuracion.html',
            name: 'Configuración',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />'
        }
    };

    Object.keys(navigationMap).forEach(linkId => {
        const link = document.getElementById(linkId);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const config = navigationMap[linkId];

                // Marcar botón como activo
                setActiveNavButton(linkId);

                // Actualizar sección actual con ícono
                updateCurrentSection(config.name, config.icon);

                // Cargar contenido si tiene URL
                if (config.url) {
                    loadContent(config.url);
                } else if (linkId === 'sidebarHome') {
                    // Recargar dashboard completo
                    location.reload();
                }
            });
        }
    });

    // Marcar Inicio como activo por defecto
    setActiveNavButton('sidebarHome');
}

function loadContent(url) {
    currentLoadedUrl = url; // Guardar la URL actual
    fetch(url)
        .then(res => res.text())
        .then(html => {
            const content = document.getElementById('contents');
            if (content) {
                content.innerHTML = html;

                // Esperar a que el DOM se renderice antes de inicializar
                setTimeout(() => {
                    console.log('🔄 Contenido cargado:', url);
                    console.log('🔄 window.initPlansListeners disponible:', !!window.initPlansListeners);

                    // Inicializar listeners según el contenido cargado
                    if (url.includes('plans.html') && window.initPlansListeners) {
                        console.log('🎯 Inicializando listeners de planes...');
                        window.initPlansListeners();
                    } else if (url.includes('visitantes.html')) {
                        console.log('👥 Sección de visitantes cargada');
                        if (window.initVisitantesListeners) {
                            window.initVisitantesListeners();
                        }
                    } else if (url.includes('clientes.html')) {
                        console.log('🏋️ Sección de clientes cargada');
                        if (window.initClientesListeners) {
                            window.initClientesListeners();
                        }
                    } else if (url.includes('empleados.html')) {
                        console.log('💼 Sección de empleados cargada');
                        if (window.initEmpleadosListeners) {
                            window.initEmpleadosListeners();
                        }
                    } else if (url.includes('entrenadores.html')) {
                        console.log('🥇 Sección de entrenadores cargada');
                        if (window.initEntrenadoresListeners) {
                            window.initEntrenadoresListeners();
                        }
                    } else if (url.includes('acceso.html')) {
                        console.log('🔑 Sección de control de acceso cargada');
                        if (window.initAccesoListeners) {
                            window.initAccesoListeners();
                        }
                    } else if (url.includes('configuracion.html')) {
                        console.log('⚙️ Sección de configuración cargada');
                        if (window.initConfiguracionListeners) {
                            window.initConfiguracionListeners();
                        }
                    } else {
                        console.log('❌ No se encontró inicializador para:', url);
                    }
                    
                    // Aplicar tema a la sección cargada
                    applyThemeToSection();
                }, 300);
            }
        })
        .catch(error => {
            console.error('Error al cargar contenido:', error);
        });
}

function applyThemeToSection() {
    if (!window.themeManager) return;
    
    const currentTheme = window.themeManager.getCurrentTheme();
    const isDark = currentTheme === 'dark';
    
    // Aplicar tema al contenedor principal de contenido
    const contentsContainer = document.getElementById('contents');
    if (contentsContainer) {
        contentsContainer.className = isDark
            ? 'flex-1 p-6 overflow-y-auto transition-colors duration-300 bg-gray-900'
            : 'flex-1 p-6 overflow-y-auto transition-colors duration-300';
    }
    
    // Aplicar tema a cards
    const cards = [
        document.getElementById('visitantesCard'),
        document.getElementById('visitantesTableCard'),
        document.getElementById('clientesCard'),
        document.getElementById('clientesTableCard'),
        document.getElementById('empleadosCard'),
        document.getElementById('empleadosTableCard'),
        document.getElementById('entrenadoresCard'),
        document.getElementById('entrenadoresTableCard'),
        document.getElementById('accesoCard'),
        document.getElementById('configuracionCard')
    ];
    
    cards.forEach(card => {
        if (card) {
            // Para el primer card (con padding)
            if (card.id.includes('Card') && !card.id.includes('TableCard')) {
                card.className = isDark
                    ? 'bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 mb-6'
                    : 'bg-white rounded-xl shadow-md p-6 border border-gray-300 mb-6';
            } else {
                // Para el table card (sin padding extra)
                card.className = isDark
                    ? 'bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden'
                    : 'bg-white rounded-xl shadow-md border border-gray-300 overflow-hidden';
            }
        }
    });
    
    // Aplicar tema a títulos principales (h2)
    const mainTitles = [
        document.getElementById('visitantesTitle'),
        document.getElementById('clientesTitle'),
        document.getElementById('empleadosTitle'),
        document.getElementById('entrenadoresTitle'),
        document.getElementById('accesoTitle'),
        document.getElementById('configuracionTitle')
    ];
    
    mainTitles.forEach(title => {
        if (title) {
            title.className = isDark
                ? 'text-xl font-bold text-white'
                : 'text-xl font-bold text-gray-900';
        }
    });
    
    // Aplicar tema a inputs de búsqueda
    const searchInputs = [
        document.getElementById('searchVisitantesInput'),
        document.getElementById('searchClientesInput'),
        document.getElementById('searchEmpleadosInput'),
        document.getElementById('searchEntrenadoresInput'),
        document.getElementById('searchDispositivoInput')
    ];
    
    searchInputs.forEach(input => {
        if (input) {
            input.className = isDark
                ? 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-700 text-white outline-none'
                : 'w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition bg-gray-200 text-gray-900 outline-none';
        }
    });
    
    // Aplicar tema a mensajes de carga
    const loadingMessages = [
        document.getElementById('loadingVisitantesMessage'),
        document.getElementById('loadingClientesMessage'),
        document.getElementById('loadingEmpleadosMessage'),
        document.getElementById('loadingEntrenadoresMessage')
    ];
    
    loadingMessages.forEach(msg => {
        if (msg) {
            // Preservar el estado hidden
            const isHidden = msg.classList.contains('hidden');
            msg.className = isDark
                ? 'p-8 text-center text-gray-300'
                : 'p-8 text-center text-gray-500';
            // Asegurar que esté oculto por defecto
            if (isHidden || !msg.classList.contains('hidden')) {
                msg.classList.add('hidden');
            }
        }
    });
    
    // Aplicar tema a títulos de "sin datos"
    const noDataTitles = [
        document.getElementById('noVisitantesTitle'),
        document.getElementById('noClientesTitle'),
        document.getElementById('noEmpleadosTitle'),
        document.getElementById('noEntrenadoresTitle')
    ];
    
    noDataTitles.forEach(title => {
        if (title) {
            title.className = isDark
                ? 'text-lg font-semibold text-white mb-2'
                : 'text-lg font-semibold text-gray-900 mb-2';
        }
    });
    
    // Aplicar tema a textos de "sin datos"
    const noDataTexts = [
        document.getElementById('noVisitantesText'),
        document.getElementById('noClientesText'),
        document.getElementById('noEmpleadosText'),
        document.getElementById('noEntrenadoresText')
    ];
    
    noDataTexts.forEach(text => {
        if (text) {
            text.className = isDark
                ? 'text-gray-300'
                : 'text-gray-600';
        }
    });
    
    // Aplicar tema a headers de tabla
    const tableHeads = [
        document.getElementById('visitantesTableHead'),
        document.getElementById('clientesTableHead'),
        document.getElementById('empleadosTableHead'),
        document.getElementById('entrenadoresTableHead')
    ];
    
    tableHeads.forEach(thead => {
        if (thead) {
            thead.className = isDark
                ? 'bg-gray-700'
                : 'bg-gray-50';
        }
    });
    
    // Aplicar tema a headers de columnas
    const tableHeaders = document.querySelectorAll('.table-header');
    tableHeaders.forEach(header => {
        header.className = isDark
            ? 'table-header px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'
            : 'table-header px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
    });
    
    // Aplicar tema a body de tabla
    const tableBodies = [
        document.getElementById('visitantesTableBody'),
        document.getElementById('clientesTableBody'),
        document.getElementById('empleadosTableBody'),
        document.getElementById('entrenadoresTableBody')
    ];
    
    tableBodies.forEach(tbody => {
        if (tbody) {
            tbody.className = isDark
                ? 'bg-gray-800 divide-y divide-gray-700'
                : 'bg-white divide-y divide-gray-200';
        }
    });
}

function initLogoutButtons() {
    // Botón principal del sidebar
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            showLogoutModal();
        });
    }

    // Botón de la barra superior
    const logoutButtonTop = document.getElementById('logoutButtonTop');
    if (logoutButtonTop) {
        logoutButtonTop.addEventListener('click', () => {
            showLogoutModal();
        });
    }
}

function showLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (!modal) return;

    modal.classList.remove('hidden');

    // Botón de cancelar
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }

    // Botón de confirmar
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    if (confirmBtn) {
        confirmBtn.onclick = () => {
            modal.classList.add('hidden');
            performLogout();
        };
    }

    // Cerrar modal al hacer click fuera
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    };
}

function performLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.reload();
}

window.initDashboard = initDashboard;
window.initDashboardQuickButtons = initDashboardQuickButtons;
window.initThemeToggleDashboard = initThemeToggleDashboard;


window.showLogoutModal = showLogoutModal;
window.performLogout = performLogout;
