function showDeleteModal({ personName, personType, onConfirm }) {
    // Obtener tema actual
    const isDark = window.themeManager ? window.themeManager.getCurrentTheme() === 'dark' : true;
    
    // Crear modal si no existe
    let modal = document.getElementById('deletePersonModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'deletePersonModal';
        document.body.appendChild(modal);
    }

    // Aplicar clases según el tema
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-300';
    const headerBg = isDark ? 'bg-gray-900' : 'bg-gray-100';
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
    const btnCancel = isDark ? 'bg-gray-700 hover:bg-gray-600 border-gray-600' : 'bg-gray-200 hover:bg-gray-300 border-gray-400';
    const btnCancelText = isDark ? 'text-white' : 'text-gray-900';
    
    modal.className = 'hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="${bgColor} border-2 ${borderColor} max-w-md w-full mx-4 rounded-lg shadow-xl">
            <!-- Barra de título -->
            <div class="${headerBg} px-4 py-3 flex items-center justify-between border-b-2 ${borderColor} rounded-t-lg">
                <div class="flex items-center space-x-2">
                    <div class="bg-orange-500 p-1 rounded">
                        <svg class="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <span class="${textColor} font-bold text-sm">Confirmar Eliminación</span>
                </div>
            </div>
            <!-- Contenido -->
            <div class="p-4 ${bgColor}">
                <div class="flex items-start space-x-3 mb-4">
                    <div class="bg-orange-500 p-2 flex-shrink-0 rounded">
                        <svg class="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div class="flex-1 pt-1">
                        <p id="deleteModalQuestion" class="text-sm font-bold ${textColor} mb-2">¿Estás seguro de eliminar al ${personType} "${personName}"?</p>
                        <p id="deleteModalDescription" class="text-xs ${textSecondary}">Esta acción no se puede deshacer.</p>
                    </div>
                </div>
                <div class="border-t ${borderColor} pt-3 flex justify-end gap-2">
                    <button id="confirmDeleteBtn"
                        class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded text-sm transition-colors">
                        Sí
                    </button>
                    <button id="cancelDeleteBtn"
                        class="${btnCancel} ${btnCancelText} font-bold py-2 px-6 rounded text-sm transition-colors border">
                        No
                    </button>
                </div>
            </div>
        </div>
    `;

    // Mostrar modal
    modal.classList.remove('hidden');

    // Configurar botones
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');

    const handleConfirm = () => {
        modal.classList.add('hidden');
        if (onConfirm) onConfirm();
        cleanup();
    };

    const handleCancel = () => {
        modal.classList.add('hidden');
        cleanup();
    };

    const handleClickOutside = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            cleanup();
        }
    };

    const cleanup = () => {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
        modal.removeEventListener('click', handleClickOutside);
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    modal.addEventListener('click', handleClickOutside);
}

window.showDeleteModal = showDeleteModal;
