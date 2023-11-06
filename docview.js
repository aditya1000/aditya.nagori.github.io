document.addEventListener("DOMContentLoaded", function() {
    fetch('citations.bibtex')
        .then(response => response.text())
        .then(data => {
            const bibtexContainer = document.querySelector('.bibtex');
            bibtexContainer.textContent = data;
        });
});