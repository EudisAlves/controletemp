document.addEventListener("DOMContentLoaded", function () {
    // Elementos
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const totalPesoElement = document.getElementById("total-peso");
    const pesosInputs = document.querySelectorAll(".peso");
    const shareButton = document.querySelector(".share-button");

    // Event Listeners
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => showTab(index));
    });

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

    document.getElementById("calcular-total").addEventListener("click", updateTotalPeso);

    document.getElementById("limpar-inputs").addEventListener("click", limparInputs);

    shareButton.addEventListener("click", compartilharLista);

    // Funções
    function showTab(tabIndex) {
        tabs.forEach(tab => tab.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        tabs[tabIndex].classList.add("active");
        tabContents[tabIndex].classList.add("active");
    }

    function updateTotalPeso() {
        let totalPeso = 0;

        pesosInputs.forEach(input => {
            const peso = parseFloat(input.value);
            totalPeso += peso;
        });

        totalPesoElement.textContent = `Total Peso: ${totalPeso.toFixed(2)} kg`;
    }

    function limparInputs() {
        pesosInputs.forEach(input => {
            const ingrediente = input.getAttribute("data-ingrediente");
            localStorage.removeItem(ingrediente);
            input.value = 0;
        });

        updateTotalPeso();
    }

    function compartilharLista() {
        const sections = document.querySelectorAll(".tab-content");
        let listText = "";

        sections.forEach(section => {
            const sectionId = section.getAttribute("id");
            listText += `Seção ID: ${sectionId}\n`;

            const items = section.querySelectorAll("li");
            items.forEach(item => {
                const ingredienteId = item.querySelector("span").getAttribute("id");
                const itemPeso = item.querySelector(".peso").value;
                listText += `- Ingrediente ID: ${ingredienteId}, Peso: ${itemPeso} kg\n`;
            });

            listText += "\n";
        });

        if (navigator.share) {
            navigator.share({
                title: "Lista de Itens",
                text: listText,
                url: window.location.href // Adiciona a URL da página
            })
            .then(() => console.log("Conteúdo compartilhado"))
            .catch(error => console.error("Erro ao compartilhar:", error));
        } else {
            console.log("API de compartilhamento não suportada");
        }
    }
});
