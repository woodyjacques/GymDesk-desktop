function showMessage(msg, type = 'info') {
    showCustomMessage({
        msg,
        type,
        selector: '#main',
        id: 'registerMsg',
        duration: 4000
    });
}

// Sistema de tema claro/oscuro
function initThemeToggleRegister() {
    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        iconSun: document.getElementById('iconSun'),
        iconMoon: document.getElementById('iconMoon'),
        container: document.getElementById('registerContainer'),
        card: document.getElementById('registerCard'),
        header: document.getElementById('registerHeader'),
        title: document.getElementById('registerTitle'),
        labels: [
            document.getElementById('emailLabel'),
            document.getElementById('gymNameLabel'),
            document.getElementById('passwordLabel')
        ],
        inputs: [
            document.getElementById('email'),
            document.getElementById('gymName'),
            document.getElementById('password')
        ],
        separators: [document.getElementById('separator')],
        texts: [document.getElementById('existingUserText')],
        secondaryButtons: [document.getElementById('openLoginModal')]
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
            }
        });
    }
}

function initRegisterForm() {

    const form = document.getElementById('registerForm');
    if (!form) return;

    // Funcionalidad de mostrar/ocultar contraseña (Ya no hay botón Ver, así que se elimina)

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailEl = form.querySelector('#email');
        const gymNameEl = form.querySelector('#gymName');
        const passwordEl = form.querySelector('#password');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailEl || !gymNameEl || !passwordEl || !submitBtn) return;

        const email = emailEl.value.trim();
        const gymName = gymNameEl.value.trim();
        const password = passwordEl.value;

        if (!email || !gymName || !password) {
            showMessage('Por favor completa todos los campos.', 'error');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="loader mr-2"></span>Registrando...`;

        if (!document.getElementById('loader-style')) {
            const style = document.createElement('style');
            style.id = 'loader-style';
            style.innerHTML = `.loader { display: inline-block; width: 1em; height: 1em; border: 2px solid #fff; border-top: 2px solid #333; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        const payload = { email, gymName, password };

        try {
            const response = await axios.post(`${API_URL}/users/register`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.data && response.data.userId) {
                localStorage.setItem('pendingUserId', response.data.userId);
            }

            showMessage('Registrado correctamente. Ahora verifica tu licencia.', 'success');
            form.reset();

            setTimeout(() => {
                fetch('src/html/licenseVerification.html')
                    .then(res => {
                        if (!res.ok) throw new Error('No se pudo cargar verificación de licencia');
                        return res.text();
                    })
                    .then(html => {
                        document.getElementById('main').innerHTML = html;
                        
                        setTimeout(() => {
                            if (window.initLicenseVerificationForm) {
                                window.initLicenseVerificationForm();
                            }
                            if (window.initThemeToggleLicense) {
                                window.initThemeToggleLicense();
                            }
                        }, 100);
                    })
                    .catch(err => {
                        showMessage('Error al cargar verificación de licencia', 'error');
                    });
            }, 2000);

        } catch (err) {
            if (err.response) {
                const serverMsg = err.response.data?.message || JSON.stringify(err.response.data) || `Status ${err.response.status}`;
                showMessage(serverMsg, 'error');
            } else if (err.request) {
                showMessage('No se recibió respuesta del servidor.', 'error');
            } else {
                showMessage(err.message || 'Error desconocido', 'error');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}


window.initRegisterForm = initRegisterForm;
window.initThemeToggleRegister = initThemeToggleRegister;

