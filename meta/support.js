(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const scrollUp = document.getElementById("scrollUp");
        if (!scrollUp) {
            return;
        }
        function updateScrollButton() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollRange = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = scrollRange > 0 ? scrollTop / scrollRange : 0;
            scrollUp.classList.toggle("show", scrollPercent > 0.3);
        }
        window.addEventListener("scroll", updateScrollButton, { passive: true });
        scrollUp.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        updateScrollButton();
    });
})();
