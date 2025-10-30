document.addEventListener('DOMContentLoaded', () => {
  const publicationsContainer = document.getElementById('publications-container');
  if (!publicationsContainer) {
    return;
  }

  fetch('citations.bib')
    .then((response) => response.text())
    .then((bibtexText) => {
      const publicationsHTML = parseBibTeX(bibtexText);
      publicationsContainer.innerHTML = publicationsHTML;
    })
    .catch((error) => {
      console.error('Error fetching publications:', error);
    });
});

function parseBibTeX(bibtexText) {
  const entries = bibtexText.trim().split('@').filter((entry) => entry.trim() !== '');

  return entries
    .map((entry) => {
      const [typeKeyLine, ...contentLines] = entry.trim().split('\n');
      const [type] = typeKeyLine.split('{');

      let html = `<div class="publication"><h3>${type.trim()}</h3>`;

      contentLines.forEach((line) => {
        if (line.includes('=')) {
          const [field, value] = line.split('=');
          const cleanValue = value.replace(/[\{\}",]/g, '').trim();
          html += `<p><strong>${field.trim()}:</strong> ${cleanValue}</p>`;
        }
      });

      html += '</div>';
      return html;
    })
    .join('');
}