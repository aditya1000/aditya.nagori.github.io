document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll shadow (al-folio behavior)
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

  // === News link-preview thumbnails via Microlink API ===
  ;(function () {
    const CACHE_KEY = 'np_v2';
    let cache = {};
    try { cache = JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {}; } catch (_) {}
    function saveCache() {
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (_) {}
    }
    function applyThumb(td, src) {
      if (!src) return;
      const img = document.createElement('img');
      img.className = 'news-thumb';
      img.src       = src;
      img.alt       = '';
      img.loading   = 'lazy';
      img.decoding  = 'async';
      img.onerror   = () => img.remove();
      td.classList.add('news-td--has-thumb');
      td.insertBefore(img, td.firstChild);
    }
    document.querySelectorAll('.news-table tr').forEach(tr => {
      const td = tr.querySelector('td:not(.news-date)');
      if (!td) return;
      const a = td.querySelector('a[href^="http"]');
      if (!a) return;
      const url = a.href;
      if (Object.prototype.hasOwnProperty.call(cache, url)) {
        applyThumb(td, cache[url]);
        return;
      }
      fetch('https://api.microlink.io/?url=' + encodeURIComponent(url))
        .then(r => r.json())
        .then(({ data }) => {
          const src = data?.image?.url || data?.logo?.url || null;
          cache[url] = src;
          saveCache();
          if (src) applyThumb(td, src);
        })
        .catch(() => { cache[url] = null; saveCache(); });
    });
  })();

  // BibTeX parser (kept for citations.bib if needed)
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