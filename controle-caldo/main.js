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
        const activeTab = tabs[tabIndex];
        const activeTabContent = tabContents[tabIndex];

        tabs.forEach(tab => tab.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));

        activeTab.classList.add("active");
        activeTabContent.classList.add("active");

        updateTotalPeso();
    }

    function updateTotalPeso() {
        let totalPeso = 0;

        pesosInputs.forEach(input => {
            const peso = parseFloat(input.value);
            totalPeso += isNaN(peso) ? 0 : peso;
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
        const activeTabContent = document.querySelector('.tab-content.active');

        if (!activeTabContent) {
            console.error('Nenhuma tab ativa encontrada.');
            return;
        }

        const listaTitulo = activeTabContent.querySelector('ul').classList[0];
        const ingredientes = activeTabContent.querySelectorAll('li');

        const detalhesIngredientes = [];

        ingredientes.forEach((item) => {
            const nomeIngrediente = item.querySelector('span').textContent;
            const valorPeso = item.querySelector('.peso').value;
            detalhesIngredientes.push(`${nomeIngrediente}: ${valorPeso} kg`);
        });

        const textoCompartilhado = `${listaTitulo}\n${detalhesIngredientes.join('\n')}`;

        if (navigator.share) {
            navigator.share({
                title: listaTitulo,
                text: textoCompartilhado,
            })
                .then(() => console.log('Conteúdo compartilhado com sucesso.'))
                .catch(error => console.error('Erro ao compartilhar:', error));
        } else {
            console.log('API de compartilhamento não suportada.');
        }
    }
});
