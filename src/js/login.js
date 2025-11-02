function showMessage(msg, type = 'info') {
    showCustomMessage({
        msg,
        type,
        selector: '#main',
        id: 'loginMsg',
        duration: 4000
    });
}

function initLoginForm() {

    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const emailEl = form.querySelector('#email');
        const passwordEl = form.querySelector('#password');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!emailEl || !passwordEl || !submitBtn) return;

        const email = emailEl.value.trim();
        const password = passwordEl.value;

        if (!email || !password) {
            showMessage('Por favor completa el correo electrónico y la contraseña.', 'error');
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="loader mr-2"></span>Iniciando sesión...`;

        if (!document.getElementById('loader-style')) {
            const style = document.createElement('style');
            style.id = 'loader-style';
            style.innerHTML = `.loader { display: inline-block; width: 1em; height: 1em; border: 2px solid #fff; border-top: 2px solid #333; border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; } @keyframes spin { 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }

        const payload = { email, password };

        try {

            const response = await axios.post(`${API_URL}/users/login`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            showMessage('Inicio de sesión exitoso.', 'success');
            form.reset();

            if (response.data?.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            
            if (response.data?.user) {
                localStorage.setItem('userData', JSON.stringify(response.data.user));
            }

            setTimeout(() => {
                fetch('src/html/dashboard.html')
                    .then(res => {
                        if (!res.ok) throw new Error('No se pudo cargar el panel');
                        return res.text();
                    })
                    .then(html => {
                        document.getElementById('main').innerHTML = html;
                        if (window.initDashboard) {
                            window.initDashboard();
                        }
                    })
                    .catch(err => {
                        showMessage('Error al cargar el panel', 'error');
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

window.initLoginForm = initLoginForm;
