document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // --- Active Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNav = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (targetNav) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNav.classList.add('active');
        } else {
          targetNav.classList.remove('active');
        }
      }
    });
  });

  // --- Menu Explorer Tabs ---
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuPanes = document.querySelectorAll('.menu-tab-pane');

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuTabBtns.forEach(b => b.classList.remove('active'));
      menuPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // --- Gallery Filters & Lightbox ---
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  let visibleGalleryItems = Array.from(galleryItems);

  function updateVisibleGalleryItems() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });

      updateVisibleGalleryItems();
    });
  });

  function showLightbox(index) {
    if (visibleGalleryItems.length === 0) return;
    currentGalleryIndex = (index + visibleGalleryItems.length) % visibleGalleryItems.length;
    const targetItem = visibleGalleryItems[currentGalleryIndex];
    const imgEl = targetItem.querySelector('img');
    const titleEl = targetItem.querySelector('h5');
    const tagEl = targetItem.querySelector('.tag');

    if (imgEl && lightboxImg) {
      lightboxImg.src = imgEl.src;
      lightboxCaption.innerHTML = `<strong>${titleEl ? titleEl.textContent : ''}</strong> ${tagEl ? ` &bull; <span style="color:var(--primary-gold-light)">${tagEl.textContent}</span>` : ''}`;
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleGalleryItems();
      const idx = visibleGalleryItems.indexOf(item);
      if (idx !== -1) {
        showLightbox(idx);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(currentGalleryIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(currentGalleryIndex + 1);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showLightbox(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showLightbox(currentGalleryIndex + 1);
    }
  });

  // --- Catering Cost Estimator Calculator ---
  const guestSlider = document.getElementById('guestSlider');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const calcGuestSummary = document.getElementById('calcGuestSummary');
  const calcPackageRadios = document.querySelectorAll('input[name="calcPackage"]');
  const calcAddons = document.querySelectorAll('input[name="calcAddon"]');

  const calcPackageName = document.getElementById('calcPackageName');
  const calcBaseRate = document.getElementById('calcBaseRate');
  const calcAddonRate = document.getElementById('calcAddonRate');
  const calcPlateRate = document.getElementById('calcPlateRate');
  const calcTotalAmount = document.getElementById('calcTotalAmount');
  const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  function calculateEstimate() {
    const guests = parseInt(guestSlider.value, 10);
    if (guestCountDisplay) guestCountDisplay.textContent = guests.toLocaleString('en-IN');
    if (calcGuestSummary) calcGuestSummary.textContent = `${guests.toLocaleString('en-IN')} Guests`;

    let baseRate = 350;
    let pkgTitle = 'Grand Muhurtham Leaf Feast';

    calcPackageRadios.forEach(radio => {
      const card = radio.closest('.calc-radio-card');
      if (radio.checked) {
        if (card) card.classList.add('active');
        baseRate = parseInt(radio.getAttribute('data-price'), 10);
        pkgTitle = radio.getAttribute('data-name');
      } else {
        if (card) card.classList.remove('active');
      }
    });

    let addonTotal = 0;
    const selectedAddons = [];
    calcAddons.forEach(addon => {
      if (addon.checked) {
        const addonPrice = parseInt(addon.getAttribute('data-price'), 10);
        addonTotal += addonPrice;
        selectedAddons.push(addon.getAttribute('data-name'));
      }
    });

    const totalPerPlate = baseRate + addonTotal;
    const grandTotal = totalPerPlate * guests;

    if (calcPackageName) calcPackageName.textContent = pkgTitle;
    if (calcBaseRate) calcBaseRate.textContent = `₹${baseRate}`;
    if (calcAddonRate) calcAddonRate.textContent = `+₹${addonTotal}`;
    if (calcPlateRate) calcPlateRate.textContent = `₹${totalPerPlate}`;
    if (calcTotalAmount) calcTotalAmount.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    // Update WhatsApp Inquire URL
    if (calcWhatsAppBtn) {
      const waText = encodeURIComponent(
        `Namaskaram OM SHAKTHI Catering! 🙏\n\n` +
        `I would like to inquire about catering services for my upcoming function:\n` +
        `• Package: ${pkgTitle}\n` +
        `• Estimated Guests: ${guests}\n` +
        `• Add-ons Selected: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None'}\n` +
        `• Estimated Budget: ₹${grandTotal.toLocaleString('en-IN')} (approx ₹${totalPerPlate}/plate)\n\n` +
        `Please share the full menu and availability. Thank you!`
      );
      calcWhatsAppBtn.href = `https://wa.me/919666671035?text=${waText}`;
    }
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', calculateEstimate);
  }
  calcPackageRadios.forEach(r => r.addEventListener('change', calculateEstimate));
  calcAddons.forEach(a => a.addEventListener('change', calculateEstimate));

  // Run initial calculation
  calculateEstimate();

  // --- Quick Booking Form Submission ---
  const bookingForm = document.getElementById('bookingForm');
  const toastNotice = document.getElementById('toastNotice');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bName').value.trim();
      const phone = document.getElementById('bPhone').value.trim();
      const date = document.getElementById('bDate').value;
      const eventType = document.getElementById('bEventType').value;
      const guests = document.getElementById('bGuests').value;
      const city = document.getElementById('bCity').value.trim();
      const notes = document.getElementById('bNotes').value.trim();

      if (!name || !phone) {
        showToast('⚠️ Please enter your Name and Mobile Number.');
        return;
      }

      // Build WhatsApp message
      const msg = encodeURIComponent(
        `Namaskaram OM SHAKTHI Catering! 🙏\n\n` +
        `I would like to book/inquire catering for an event:\n` +
        `• Name: ${name}\n` +
        `• Contact: ${phone}\n` +
        `• Event Type: ${eventType}\n` +
        `• Event Date: ${date || 'To be decided'}\n` +
        `• Guest Count: ${guests || 'Flexible'}\n` +
        `• Venue/City: ${city || 'AP / Tamil Nadu / Telangana'}\n` +
        `• Requirements: ${notes || 'Standard menu options'}\n\n` +
        `Kindly call back or message me with menu packages and quotation.`
      );

      // Show confirmation toast
      showToast('🎉 Thank you! Opening WhatsApp to send your inquiry...');

      setTimeout(() => {
        window.open(`https://wa.me/919666671035?text=${msg}`, '_blank');
        bookingForm.reset();
      }, 1200);
    });
  }

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  }

  // --- FAQ Accordion ---
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.faq-body');
      const isOpen = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('active');
        const b = f.querySelector('.faq-body');
        if (b) b.style.maxHeight = null;
      });

      if (!isOpen && body) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
});
