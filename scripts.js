document.addEventListener('DOMContentLoaded', function () {
  // Navbar scroll shadow
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // BibTeX cite toggle
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-cite')) {
      const entry = e.target.closest('.pub-entry');
      if (entry) {
        const block = entry.querySelector('.bib-block');
        if (block) {
          block.classList.toggle('open');
          e.target.classList.toggle('active');
        }
      }
    }
  });
});
