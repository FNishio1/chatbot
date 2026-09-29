// Extremo Oeste - site scripts (mobile menu, experience modal, gallery toggle)

    // MOBILE MENU
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile nav when a link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    // MODAL
    const modal = document.getElementById('modal');
    const modalButtons = document.querySelectorAll('.open-modal');
    const closeModal = document.getElementById('close-modal');

    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalDuration = document.getElementById('modal-duration');
    const modalPrice = document.getElementById('modal-price');

    const modalGroupSize = document.getElementById('modal-group-size');
    const modalIncludes = document.getElementById('modal-includes');
    const modalItinerary = document.getElementById('modal-itinerary');
    const modalItineraryList = document.getElementById('modal-itinerary-list');

    modalButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalTitle.textContent = button.dataset.title;

        // Usa la imagen de la tarjeta directamente
        const cardImg = button.closest('article').querySelector('img');
        modalImage.src = cardImg ? cardImg.getAttribute('src') : button.dataset.image;

        modalDescription.textContent = button.dataset.description;
        modalDuration.textContent = '⏱ ' + button.dataset.duration;
        modalGroupSize.textContent = button.dataset.groupSize ? '👥 ' + button.dataset.groupSize : '';
        modalIncludes.textContent = button.dataset.includes ? '✓ ' + button.dataset.includes : '';
        modalPrice.textContent = '💲 ' + button.dataset.price;

        const itinerary = button.dataset.itinerary;
        if (itinerary && itinerary.trim()) {
          const stops = itinerary.split('\n').map(s => s.trim()).filter(s => s);
          modalItineraryList.innerHTML = stops.map(s => `<li>${s}</li>`).join('');
          modalItinerary.style.display = 'block';
        } else {
          modalItinerary.style.display = 'none';
        }
      });
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if(e.target === modal){
        modal.style.display = 'none';
      }
    });

    // GALLERY SEE MORE (mobile only — CSS hides items 5+ under 768px)
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryMoreBtn = document.getElementById('gallery-more-btn');

    if (galleryMoreBtn) {
      galleryMoreBtn.addEventListener('click', () => {
        const expanded = galleryGrid.classList.toggle('expanded');
        galleryMoreBtn.textContent = expanded ? 'See less' : 'See more';
      });
    }

    // GALLERY LIGHTBOX
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeLightbox = document.getElementById('close-lightbox');

    galleryGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImage.src = img.getAttribute('src');
        lightboxImage.alt = img.getAttribute('alt') || '';
        lightbox.style.display = 'flex';
        requestAnimationFrame(() => lightbox.classList.add('active'));
      });
    });

    function hideLightbox() {
      lightbox.classList.remove('active');
      setTimeout(() => { lightbox.style.display = 'none'; }, 250);
    }

    closeLightbox.addEventListener('click', hideLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hideLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) hideLightbox();
    });
