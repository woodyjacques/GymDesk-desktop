function showMessage(msg, type = 'info') {
    showCustomMessage({
        msg,
        type,
        selector: '#main',
        id: 'licenseMsg',
        duration: 4000
    });
}

function initLicenseVerificationForm() {
    
    const licenseForm = document.getElementById('licenseForm');
    const licenseCodeInput = document.getElementById('licenseCode');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const contactSupportBtn = document.getElementById('contactSupportBtn');

    if (licenseCodeInput) {
        licenseCodeInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }

    if (licenseForm) {
        licenseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const licenseCode = licenseCodeInput.value.trim();
            const userId = localStorage.getItem('pendingUserId');

            if (!licenseCode) {
                showMessage('Por favor, ingresa el código de licencia', 'error');
                return;
            }

            if (!userId) {
                showMessage('Error: Usuario no encontrado. Regístrate nuevamente.', 'error');
                return;
            }

            try {

                const response = await axios.post(`${API_URL}/users/verify-license`, {
                    licenseCode: licenseCode,
                    userId: parseInt(userId)
                });

                if (response.data) {
    
                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem('userData', JSON.stringify(response.data.user));
                    
                    localStorage.removeItem('pendingUserId');

                    showMessage('¡Licencia verificada exitosamente! Redirigiendo al dashboard...', 'success');

                    setTimeout(() => {
               
                        fetch('src/html/dashboard.html')
                            .then(res => {
                                if (!res.ok) throw new Error('No se pudo cargar el dashboard');
                                return res.text();
                            })
                            .then(html => {
                                document.getElementById('main').innerHTML = html;
                                if (window.initDashboard) {
                                    window.initDashboard();
                                }
                            })
                            .catch(err => {
                                console.error('Error al cargar dashboard:', err);
                                showMessage('Error al cargar el dashboard', 'error');
                            });
                    }, 2000);
                }

            } catch (error) {
                console.error('Error al verificar licencia:', error);
                const errorMessage = error.response?.data?.message || 'Error al verificar la licencia';
                showMessage(errorMessage, 'error');
            }
        });
    }

    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            localStorage.removeItem('pendingUserId');
            
            fetch('src/html/login.html')
                .then(res => {
                    if (!res.ok) throw new Error('No se pudo cargar el formulario de login');
                    return res.text();
                })
                .then(html => {
                    document.getElementById('main').innerHTML = html;

                    setTimeout(() => {
                        if (window.initLoginForm) {
                            window.initLoginForm();
                        }

                        if (window.addListeners) {
                            window.addListeners();
                        }
                    }, 100);
                })
                .catch(err => {
                    console.error('Error al cargar login:', err);
                    showMessage('Error al cargar el formulario de login', 'error');
                });
        });
    }

    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const message = "Hola, necesito ayuda para obtener mi código de licencia de GymDesk. ¿Podrían proporcionármelo?";
            
            const phoneNumber = "18297663804"; 
            
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            try {

                if (typeof window !== 'undefined' && window.require) {
                    const { shell } = window.require('electron');
                    shell.openExternal(whatsappURL);
                } else if (typeof require !== 'undefined') {
                    const { shell } = require('electron');
                    shell.openExternal(whatsappURL);
                } else {
         
                    window.open(whatsappURL, '_blank');
                }
            } catch (error) {
                console.error('Error al abrir WhatsApp:', error);
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(phoneNumber).then(() => {
                        showMessage(`Número de soporte copiado: ${phoneNumber}. Contáctanos por WhatsApp.`, 'info');
                    }).catch(() => {
                        showMessage(`Número de soporte: ${phoneNumber}. Contáctanos por WhatsApp.`, 'info');
                    });
                } else {
                    showMessage(`Número de soporte: ${phoneNumber}. Contáctanos por WhatsApp.`, 'info');
                }
            }
        });
    }
}

window.initLicenseVerificationForm = initLicenseVerificationForm;