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


  // Add to your existing scripts.js or create a new one

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("slide");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 1000); // Change image every second
}

function plusSlides(n) {
  slideIndex += n;
  if (slideIndex > slides.length) {slideIndex = 1}
  if (slideIndex < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slides[slideIndex-1].style.display = "block"; 
}