document.addEventListener("DOMContentLoaded", function() {
    fetch('citations.bib')
      .then(response => response.text())
      .then(bibtexText => {
        const publicationsHTML = parseBibTeX(bibtexText);
        document.getElementById('publications-container').innerHTML = publicationsHTML;
      })
      .catch(error => {
        console.error('Error fetching publications:', error);
      });
  });
  
  function parseBibTeX(bibtexText) {
    // Split the entries
    const entries = bibtexText.trim().split('@').filter(entry => entry.trim() !== '');
  
    // Map over each entry and convert to HTML
    return entries.map(entry => {
      // Extract the type and reference key
      const [typeKeyLine, ...contentLines] = entry.trim().split('\n');
      const [type, key] = typeKeyLine.split('{');
      
      // Start building the HTML
      let html = `<div class="publication"><h3>${type.trim()}</h3>`;
  
      // Process each line to extract fields and values
      contentLines.forEach(line => {
        if (line.includes('=')) {
          const [field, value] = line.split('=');
          const cleanValue = value.replace(/[\{\}",]/g, '').trim(); // Remove bibtex formatting
          html += `<p><strong>${field.trim()}:</strong> ${cleanValue}</p>`;
        }
      });
  
      // Close the publication div
      html += '</div>';
      return html;
    }).join(''); // Join all entries' HTML
  }