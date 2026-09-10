(() => {
    const arrowSources = {
        left: "/meta/arrow-left.png",
        leftHover: "/meta/arrow-left-hover.png",
        leftPressed: "/meta/arrow-left-pressed.png",
        right: "/meta/arrow-right.png",
        rightHover: "/meta/arrow-right-hover.png",
        rightPressed: "/meta/arrow-right-pressed.png"
    };

    function preloadArrows() {
        Object.values(arrowSources).forEach(source => {
            const image = new Image();
            image.src = source;
        });
    }

    function createArrow(direction) {
        const arrow = document.createElement("img");
        arrow.src = arrowSources[direction];
        arrow.alt = "";
        arrow.classList.add("arrow", direction);
        arrow.setAttribute("role", "button");
        arrow.setAttribute("aria-label", direction === "left" ? "Previous image" : "Next image");
        arrow.tabIndex = 0;
        return arrow;
    }

    function initializeGallery(gallery) {
        const images = Array.from(gallery.querySelectorAll("img.slide"));
        if (images.length === 0) {
            return;
        }
        let currentIndex = 0;
        const leftArrow = createArrow("left");
        const rightArrow = createArrow("right");
        gallery.append(leftArrow, rightArrow);

        function showImage(index) {
            images.forEach((image, imageIndex) => {
                image.style.display = imageIndex === index ? "block" : "none";
                image.setAttribute("aria-hidden", imageIndex === index ? "false" : "true");
            });
        }

        function navigate(direction) {
            currentIndex = direction === "left"
                ? (currentIndex + images.length - 1) % images.length
                : (currentIndex + 1) % images.length;
            showImage(currentIndex);
            const activeArrow = direction === "left" ? leftArrow : rightArrow;
            const inactiveArrow = direction === "left" ? rightArrow : leftArrow;
            activeArrow.src = arrowSources[`${direction}Pressed`];
            inactiveArrow.src = arrowSources[direction === "left" ? "right" : "left"];
            window.setTimeout(() => {
                activeArrow.src = arrowSources[direction];
            }, 200);
        }

        function bindArrow(arrow, direction) {
            arrow.addEventListener("click", () => navigate(direction));
            arrow.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(direction);
                }
            });
            arrow.addEventListener("mouseenter", () => {
                arrow.src = arrowSources[`${direction}Hover`];
            });
            arrow.addEventListener("mouseleave", () => {
                arrow.src = arrowSources[direction];
            });
        }

        bindArrow(leftArrow, "left");
        bindArrow(rightArrow, "right");
        showImage(currentIndex);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const galleries = document.querySelectorAll(".gallery");
        if (galleries.length === 0) {
            return;
        }
        preloadArrows();
        galleries.forEach(initializeGallery);
    });
})();
