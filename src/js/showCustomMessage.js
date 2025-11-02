
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
        msgDiv.style.marginBottom = '1rem';
        msgDiv.style.position = 'relative';
        msgDiv.style.zIndex = '1000';

        container.insertBefore(msgDiv, container.firstChild);
    }
    
    msgDiv.textContent = msg;
    msgDiv.style.color = type === 'error' ? '#b91c1c' : (type === 'success' ? '#166534' : '#222');
    msgDiv.style.background = type === 'error' ? '#fee2e2' : (type === 'success' ? '#dcfce7' : '#f3f4f6');
    msgDiv.style.padding = '0.75rem';
    msgDiv.style.borderRadius = '0.5rem';
    msgDiv.style.fontWeight = 'bold';
    msgDiv.style.textAlign = 'center';
    msgDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';

    setTimeout(() => {
        if (msgDiv && msgDiv.parentNode) {
            msgDiv.parentNode.removeChild(msgDiv);
        }
    }, duration);
}

window.showCustomMessage = showCustomMessage;
