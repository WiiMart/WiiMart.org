function preloadArrows() {
    function preloadImages() {//v1.0
        var doc = document, args = arguments; if (!doc.img) doc.img = new Array();
        for (var i = 0; i < args.length; i++) { doc.img[i] = new Image; doc.img[i].src = args[i]; }
    }
    preloadImages(
        "/meta/arrow-right-hover.png",
        "/meta/arrow-left-hover.png",
        "/meta/arrow-right-pressed.png",
        "/meta/arrow-left-pressed.png"
    );
}

const galleries = document.querySelectorAll('.gallery');

galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('img');
    let currentIndex = 0;

    const leftArrow = document.createElement('img');
    leftArrow.src = 'meta/arrow-left.png';
    leftArrow.classList.add('arrow', 'left');
    gallery.appendChild(leftArrow);

    const rightArrow = document.createElement('img');
    rightArrow.src = 'meta/arrow-right.png';
    rightArrow.classList.add('arrow', 'right');
    gallery.appendChild(rightArrow);

    function showImage(index) {
        images.forEach((img, i) => {
            img.style.display = (i === index) ? 'block' : 'none';
        });
    }

    function handleArrowClick(isLeftArrow) {
        currentIndex = isLeftArrow 
            ? (currentIndex === 0 ? images.length - 1 : currentIndex - 1) 
            : (currentIndex === images.length - 1 ? 0 : currentIndex + 1);
        
        showImage(currentIndex);

        if (isLeftArrow) {
            leftArrow.src = 'meta/arrow-left-pressed.png';
            rightArrow.src = 'meta/arrow-right.png';
            setTimeout(() => {
                leftArrow.src = 'meta/arrow-left.png';
            }, 200);
        } else {
            rightArrow.src = 'meta/arrow-right-pressed.png';
            leftArrow.src = 'meta/arrow-left.png';
            setTimeout(() => {
                rightArrow.src = 'meta/arrow-right.png';
            }, 200);
        }
    }

    leftArrow.addEventListener('click', () => handleArrowClick(true));
    rightArrow.addEventListener('click', () => handleArrowClick(false));

    leftArrow.addEventListener('mouseover', () => {
        leftArrow.src = 'meta/arrow-left-hover.png';
    });
    leftArrow.addEventListener('mouseout', () => {
        leftArrow.src = 'meta/arrow-left.png';
    });

    rightArrow.addEventListener('mouseover', () => {
        rightArrow.src = 'meta/arrow-right-hover.png';
    });
    rightArrow.addEventListener('mouseout', () => {
        rightArrow.src = 'meta/arrow-right.png';
    });

    showImage(currentIndex);
});