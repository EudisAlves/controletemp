document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const totalPesoElement = document.getElementById("total-peso");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => showTab(index));
    });

    function showTab(tabIndex) {
        tabs.forEach(tab => tab.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        tabs[tabIndex].classList.add("active");
        tabContents[tabIndex].classList.add("active");
    }

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
        let totalPeso = 0;

        pesosInputs.forEach(input => {
            const peso = parseFloat(input.value);
            totalPeso += peso;
        });

        totalPesoElement.textContent = `Total Peso: ${totalPeso.toFixed(2)} kg`;
    });

    document.getElementById("limpar-inputs").addEventListener("click", function () {
        pesosInputs.forEach(input => {
            const ingrediente = input.getAttribute("data-ingrediente");
            localStorage.removeItem(ingrediente);
            input.value = 0;
        });

        totalPesoElement.textContent = "Total Peso: 0.00 kg";
    });

    document.getElementById("compartilhar").addEventListener("click", shareAllTabs);

    document.getElementById("compartilhar-whatsapp").addEventListener("click", function () {
        const contentToShare = buildShareContent();
        shareOnPlatform(contentToShare, "whatsapp");
    });

    function buildShareContent(tabContent) {
        let content = "Resultados dos pesos dos ingredientes:\n\n";

        const tabNumber = tabContent.getAttribute("data-tab");
        const ingredientsList = tabContent.querySelectorAll(".peso");

        content += `Tab ${tabNumber}:\n`;

        ingredientsList.forEach(ingredient => {
            const ingredientName = ingredient.getAttribute("data-ingrediente");
            const ingredientWeight = ingredient.value;
            content += `${ingredientName}: ${ingredientWeight} kg\n`;
        });

        content += "\n";

        return content;
    }

    function shareOnPlatform(content, platform) {
        let shareUrl = "";

        switch (platform) {
            case "facebook":
                // Substitua pela URL de compartilhamento do Facebook
                shareUrl = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(content)}`;
                break;
            case "twitter":
                // Substitua pela URL de compartilhamento do Twitter
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
                break;
            case "whatsapp":
                // Substitua pela URL de compartilhamento do WhatsApp
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;
                break;
            // Adicione mais casos para outras plataformas conforme necessário
            default:
                console.log("Plataforma de compartilhamento não suportada.");
                return;
        }

        window.open(shareUrl, "_blank");
    }

    function shareAllTabs() {
        tabContents.forEach((tabContent, index) => {
            const contentToShare = buildShareContent(tabContent);
            setTimeout(() => {
                shareOnPlatform(contentToShare, "facebook"); // Substitua "facebook" pela plataforma desejada
            }, index * 1000); // Espaçamento de 1 segundo entre os compartilhamentos das tabs
        });
    }
});
