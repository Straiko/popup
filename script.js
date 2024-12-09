let popupConfig = {};
fetch('config.json')
    .then(response => response.json())
    .then(data => {
        popupConfig = data.popups;
        initializeEventListeners(); 
    })
    .catch(error => console.error('Ошибка при загрузке конфигурации:', error));
const initializeEventListeners = () => {
    document.addEventListener('click', handleDocumentClick);
    document.querySelectorAll('.closePopup').forEach(button => 
        button.addEventListener('click', handleClosePopup)
    );
    document.querySelectorAll('.dragHandle').forEach(handle => 
        handle.addEventListener('mousedown', (e) => handleMouseDown(e, handle))
    );
};
const handleDocumentClick = (event) => {
    if (event.target.classList.contains('adviceButton')) {
        const advice = event.target.getAttribute('data-advice');
        const popupId = event.target.getAttribute('data-popup');
        const messageId = `popupMessage${popupId === 'popupPasta' ? 'Pasta' : 'Cake'}`;
        
        document.getElementById(messageId).textContent = advice;
        showPopup(popupId);
    }
};
const handleClosePopup = (event) => {
    const popup = event.target.closest('.popup');
    popup.style.display = 'none';
    
    const configKey = popup.id;
    if (popupConfig[configKey]) {
        popupConfig[configKey].visible = false;
    }
};
const handleMouseDown = (e, handle) => {
    const popup = handle.closest('.popup');
    const shiftX = e.clientX - popup.getBoundingClientRect().left;
    const shiftY = e.clientY - popup.getBoundingClientRect().top;
    let isDragging = true;

    const onMouseMove = (event) => {
        if (isDragging) {
            let newLeft = Math.max(0, Math.min(window.innerWidth - popup.offsetWidth, event.pageX - shiftX));
            let newTop = Math.max(0, Math.min(window.innerHeight - popup.offsetHeight, event.pageY - shiftY));
            popup.style.left = `${newLeft}px`;
            popup.style.top = `${newTop}px`;
        }
    };
    const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp); 
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    e.preventDefault();
};
const showPopup = (popupId) => {
    const popup = document.getElementById(popupId);
    const config = popupConfig[popupId];
    if (!config) return; 
    Object.assign(popup.style, {
        width: config.width,
        height: config.height,
        left: `${(window.innerWidth - parseInt(config.width)) / 2}px`,
        top: `${(window.innerHeight - parseInt(config.height)) / 2}px`,
        display: 'block'
    });
};