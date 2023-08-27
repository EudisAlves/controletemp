document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
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

    const pesosInputs = document.querySelectorAll(".peso");

    pesosInputs.forEach(input => {
        const ingrediente = input.getAttribute("data-ingrediente");
        const peso = localStorage.getItem(ingrediente);
        if (peso !== null) {
            input.value = peso;
        }

        input.addEventListener("change", function () {
            const peso = this.value;
            localStorage.setItem(ingrediente, peso);
        });
    });

    document.getElementById("calcular-total").addEventListener("click", function () {
        const pesosInputs = document.querySelectorAll(".peso");
        let totalPeso = 0;

        pesosInputs.forEach(input => {
            const peso = parseFloat(input.value);
            totalPeso += peso;
        });

        document.getElementById("total-peso").textContent = "Total Peso: " + totalPeso.toFixed(2) + " kg";
    });

    document.getElementById("limpar-inputs").addEventListener("click", function () {
        const pesosInputs = document.querySelectorAll(".peso");

        pesosInputs.forEach(input => {
            input.value = 0;
            const ingrediente = input.getAttribute("data-ingrediente");
            localStorage.removeItem(ingrediente);
        });

        document.getElementById("total-peso").textContent = "Total Peso: 0.00 kg";
    });

    document.getElementById("compartilhar").addEventListener("click", function () {
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

    document.getElementById("compartilhar-whatsapp").addEventListener("click", function () {
        const contentToShare = buildShareContent();
        shareOnWhatsApp(contentToShare);
    });

    function shareOnWhatsApp(content) {
        const encodedContent = encodeURIComponent(content);
        const whatsappShareUrl = `https://wa.me/?text=${encodedContent}`;
        window.open(whatsappShareUrl, "_blank");
    }
});
