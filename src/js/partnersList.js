const { ipcRenderer } = require('electron');
const axios = require('axios');
const API_URL = 'http://localhost:4001';

const loadingMessage = document.getElementById('loadingMessage');
const emptyMessage = document.getElementById('emptyMessage');
const partnersContainer = document.getElementById('partnersContainer');

// Cargar lista de socios al abrir la ventana
async function loadPartners() {
    try {
        loadingMessage.classList.remove('hidden');
        emptyMessage.classList.add('hidden');
        partnersContainer.classList.add('hidden');

        const response = await axios.get(`${API_URL}/partners`);
        const partners = response.data;

        if (partners.length === 0) {
            loadingMessage.classList.add('hidden');
            emptyMessage.classList.remove('hidden');
            return;
        }

        renderPartners(partners);

    } catch (error) {
        console.error('Error al cargar socios:', error);
        loadingMessage.classList.add('hidden');
        emptyMessage.classList.remove('hidden');
        emptyMessage.querySelector('h3').textContent = 'Error al cargar socios';
        emptyMessage.querySelector('p').textContent = error.message;
    }
}

function renderPartners(partners) {
    loadingMessage.classList.add('hidden');
    partnersContainer.classList.remove('hidden');
    partnersContainer.innerHTML = '';

    partners.forEach(partner => {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition';
        
        // URL de la foto
        const photoUrl = partner.photoPath 
            ? `${API_URL}/${partner.photoPath}` 
            : null;
        
        // Formatear teléfono
        const phone = partner.phone ? `+${partner.countryCode || '1'} ${partner.phone}` : '-';

        card.innerHTML = `
            <div class="flex items-center space-x-3 mb-3">
                ${photoUrl ? `
                    <img src="${photoUrl}" alt="${partner.firstName}" 
                        class="w-16 h-16 rounded-full object-cover border-2 border-gray-300 shadow-sm" 
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300" style="display:none;">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                ` : `
                    <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                `}
                <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-900">${partner.firstName} ${partner.lastName}</h3>
                    <p class="text-sm text-gray-600">DNI: ${partner.dni}</p>
                    <p class="text-xs text-gray-500 mt-1">📞 ${phone}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
                <button onclick="viewPartner(${partner.id})" 
                    class="px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                </button>
                <button onclick="editPartner(${partner.id})" 
                    class="px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                </button>
                <button onclick="deletePartner(${partner.id}, '${partner.firstName} ${partner.lastName}')" 
                    class="px-3 py-2 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                </button>
            </div>
        `;

        partnersContainer.appendChild(card);
    });
}

// Editar socio
window.editPartner = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/partners/${id}`);
        ipcRenderer.send('open-partner-form', response.data);
        ipcRenderer.send('close-partners-list');
    } catch (error) {
        console.error('Error al cargar socio:', error);
        alert('Error al cargar socio');
    }
};

// Ver detalles completos del socio
window.viewPartner = async (id) => {
    try {
        // Obtener datos del socio
        const partnerResponse = await axios.get(`${API_URL}/partners/${id}`);
        const partner = partnerResponse.data;
        
        // Obtener membresías del socio
        const membershipsResponse = await axios.get(`${API_URL}/membership`);
        const partnerMemberships = membershipsResponse.data.filter(m => m.partnerId === id);
        
        showPartnerDetailsModal(partner, partnerMemberships);
    } catch (error) {
        console.error('Error al cargar detalles del socio:', error);
        alert('Error al cargar detalles del socio');
    }
};

// Mostrar modal con detalles completos
function showPartnerDetailsModal(partner, memberships) {
    // Crear el modal
    const modal = document.createElement('div');
    modal.id = 'partnerDetailsModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    
    // Formatear datos
    const genderText = partner.gender === 'M' ? 'Masculino' : partner.gender === 'F' ? 'Femenino' : partner.gender === 'O' ? 'Otro' : '-';
    const birthdate = partner.birthdate ? new Date(partner.birthdate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
    const phone = partner.phone ? `+${partner.countryCode || '1'} ${partner.phone}` : '-';
    const photoUrl = partner.photoPath ? `${API_URL}/${partner.photoPath}` : null;
    
    // Obtener fecha actual
    const today = new Date().toISOString().split('T')[0];
    
    // Crear HTML de membresías
    let membershipsHTML = '';
    if (memberships.length > 0) {
        memberships.forEach(membership => {
            const isActive = membership.expirationDate >= today;
            const statusClass = isActive ? 'bg-black text-white' : 'bg-gray-300 text-gray-800';
            const statusText = isActive ? 'ACTIVA' : 'VENCIDA';
            const expirationDate = new Date(membership.expirationDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            
            membershipsHTML += `
                <div class="border-l-4 ${isActive ? 'border-black' : 'border-gray-400'} pl-4 py-2 mb-3 bg-gray-50 rounded">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold text-gray-900">${membership.activity?.name || 'Actividad'}</h4>
                        <span class="px-2 py-1 text-xs font-bold rounded ${statusClass}">${statusText}</span>
                    </div>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p>📅 Vence: ${expirationDate}</p>
                        ${membership.instructor ? `<p>👨‍🏫 Instructor: ${membership.instructor.firstName} ${membership.instructor.lastName}</p>` : ''}
                        ${membership.payment ? `<p>💰 Pago: $${parseFloat(membership.payment.amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${membership.payment.paymentMethod ? ` - ${membership.payment.paymentMethod.charAt(0).toUpperCase() + membership.payment.paymentMethod.slice(1)}` : ''}</p>` : ''}
                    </div>
                </div>
            `;
        });
    } else {
        membershipsHTML = '<p class="text-gray-500 text-center py-4">No tiene membresías registradas</p>';
    }
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h2 class="text-xl font-bold">Detalles del Socio</h2>
                <button onclick="closePartnerDetailsModal()" class="text-white hover:text-gray-300 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <!-- Content -->
            <div class="p-6">
                <!-- Foto y nombre -->
                <div class="flex items-center space-x-4 mb-6 pb-6 border-b">
                    ${photoUrl ? `
                        <img src="${photoUrl}" alt="${partner.firstName}" 
                            class="w-24 h-24 rounded-full object-cover border-4 border-gray-300 shadow-lg" 
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-300" style="display:none;">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    ` : `
                        <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    `}
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">${partner.firstName} ${partner.lastName}</h3>
                        <p class="text-gray-600">DNI: ${partner.dni}</p>
                    </div>
                </div>
                
                <!-- Información Personal -->
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Información Personal
                    </h3>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500 font-medium">Fecha de Nacimiento</p>
                            <p class="text-gray-900">${birthdate}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 font-medium">Sexo</p>
                            <p class="text-gray-900">${genderText}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 font-medium">Teléfono</p>
                            <p class="text-gray-900">${phone}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 font-medium">Profesión</p>
                            <p class="text-gray-900">${partner.profession || '-'}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-gray-500 font-medium">Email</p>
                            <p class="text-gray-900">${partner.email || '-'}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-gray-500 font-medium">Domicilio</p>
                            <p class="text-gray-900">${partner.address || '-'}</p>
                        </div>
                        ${partner.howKnow ? `
                        <div class="col-span-2">
                            <p class="text-gray-500 font-medium">¿Cómo nos conoció?</p>
                            <p class="text-gray-900">${partner.howKnow}</p>
                        </div>
                        ` : ''}
                        ${partner.observations ? `
                        <div class="col-span-2">
                            <p class="text-gray-500 font-medium">Observaciones</p>
                            <p class="text-gray-900">${partner.observations}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Membresías -->
                <div>
                    <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Membresías (${memberships.length})
                    </h3>
                    <div class="space-y-2">
                        ${membershipsHTML}
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t sticky bottom-0">
                <button onclick="closePartnerDetailsModal()" 
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Cerrar
                </button>
                <button onclick="closePartnerDetailsModal(); editPartner(${partner.id})" 
                    class="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition">
                    Editar Socio
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePartnerDetailsModal();
        }
    });
}

// Cerrar modal
window.closePartnerDetailsModal = function() {
    const modal = document.getElementById('partnerDetailsModal');
    if (modal) {
        modal.remove();
    }
};

window.deletePartner = async (id, name) => {
    
    if (!confirm(`¿Estás seguro de eliminar al socio ${name}?`)) {
        return;
    }

    try {
        await axios.delete(`${API_URL}/partners/${id}`);
        alert('Socio eliminado exitosamente');
        loadPartners();
    } catch (error) {

        let errorMessage = 'Error desconocido al eliminar socio';
        
        if (error.response) {

            if (error.response.data) {
                
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
            }
        } else if (error.request) {
            errorMessage = 'No se pudo conectar con el servidor';
        } else {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    }
};

// Recargar cuando se guarda un socio
ipcRenderer.on('partner-saved', () => {
    loadPartners();
});

// Cargar al iniciar
loadPartners();
