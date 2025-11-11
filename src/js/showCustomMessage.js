
function showCustomMessage({ msg, type = 'info', selector = null, id = null, duration = 4000 }) {

    let container = selector ? document.querySelector(selector) : document.body;
    if (!container) {
        console.error('Container not found:', selector);
        return;
    }
    
    let msgDiv = id ? document.getElementById(id) : null;
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        if (id) msgDiv.id = id;
        msgDiv.style.position = 'relative';
        msgDiv.style.zIndex = '1000';
        msgDiv.style.opacity = '0';
        msgDiv.style.transform = 'translateY(-10px)';
        msgDiv.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';

        container.insertBefore(msgDiv, container.firstChild);
    }
    
    // Colores elegantes y acordes al diseño del tema
    if (type === 'error') {
        msgDiv.style.color = '#ffffff';
        msgDiv.style.background = '#dc2626'; // Rojo vibrante pero profesional
    } else if (type === 'success') {
        msgDiv.style.color = '#ffffff';
        msgDiv.style.background = '#059669'; // Verde esmeralda profesional
    } else {
        msgDiv.style.color = '#ffffff';
        msgDiv.style.background = '#f97316'; // Naranja del tema
    }
    
    msgDiv.textContent = msg;
    msgDiv.style.border = 'none';
    msgDiv.style.padding = '0.875rem 1.25rem';
    msgDiv.style.borderRadius = '0';
    msgDiv.style.fontWeight = '600';
    msgDiv.style.textAlign = 'center';
    msgDiv.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    msgDiv.style.fontSize = '1rem';

    // Activar la animación
    setTimeout(() => {
        msgDiv.style.opacity = '1';
        msgDiv.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        if (msgDiv && msgDiv.parentNode) {
            msgDiv.style.opacity = '0';
            msgDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (msgDiv && msgDiv.parentNode) {
                    msgDiv.parentNode.removeChild(msgDiv);
                }
            }, 300);
        }
    }, duration);
}

window.showCustomMessage = showCustomMessage;

