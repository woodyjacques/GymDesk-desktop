const { ipcRenderer } = require('electron');

// Elementos del DOM
const closeFooterBtn = document.getElementById('closeFooterBtn');
const modalTitle = document.getElementById('modalTitle');

// Escuchar datos de la persona
ipcRenderer.on('load-person-details', (event, personData) => {
    loadPersonDetails(personData);
});

// Cerrar modal
closeFooterBtn.addEventListener('click', () => {
    ipcRenderer.send('close-person-details');
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.send('close-person-details');
    }
});

function loadPersonDetails(person) {
    // Mapear tipo a nombre
    const typeNames = {
        'visitante': 'Visitante',
        'cliente': 'Cliente',
        'empleado': 'Empleado',
        'entrenador': 'Entrenador'
    };
    
    const typeName = typeNames[person.type] || 'Persona';
    modalTitle.textContent = typeName;
    
    // Mapear campos a valores
    const fieldMap = {
        'nombre': person.nombre,
        'apellido': person.apellido,
        'dni': person.dni,
        'fechaNacimiento': person.fechaNacimiento ? new Date(person.fechaNacimiento).toLocaleDateString('es-ES') : null,
        'sexo': person.sexo,
        'telefono': person.telefono,
        'email': person.email,
        'domicilio': person.domicilio,
        'profesion': person.profesion,
        'comoNosConocio': person.comoNosConocio,
        'observaciones': person.observaciones
    };
    
    // Mostrar u ocultar campos según tengan valor
    Object.keys(fieldMap).forEach(field => {
        const value = fieldMap[field];
        const fieldElement = document.querySelector(`[data-field="${field}"]`);
        const textElement = document.getElementById(`person${field.charAt(0).toUpperCase() + field.slice(1)}`);
        
        if (fieldElement) {
            if (value && String(value).trim() !== '') {
                fieldElement.style.display = '';
                if (textElement) {
                    textElement.textContent = value;
                }
            } else {
                fieldElement.style.display = 'none';
            }
        }
    });
    
    // Ocultar secciones si todos sus campos están vacíos
    hideEmptySections();
    
    // Ajustar tamaño de ventana después de cargar datos
    setTimeout(() => {
        adjustWindowHeight();
    }, 100);
}

function hideEmptySections() {
    const sections = [
        { id: 'sectionPersonal', fields: ['nombre', 'apellido', 'dni', 'fechaNacimiento', 'sexo'] },
        { id: 'sectionContacto', fields: ['telefono', 'email', 'domicilio'] },
        { id: 'sectionAdicional', fields: ['profesion', 'comoNosConocio', 'observaciones'] }
    ];
    
    // Obtener el tipo de persona desde el título
    const modalTitle = document.getElementById('modalTitle');
    const personType = modalTitle ? modalTitle.textContent.toLowerCase() : '';
    
    // Si es empleado o entrenador, ocultar domicilio
    if (personType === 'empleado' || personType === 'entrenador') {
        const domicilioField = document.querySelector('[data-field="domicilio"]');
        if (domicilioField) {
            domicilioField.style.display = 'none';
        }
    }
    
    sections.forEach(section => {
        const sectionElement = document.getElementById(section.id);
        
        // Si es empleado o entrenador, ocultar sección adicional completa
        if ((personType === 'empleado' || personType === 'entrenador') && section.id === 'sectionAdicional') {
            if (sectionElement) {
                sectionElement.style.display = 'none';
            }
            return;
        }
        
        const hasVisibleFields = section.fields.some(field => {
            const fieldElement = document.querySelector(`[data-field="${field}"]`);
            return fieldElement && fieldElement.style.display !== 'none';
        });
        
        if (sectionElement) {
            sectionElement.style.display = hasVisibleFields ? '' : 'none';
        }
    });
}

function adjustWindowHeight() {
    // Calcular altura del contenido visible
    const modalCard = document.getElementById('modalCard');
    if (modalCard) {
        const contentHeight = modalCard.scrollHeight;
        // Añadir margen adicional para la ventana
        const windowHeight = Math.min(contentHeight + 40, 600); // Máximo 600px
        
        // Notificar al proceso principal para ajustar la ventana
        ipcRenderer.send('adjust-person-details-height', windowHeight);
    }
}

// Aplicar tema al cargar
function applyModalTheme() {
    const elements = {
        container: document.body,
        card: document.getElementById('modalCard'),
        title: document.getElementById('modalTitle'),
        labels: document.querySelectorAll('label'),
        texts: document.querySelectorAll('p[id^="person"]'),
        separators: document.querySelectorAll('.border-t, .border-b')
    };

    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        window.themeManager.applyTheme(currentTheme, elements);
    }
}

setTimeout(() => {
    applyModalTheme();
}, 100);
