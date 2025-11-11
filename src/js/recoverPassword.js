function showMessage(msg, type = 'info') {
    showCustomMessage({
        msg,
        type,
        selector: '#main',
        id: 'recoverMsg',
        duration: 4000
    });
}

// Sistema de tema claro/oscuro
function initThemeToggleRecover() {
    const elements = {
        themeToggle: document.getElementById('themeToggle'),
        iconSun: document.getElementById('iconSun'),
        iconMoon: document.getElementById('iconMoon'),
        container: document.getElementById('recoverContainer'),
        card: document.getElementById('recoverCard'),
        header: document.getElementById('recoverHeader'),
        title: document.getElementById('recoverTitle'),
        labels: [document.getElementById('emailLabel')],
        inputs: [document.getElementById('email')],
        separators: [document.getElementById('separator')],
        texts: [document.getElementById('rememberText')],
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

function initRecoverPasswordForm() {

    const form = document.getElementById('recoverPasswordForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailEl = form.querySelector('#email');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailEl || !submitBtn) return;

        const email = emailEl.value.trim();

        if (!email) {
            showMessage('Por favor ingresa tu correo electrónico.', 'error');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="loader mr-2"></span>Enviando...`;

        if (!document.getElementById('loader-style')) {
            const style = document.createElement('style');
            style.id = 'loader-style';
            style.innerHTML = `.loader { display: inline-block; width: 1em; height: 1em; border: 2px solid #fff; border-top: 2px solid #333; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        const payload = { email };

        try {
            await axios.post(`${API_URL}/users/recover-password`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            showMessage('Se ha enviado un correo con instrucciones para recuperar tu contraseña.', 'success');
            form.reset();

            setTimeout(() => {
                fetch('src/html/verificationCode.html')
                    .then(res => {
                        if (!res.ok) throw new Error('No se pudo cargar el formulario');
                        return res.text();
                    })
                    .then(html => {
                        document.getElementById('main').innerHTML = html;
                        if (window.initVerificationForm) {
                            window.initVerificationForm();
                        }
                    })
                    .catch(err => {
                        showMessage('Error al cargar el formulario de verificación', 'error');
                    });
            }, 3000);

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

window.initRecoverPasswordForm = initRecoverPasswordForm;
window.initThemeToggleRecover = initThemeToggleRecover;
