document.addEventListener("DOMContentLoaded", () => {
  // Initialize Materialize modal
  if (window.M && M.Modal) {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
  }

  // --- Multilingual Modal Logic ---
  // Load descriptions from descriptions.js (must be included in HTML before this script)
  // Default language
  let currentLang = 'en';

  // Language switcher logic
  const langButtons = document.querySelectorAll('.language-switcher button');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.getAttribute('data-lang');
    });
  });

  // --- UI Translations ---
  const uiTranslations = {
    nav: {
      en: { home: 'Home', about: 'About Us', contact: 'Contact', brand: 'Tourist Agency' },
      ru: { home: 'Главная', about: 'О нас', contact: 'Контакты', brand: 'Туристическое агентство' },
      ar: { home: 'الرئيسية', about: 'معلومات عنا', contact: 'اتصل', brand: 'وكالة سياحية' }
    },
    modal: {
      en: { close: 'Close' },
      ru: { close: 'Закрыть' },
      ar: { close: 'إغلاق' }
    }
  };

  function updateUITranslations() {
    // Navbar
    const nav = uiTranslations.nav[currentLang];
    document.querySelector('.brand-logo').textContent = nav.brand;
    const navLinks = document.querySelectorAll('#nav-mobile li a');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = nav.home;
      navLinks[1].textContent = nav.about;
      navLinks[2].textContent = nav.contact;
    }
    // Modal close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.textContent = uiTranslations.modal[currentLang].close;
  }

  // --- Region Label Translations ---
  const regionLabelTranslations = {
    "GE-AB": { en: "Abkhazia", ru: "Абхазия", ar: "أبخازيا" },
    "GE-AJ": { en: "Ajaria", ru: "Аджария", ar: "أجاريا" },
    "GE-GU": { en: "Guria", ru: "Гурия", ar: "غوريا" },
    "GE-IM": { en: "Imereti", ru: "Имерети", ar: "إيميريتي" },
    "GE-KA": { en: "K'akheti", ru: "Кахети", ar: "كاخيتي" },
    "GE-KK": { en: "Kvemo Kartli", ru: "Квемо Картли", ar: "كفيمو كارتلي" },
    "GE-MM": { en: "Mtskheta-Mtianeti", ru: "Мцхета-Мтианети", ar: "متسخيتا-متينيتي" },
    "GE-RL": { en: "Rach'a-Lechkhumi-Kvemo Svaneti", ru: "Рача-Лечхуми-Квемо Сванети", ar: "راتشا-ليتشخومي-كفيمو سفانيتي" },
    "GE-SJ": { en: "Samtskhe-Javakheti", ru: "Самцхе-Джавахети", ar: "سامتسخه-جافاخيتي" },
    "GE-SK": { en: "Shida Kartli", ru: "Шида Картли", ar: "شيدا كارتلي" },
    "GE-SZ": { en: "Samegrelo-Zemo Svaneti", ru: "Самегрело-Земо Сванети", ar: "سامغريلو-زيمو سفانيتي" },
    "GE-TB": { en: "Tbilisi", ru: "Тбилиси", ar: "تبليسي" }
  };

  function updateRegionLabels() {
    for (const id in regionLabelTranslations) {
      const label = document.getElementById('label-' + id);
      if (label) {
        label.textContent = regionLabelTranslations[id][currentLang] || regionLabelTranslations[id]['en'];
      }
    }
  }

  // Use the correct object name and region IDs from pathData
  for (const id in pathData) {
    const pathElement = document.getElementById(id);
    if (pathElement) {
      // Some entries in pathData are objects, some are strings
      const d = typeof pathData[id] === 'string' ? pathData[id] : pathData[id].d;
      if (d) {
        pathElement.setAttribute("d", d);
      }
      // Add hover effect for border highlight
      pathElement.addEventListener('mouseenter', () => {
        pathElement.setAttribute('data-original-stroke', pathElement.getAttribute('stroke') || '');
        pathElement.setAttribute('data-original-stroke-width', pathElement.getAttribute('stroke-width') || '');
        pathElement.setAttribute('stroke', '#FFD700'); // gold border
        pathElement.setAttribute('stroke-width', '4');
        pathElement.style.cursor = 'pointer';
      });
      pathElement.addEventListener('mouseleave', () => {
        const originalStroke = pathElement.getAttribute('data-original-stroke');
        const originalStrokeWidth = pathElement.getAttribute('data-original-stroke-width');
        if (originalStroke !== null) pathElement.setAttribute('stroke', originalStroke);
        if (originalStrokeWidth !== null) pathElement.setAttribute('stroke-width', originalStrokeWidth);
        pathElement.style.cursor = '';
      });
      // Add click event to show modal with region info
      pathElement.addEventListener('click', () => {
        const modal = document.getElementById('region-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        if (modalTitle) modalTitle.textContent = pathElement.getAttribute('title') || id;
        // Show region description from descriptions.js based on currentLang
        let desc = '';
        if (typeof descriptions === 'object' && descriptions[id] && descriptions[id][currentLang]) {
          desc = descriptions[id][currentLang];
        }
        if (modalContent) modalContent.textContent = desc || 'No description available.';
        if (window.M && M.Modal) {
          const instance = M.Modal.getInstance(modal) || M.Modal.init(modal);
          instance.open();
        }
      });
    }
  }

  // Update UI on language switch
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      updateUITranslations();
      updateRegionLabels();
    });
  });

  // Initial UI translation
  updateUITranslations();
  updateRegionLabels();
});