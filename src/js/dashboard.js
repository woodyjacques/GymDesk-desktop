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

    const userEmailElements = document.querySelectorAll('#userEmail, #userEmailDetail, #userEmailSidebar');
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

    initSidebarControls();
    initNavigationLinks();
    initNavigationListeners();
    initDashboardQuickButtons();

}

// Función separada para inicializar botones rápidos del dashboard
function initDashboardQuickButtons() {
    // Botón rápido en el dashboard para abrir el formulario de Nuevo socio (modal via main)
    const openNewPartnerQuickBtn = document.getElementById('openNewPartnerQuickBtn');
    if (openNewPartnerQuickBtn) {
        try {
            const { ipcRenderer } = require('electron');
            openNewPartnerQuickBtn.addEventListener('click', (e) => {
                e.preventDefault();
                ipcRenderer.send('open-partner-form');
            });
        } catch (err) {
            // fallback: cargar en contents si no hay electron (ej. tests en navegador)
            openNewPartnerQuickBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loadContent('src/html/partnerForm.html');
            });
        }
    }
}

function initNavigationLinks() {

    const navigationMap = {
        'partners-link': 'src/html/partners.html',
        'activities-link': 'src/html/activities.html',
        'instructors-link': 'src/html/instructors.html',
        'cash-register-link': 'src/html/cashRegister.html'
    };

    Object.keys(navigationMap).forEach(linkId => {
        const link = document.getElementById(linkId);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadContent(navigationMap[linkId]);
            });
        }
    });
}

function loadContent(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            const content = document.getElementById('contents');
            if (content) {
                content.innerHTML = html;
                
                // Inicializar listeners según el contenido cargado
                if (url.includes('activities.html') && window.initActivitiesListeners) {
                    window.initActivitiesListeners();
                }
                if (url.includes('partners.html') && window.initPartnersListeners) {
                    window.initPartnersListeners();
                }
                if (url.includes('partnerForm.html') && window.initPartnerForm) {
                    window.initPartnerForm();
                }
                if (url.includes('instructors.html') && window.initInstructorsListeners) {
                    window.initInstructorsListeners();
                }
                if (url.includes('cashRegister.html')) {
                    // Cargar el script de cashRegister si no está cargado
                    if (!window.initCashRegister) {
                        const script = document.createElement('script');
                        script.src = 'src/js/cashRegister.js';
                        script.onload = () => {
                            if (window.initCashRegister) {
                                window.initCashRegister();
                            }
                        };
                        document.head.appendChild(script);
                    } else {
                        window.initCashRegister();
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar contenido:', error);
        });
}

function initSidebarControls() {
    const sidebar = document.getElementById('sidebar');
    const mainContainer = document.querySelector('.main-container');
    const toggleSidebar = document.getElementById('toggleSidebar');
    const toggleSidebarMobile = document.getElementById('toggleSidebarMobile');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const sidebarUserInfo = document.getElementById('sidebarUserInfo');
    const logoutButton = document.getElementById('logoutButton');
    
    let sidebarCollapsed = false;

    const toggleSidebarFunc = () => {
        sidebarCollapsed = !sidebarCollapsed;
        
        if (sidebarCollapsed) {
            sidebar.classList.remove('w-64');
            sidebar.classList.add('w-20');
            
            if (mainContainer) {
                mainContainer.classList.add('sidebar-collapsed');
            }
            
            const textElements = sidebar.querySelectorAll('.sidebar-text');
            textElements.forEach(el => {
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
            });
            
            if (sidebarUserInfo) {
                sidebarUserInfo.classList.add('hidden');
            }

        } else {
            sidebar.classList.remove('w-20');
            sidebar.classList.add('w-64');
            
            if (mainContainer) {
                mainContainer.classList.remove('sidebar-collapsed');
            }
            
            const textElements = sidebar.querySelectorAll('.sidebar-text');
            textElements.forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            });
            
            if (sidebarUserInfo) {
                sidebarUserInfo.classList.remove('hidden');
            }
        }
    };

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', toggleSidebarFunc);
    }

    if (toggleSidebarMobile) {
        toggleSidebarMobile.addEventListener('click', toggleSidebarFunc);
    }

    const groupToggles = document.querySelectorAll('.group-toggle');
    
    groupToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (sidebarCollapsed) {
                toggleSidebarFunc();
  
                setTimeout(() => {
                    toggleGroup(toggle);
                }, 100);
            } else {
                toggleGroup(toggle);
            }
        });
    });
    
    function toggleGroup(toggle) {
        const menuGroup = toggle.closest('.menu-group');
        if (!menuGroup) return;
        
        const groupItems = menuGroup.querySelector('.group-items');
        if (!groupItems) return;
        
        const chevron = toggle.querySelector('svg:last-child');
        const isCurrentlyOpen = !groupItems.classList.contains('hidden');
        
        document.querySelectorAll('.group-items').forEach(items => {
            items.classList.add('hidden');
        });
        
        document.querySelectorAll('.group-toggle svg:last-child').forEach(svg => {
            svg.style.transform = 'rotate(0deg)';
        });
        
        if (!isCurrentlyOpen) {
            groupItems.classList.remove('hidden');
            if (chevron) {
                chevron.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.reload();
        });
    }
}

function updatePageTitle(title, iconPath) {
    const pageTitle = document.getElementById('pageTitle');
    const pageIcon = document.getElementById('pageIcon');
    const sidebarIcon = document.getElementById('sidebarIcon');
    
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    
    if (pageIcon && iconPath) {
        pageIcon.innerHTML = iconPath;
    }
    
    if (sidebarIcon && iconPath) {
        sidebarIcon.innerHTML = iconPath;
    }
}

function initNavigationListeners() {
    // Guardar el contenido original del dashboard
    const originalDashboardContent = document.getElementById('contents').innerHTML;
    
    // Mapeo de títulos y sus íconos correspondientes
    const navigationData = {
        'partners-link': {
            title: 'Socios',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />'
        },
        'activities-link': {
            title: 'Actividades',
            icon: '<rect x="2" y="9" width="2" height="6" rx="1" stroke-width="2"/><rect x="5" y="8" width="2" height="8" rx="1" stroke-width="2"/><rect x="8" y="10" width="8" height="4" rx="0.5" stroke-width="2"/><rect x="17" y="8" width="2" height="8" rx="1" stroke-width="2"/><rect x="20" y="9" width="2" height="6" rx="1" stroke-width="2"/>'
        },
        'instructors-link': {
            title: 'Instructores',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />'
        },
        'cash-register-link': {
            title: 'Caja Registradora',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />'
        }
    };

    // Ícono de inicio (home)
    const homeIcon = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />';

    Object.keys(navigationData).forEach(linkId => {
        const link = document.getElementById(linkId);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const data = navigationData[linkId];
                updatePageTitle(data.title, data.icon);
            });
        }
    });

    const sidebarTitle = document.getElementById('sidebarTitle');
    if (sidebarTitle) {
        sidebarTitle.addEventListener('click', () => {
            updatePageTitle('Inicio', homeIcon);
            // Restaurar el contenido original del dashboard
            const contents = document.getElementById('contents');
            if (contents) {
                contents.innerHTML = originalDashboardContent;
                // Reinicializar las funciones necesarias para el dashboard
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
                // Reinicializar botones rápidos del dashboard
                if (window.initDashboardQuickButtons) {
                    window.initDashboardQuickButtons();
                }
            }
        });
    }
}

window.initDashboard = initDashboard;
window.initNavigationListeners = initNavigationListeners;
window.initDashboardQuickButtons = initDashboardQuickButtons;

// --- Partners / Nuevo socio handlers ---
function initPartnersListeners() {
    const btn = document.getElementById('openNewPartnerBtn');
    if (btn) {
        try {
            const { ipcRenderer } = require('electron');
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ipcRenderer.send('open-partner-form');
            });
        } catch (err) {
            // fallback: cargar en el contenido de la página
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                fetch('src/html/partnerForm.html')
                    .then(res => res.text())
                    .then(html => {
                        const content = document.getElementById('contents');
                        if (content) {
                            content.innerHTML = html;
                            if (window.initPartnerForm) window.initPartnerForm();
                        }
                    })
                    .catch(err => console.error('Error cargando formulario:', err));
            });
        }
    }

    // Inicializar el listener del botón "Listado de socios"
    if (window.initPartnersListModal) {
        window.initPartnersListModal();
    }
}

function initPartnerForm() {
    const form = document.getElementById('partnerForm');
    if (!form) return;

    const nextBtn = document.getElementById('partnerFormNextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = {};
            formData.forEach((v, k) => data[k] = v);
            console.log('Partner form submitted:', data);
            // Aquí se puede enviar la data al backend; por ahora mostramos alerta demo
            alert('Formulario listo. Revisa la consola para los datos (demo).');
        });
    }

    // Placeholder: boton de foto (demo)
    const photoBtn = document.getElementById('photoBtn');
    if (photoBtn) {
        photoBtn.addEventListener('click', () => {
            alert('Seleccionar foto (demo)');
        });
    }
}

window.initPartnersListeners = initPartnersListeners;
window.initPartnerForm = initPartnerForm;
