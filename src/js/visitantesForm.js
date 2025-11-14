const { ipcRenderer } = require('electron');

let isEditMode = false;
let currentVisitanteId = null;
let personType = 'visitante'; // Por defecto visitante
let personTypeName = 'Visitante'; // Para mostrar en el título

// Aplicar tema al formulario
function applyFormTheme() {
    const elements = {
        container: document.body,
        card: document.getElementById('formCard'),
        title: document.getElementById('formTitleText'),
        labels: document.querySelectorAll('label'),
        inputs: [
            document.getElementById('visitanteName'),
            document.getElementById('visitanteLastName'),
            document.getElementById('visitanteDni'),
            document.getElementById('visitanteBirthDate'),
            document.getElementById('visitanteEmail'),
            document.getElementById('visitanteCelular'),
            document.getElementById('visitanteSex'),
            document.getElementById('visitanteDomicilio'),
            document.getElementById('visitanteProfesion'),
            document.getElementById('visitanteComoConocio'),
            document.getElementById('visitanteObservaciones')
        ],
        separators: document.querySelectorAll('.border-t')
    };

    if (window.themeManager) {
        const currentTheme = window.themeManager.getCurrentTheme();
        window.themeManager.applyTheme(currentTheme, elements);
    }
}

// Inicializar formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('visitanteForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const dateInput = document.getElementById('visitanteBirthDate');
    
    // Manejar envío del formulario
    form.addEventListener('submit', handleSubmit);
    
    // Manejar cancelación
    cancelBtn.addEventListener('click', () => {
        ipcRenderer.send('close-visitante-form');
    });
    
    // Escuchar datos para edición
    ipcRenderer.on('load-visitante-data', (event, visitanteData) => {
        loadVisitanteData(visitanteData);
    });
    
    // Escuchar tipo de persona al abrir el formulario
    ipcRenderer.on('set-person-type', (event, type) => {
        personType = type;
        
        // Mapear tipo a nombre para mostrar
        const typeNames = {
            'visitante': 'Visitante',
            'cliente': 'Cliente',
            'empleado': 'Empleado',
            'entrenador': 'Entrenador'
        };
        
        personTypeName = typeNames[type] || 'Visitante';
        
        // Actualizar título del formulario
        const formTitle = document.getElementById('formTitleText');
        formTitle.textContent = `Nuevo ${personTypeName}`;
        
        // Actualizar título de la ventana
        document.title = `Nuevo ${personTypeName}`;
    });
    
    // Aplicar tema al cargar
    setTimeout(() => {
        applyFormTheme();
    }, 100);
});

async function handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitVisitanteBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const originalText = submitBtnText.textContent;
    
    // Deshabilitar botón mientras se procesa
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Guardando...';
    
    const visitanteData = {
        nombre: document.getElementById('visitanteName').value.trim(),
        apellido: document.getElementById('visitanteLastName').value.trim(),
        dni: document.getElementById('visitanteDni').value.trim(),
        fechaNacimiento: document.getElementById('visitanteBirthDate').value,
        sexo: document.getElementById('visitanteSex').value || 'No especificado',
        pais: '+549',
        telefono: document.getElementById('visitanteCelular').value.trim(),
        domicilio: document.getElementById('visitanteDomicilio').value.trim() || 'No especificado',
        profesion: document.getElementById('visitanteProfesion').value.trim() || 'No especificado',
        email: document.getElementById('visitanteEmail').value.trim(),
        comoNosConocio: document.getElementById('visitanteComoConocio').value.trim() || null,
        observaciones: document.getElementById('visitanteObservaciones').value.trim() || null,
        type: personType // Usar el tipo dinámico
    };
    
    try {
        if (isEditMode && currentVisitanteId) {
            // Actualizar visitante existente
            await axios.put(`http://localhost:4001/persons/${currentVisitanteId}`, visitanteData);
        } else {
            // Crear nuevo visitante
            await axios.post('http://localhost:4001/persons', visitanteData);
        }
        
        // Notificar a la ventana principal según el tipo
        ipcRenderer.send(`save-${personType}`);
        
        // Cerrar ventana
        ipcRenderer.send('close-visitante-form');
        
    } catch (error) {
        console.error('Error al guardar visitante:', error);
        alert('Error al guardar el visitante: ' + (error.response?.data?.message || error.message));
        
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtnText.textContent = originalText;
    }
}

function loadVisitanteData(visitante) {
    isEditMode = true;
    currentVisitanteId = visitante.id;
    
    // Cambiar título
    const formTitle = document.getElementById('formTitleText');
    const submitBtnText = document.getElementById('submitBtnText');
    
    formTitle.textContent = `Editar ${personTypeName}`;
    submitBtnText.textContent = `Actualizar ${personTypeName}`;
    
    // Cargar datos en el formulario
    document.getElementById('visitanteName').value = visitante.nombre || '';
    document.getElementById('visitanteLastName').value = visitante.apellido || '';
    document.getElementById('visitanteDni').value = visitante.dni || '';
    document.getElementById('visitanteBirthDate').value = visitante.fechaNacimiento || '';
    document.getElementById('visitanteSex').value = visitante.sexo || '';
    document.getElementById('visitanteCelular').value = visitante.telefono || '';
    document.getElementById('visitanteDomicilio').value = visitante.domicilio || '';
    document.getElementById('visitanteProfesion').value = visitante.profesion || '';
    document.getElementById('visitanteEmail').value = visitante.email || '';
    document.getElementById('visitanteComoConocio').value = visitante.comoNosConocio || '';
    document.getElementById('visitanteObservaciones').value = visitante.observaciones || '';
}
