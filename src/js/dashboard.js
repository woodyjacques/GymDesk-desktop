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

}

function initNavigationLinks() {
    // Mapeo de IDs de enlaces a archivos HTML
    const navigationMap = {
        // Control
        'access-link': 'src/html/access.html',
        'attendances-link': 'src/html/attendances.html',
        'movements-link': 'src/html/movements.html',
        'properties-link': 'src/html/properties.html',
        
        // Directorio
        'members-link': 'src/html/members.html',
        'trainers-link': 'src/html/trainers.html',
        'employees-link': 'src/html/employees.html',
        'suppliers-link': 'src/html/suppliers.html',
        
        // Catálogo
        'activities-link': 'src/html/activities.html',
        'classes-link': 'src/html/classes.html',
        'products-link': 'src/html/products.html',
        
        // Operaciones
        'memberships-link': 'src/html/memberships.html',
        'reservations-link': 'src/html/reservations.html',
        'purchases-link': 'src/html/purchases.html',
        
        // Finanzas
        'payments-link': 'src/html/payments.html',
        'cashregister-link': 'src/html/cashregister.html',
        'concepts-link': 'src/html/concepts.html',
        
        // Herramientas
        'export-link': 'src/html/export.html',
        'import-link': 'src/html/import.html',
        'backup-link': 'src/html/backup.html',
        'reports-link': 'src/html/reports.html',
        
        // Configuración
        'gym-link': 'src/html/gym.html',
        'password-link': 'src/html/password.html',
        'alerts-link': 'src/html/alerts.html'
    };

    // Agregar event listeners a todos los enlaces
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
            }
        })
        .catch(error => {
            console.error('Error al cargar contenido:', error);
        });
}

function initSidebarControls() {
    const sidebar = document.getElementById('sidebar');
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
        const groupItems = menuGroup.querySelector('.group-items');
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
            chevron.style.transform = 'rotate(180deg)';
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

window.initDashboard = initDashboard;
