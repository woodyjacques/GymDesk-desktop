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
            // Botones de navegación del sidebar (solo los activos)
            document.getElementById('sidebarHome'),
            document.getElementById('plans-link')
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
                    } else {
                        console.log('❌ No se encontró inicializador para:', url);
                        console.log('❌ Funciones disponibles:', {
                            initPlansListeners: !!window.initPlansListeners,
                            initVisitantesListeners: !!window.initVisitantesListeners
                        });
                    }
                }, 300);
            }
        })
        .catch(error => {
            console.error('Error al cargar contenido:', error);
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
