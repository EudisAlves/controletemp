document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const totalPesoElement = document.getElementById("total-peso");
    const pesosInputs = document.querySelectorAll(".peso");
    const shareButton = document.querySelector(".share-button");
    const sections = document.querySelectorAll(".tab-content");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => showTab(index));
    });

    function showTab(tabIndex) {
        tabs.forEach(tab => tab.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        tabs[tabIndex].classList.add("active");
        tabContents[tabIndex].classList.add("active");
    }

    pesosInputs.forEach(input => {
        const ingrediente = input.getAttribute("data-ingrediente");
        const peso = localStorage.getItem(ingrediente);

        if (peso !== null) {
            input.value = peso;
        }

        input.addEventListener("change", function () {
            const peso = this.value;
            localStorage.setItem(ingrediente, peso);
            updateTotalPeso();
        });
    });

    function updateTotalPeso() {
        let totalPeso = 0;

        pesosInputs.forEach(input => {
            const peso = parseFloat(input.value);
            totalPeso += peso;
        });

        totalPesoElement.textContent = `Total Peso: ${totalPeso.toFixed(2)} kg`;
    }

    document.getElementById("calcular-total").addEventListener("click", updateTotalPeso);

    document.getElementById("limpar-inputs").addEventListener("click", function () {
        pesosInputs.forEach(input => {
            const ingrediente = input.getAttribute("data-ingrediente");
            localStorage.removeItem(ingrediente);
            input.value = 0;
        });

        updateTotalPeso();
    });

    shareButton.addEventListener("click", function () {
        let listText = "";

        sections.forEach(section => {
            const sectionId = section.getAttribute("id");
            listText += generateListText(section) + "\n\n";
        });

        if (navigator.share) {
            navigator.share({
                title: "Lista de Itens",
                text: listText,
            })
            .then(() => console.log("Conteúdo compartilhado"))
            .catch(error => console.error("Erro ao compartilhar:", error));
        } else {
            console.log("API de compartilhamento não suportada");
        }
    });

    function generateListText(section) {
        const items = section.querySelectorAll(".item");
        let sectionText = `Itens da seção ${section.id}:\n`;

        items.forEach(item => {
            const itemName = item.querySelector(".item-name").textContent;
            const itemPeso = item.querySelector(".peso").value;
            sectionText += `- ${itemName}: ${itemPeso} kg\n`;
        });

        return sectionText;
    }
});
