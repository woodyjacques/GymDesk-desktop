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
        
        // Mostrar/ocultar campos según el tipo
        toggleFieldsByType(type);
    });
    
    // Aplicar tema al cargar
    setTimeout(() => {
        applyFormTheme();
    }, 100);
});

function toggleFieldsByType(type) {
    const optionalFields = document.querySelectorAll('.optional-field');
    const requiredMarks = document.querySelectorAll('.required-mark');
    const dniInput = document.getElementById('visitanteDni');
    const birthDateInput = document.getElementById('visitanteBirthDate');
    const emailInput = document.getElementById('visitanteEmail');
    
    if (type === 'visitante') {
        // Para visitantes, ocultar todos los campos opcionales
        optionalFields.forEach(field => {
            field.style.display = 'none';
        });
        
        // Remover required de los campos ocultos
        requiredMarks.forEach(mark => {
            mark.style.display = 'none';
        });
        
        dniInput.removeAttribute('required');
        birthDateInput.removeAttribute('required');
        emailInput.removeAttribute('required');
    } else if (type === 'empleado' || type === 'entrenador') {
        // Para empleados y entrenadores, mostrar campos pero ocultar domicilio, profesión, cómo nos conoció y observaciones
        optionalFields.forEach(field => {
            field.style.display = '';
        });
        
        // Restaurar required
        requiredMarks.forEach(mark => {
            mark.style.display = '';
        });
        
        dniInput.setAttribute('required', 'required');
        birthDateInput.setAttribute('required', 'required');
        emailInput.setAttribute('required', 'required');
        
        // Ocultar campos específicos para empleado/entrenador
        const domicilioField = document.getElementById('visitanteDomicilio').closest('.optional-field');
        const profesionField = document.getElementById('visitanteProfesion').closest('.optional-field');
        const comoConocioField = document.getElementById('visitanteComoConocio').closest('div').closest('.optional-field');
        const observacionesField = document.getElementById('visitanteObservaciones').closest('div').closest('.optional-field');
        
        if (domicilioField) domicilioField.style.display = 'none';
        if (profesionField) profesionField.style.display = 'none';
        if (comoConocioField) comoConocioField.style.display = 'none';
        if (observacionesField) observacionesField.style.display = 'none';
    } else {
        // Para otros tipos (cliente), mostrar todos los campos
        optionalFields.forEach(field => {
            field.style.display = '';
        });
        
        // Restaurar required
        requiredMarks.forEach(mark => {
            mark.style.display = '';
        });
        
        dniInput.setAttribute('required', 'required');
        birthDateInput.setAttribute('required', 'required');
        emailInput.setAttribute('required', 'required');
    }
}

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
        telefono: document.getElementById('visitanteCelular').value.trim(),
        type: personType
    };
    
    // Si no es visitante, agregar todos los campos
    if (personType !== 'visitante') {
        visitanteData.dni = document.getElementById('visitanteDni').value.trim();
        visitanteData.fechaNacimiento = document.getElementById('visitanteBirthDate').value;
        visitanteData.sexo = document.getElementById('visitanteSex').value || 'No especificado';
        visitanteData.pais = '+1';
        visitanteData.domicilio = document.getElementById('visitanteDomicilio').value.trim() || 'No especificado';
        visitanteData.profesion = document.getElementById('visitanteProfesion').value.trim() || 'No especificado';
        visitanteData.email = document.getElementById('visitanteEmail').value.trim();
        visitanteData.comoNosConocio = document.getElementById('visitanteComoConocio').value.trim() || null;
        visitanteData.observaciones = document.getElementById('visitanteObservaciones').value.trim() || null;
    }
    
    try {
        let response;
        
        if (isEditMode && currentVisitanteId) {
            // Actualizar persona existente
            response = await axios.put(`http://localhost:4001/persons/${currentVisitanteId}`, visitanteData);
        } else {
            // Crear nueva persona
            response = await axios.post('http://localhost:4001/persons', visitanteData);
        }
        
        // Enviar datos al proceso principal según el tipo
        ipcRenderer.send(`save-${personType}`, response.data);
        
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
    submitBtnText.textContent = 'Actualizar';
    
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
