document.addEventListener("DOMContentLoaded", function() {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function() {
            const tabNumber = this.getAttribute("data-tab");
            
            tabs.forEach(t => {
                t.classList.remove("active");
            });
            tab.classList.add("active");

            tabContents.forEach(content => {
                content.classList.remove("active");
            });

            document.querySelector(`.tab-content[data-tab="${tabNumber}"]`).classList.add("active");
        });
    });

    document.getElementById("compartilhar").addEventListener("click", function() {
        const contentToShare = buildShareContent();
        shareContent(contentToShare);
    });

    function buildShareContent() {
        let content = "Resultados dos pesos dos ingredientes:\n\n";

        tabContents.forEach((content, index) => {
            const tabNumber = index + 1;
            const tabName = `Tab ${tabNumber}`;
            const ingredientsList = content.querySelectorAll(".peso");
            
            content += `${tabName}:\n`;

            ingredientsList.forEach(ingredient => {
                const ingredientName = ingredient.getAttribute("data-ingrediente");
                const ingredientWeight = ingredient.value;
                content += `${ingredientName}: ${ingredientWeight} kg\n`;
            });

            content += "\n";
        });

        return content;
    }

    function shareContent(content) {
        const encodedContent = encodeURIComponent(content);
        const shareUrl = `mailto:?subject=Compartilhar Resultados&body=${encodedContent}`;
        window.location.href = shareUrl;
    }
});
