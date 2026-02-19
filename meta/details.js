function handleDateReposition() {
    const breakpoint = 600;
    const isSmallScreen = window.innerWidth < breakpoint;

    const detailElements = document.querySelectorAll('.details-impt-info');

    detailElements.forEach(details => {
        const dateSpan = details.querySelector('.date');
        
        if (!dateSpan) {
            return;
        }

        if (isSmallScreen) {
            if (dateSpan.parentElement.tagName.toLowerCase() === 'summary') {
                dateSpan.style.float = 'none';
                
                const dateContainer = document.createElement('div');
                dateContainer.setAttribute('data-moved-date', '');
                
                dateContainer.style.textAlign = 'center';
                dateContainer.style.marginTop = '10px';
                dateContainer.style.fontStyle = 'normal';
                
                dateContainer.appendChild(dateSpan);
                
                details.appendChild(dateContainer);
            }
        } else {
            const summary = details.querySelector('summary');
            const dateContainer = details.querySelector('[data-moved-date]');

            if (dateContainer && dateContainer.contains(dateSpan)) {
                dateSpan.style.removeProperty('float');
                
                summary.appendChild(dateSpan);
                
                dateContainer.remove();
            }
        }
    });
}

const mediaQuery = window.matchMedia('(max-width: 600px)');

function mediaQueryListener(event) {
    handleDateReposition();
}

mediaQuery.addListener(mediaQueryListener);

handleDateReposition();