const { ipcRenderer } = require('electron');
const axios = require('axios');
const API_URL = 'http://localhost:4001';

let selectedPhotoFile = null;
let currentInstructorId = null;

// Referencias DOM
const form = document.getElementById('instructorForm');
const photoContainer = document.getElementById('photoContainer');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const instructorIdInput = document.getElementById('instructorId');

// Click en contenedor de foto para seleccionar archivo
photoContainer.addEventListener('click', () => {
    photoInput.click();
});

// Preview de foto seleccionada
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedPhotoFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.classList.remove('hidden');
            photoPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Cancelar
cancelBtn.addEventListener('click', () => {
    ipcRenderer.send('close-instructor-form');
});

// Submit del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Guardando...</span>';

    try {
        const formData = new FormData(form);
        
        // IMPORTANTE: Siempre eliminar el campo 'id' del FormData
        // El ID va en la URL, no en el body
        formData.delete('id');
        
        // Añadir foto si fue seleccionada
        if (selectedPhotoFile) {
            formData.append('photo', selectedPhotoFile);
        }

        let response;
        if (currentInstructorId) {
            // Actualizar
            response = await axios.patch(`${API_URL}/instructors/${currentInstructorId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            // Crear
            response = await axios.post(`${API_URL}/instructors`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }

        console.log('Instructor guardado:', response.data);
        
        // Notificar al main process
        ipcRenderer.send('instructor-saved');
        
        // Cerrar ventana
        ipcRenderer.send('close-instructor-form');

    } catch (error) {
        console.error('Error al guardar instructor:', error);
        alert('Error al guardar instructor: ' + (error.response?.data?.message || error.message));
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><span>GUARDAR</span>';
    }
});

// Cargar datos de instructor si se están editando
ipcRenderer.on('load-instructor-data', async (event, instructorData) => {
    try {
        currentInstructorId = instructorData.id;
        instructorIdInput.value = instructorData.id;
        formTitle.textContent = 'Editar Instructor';

        // Cargar datos en el formulario
        Object.keys(instructorData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && instructorData[key]) {
                input.value = instructorData[key];
            }
        });

        // Cargar foto si existe
        if (instructorData.photoPath) {
            photoPreview.src = `${API_URL}/${instructorData.photoPath}`;
            photoPreview.classList.remove('hidden');
            photoPlaceholder.classList.add('hidden');
        }

    } catch (error) {
        console.error('Error al cargar datos del instructor:', error);
    }
});
