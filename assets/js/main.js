/**
 * WIN ENERGY - Corporate Interactive Scripts
 * Handles mobile navigation, dual-product tab switches, interactive solution finder,
 * and the physical pipe comparison slider.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close when clicking outside or clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // 2. Technology & Sectors Tab Switcher
  const techTabBtns = document.querySelectorAll('.tech-tab-btn');
  const techTabPanes = document.querySelectorAll('.tech-tab-pane');

  techTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      techTabBtns.forEach(b => b.classList.remove('active'));
      techTabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(target);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // 3. Interactive Solution Finder
  const challengeSelect = document.getElementById('finderChallenge');
  const sectorSelect = document.getElementById('finderSector');
  const finderBtn = document.getElementById('finderBtn');
  const finderResult = document.getElementById('finderResult');
  const finderTitle = document.getElementById('finderResultTitle');
  const finderDesc = document.getElementById('finderResultDesc');
  const finderAction = document.getElementById('finderResultAction');

  if (finderBtn && challengeSelect && sectorSelect && finderResult) {
    finderBtn.addEventListener('click', () => {
      const challenge = challengeSelect.value;
      const sector = sectorSelect.value;

      finderResult.className = 'finder-result show';

      if (challenge === 'insects' || sector === 'vineyard' || sector === 'crops' || sector === 'tea') {
        finderResult.classList.add('result-buzzzap');
        finderTitle.textContent = 'Recommended: BuzzZap Solar Clean Tech';
        finderDesc.textContent = 'BuzzZap Eco & Pro Solar Traps eliminate 1,800+ nocturnal crop pests with zero chemical spray, reducing crop losses and lowering pesticide costs by 50%.';
        finderAction.href = 'products.html#buzzzap';
        finderAction.className = 'btn btn-green btn-sm';
        finderAction.textContent = 'View BuzzZap Range →';
      } else {
        finderResult.classList.add('result-hydropulse');
        finderTitle.textContent = 'Recommended: HydroPulse Polarization Unit';
        finderDesc.textContent = 'HydroPulse treats limescale, pipe clogging, and biofouling using physical hydro-polarization without salt or ongoing filter replacements.';
        finderAction.href = 'products.html#hydropulse';
        finderAction.className = 'btn btn-orange btn-sm';
        finderAction.textContent = 'View HydroPulse Range →';
      }
    });
  }

  // 4. Interactive Pipe Comparison Slider (Descaling Visualization)
  const pipeContainer = document.getElementById('pipeSliderContainer');
  const pipeClogged = document.getElementById('pipeCloggedLayer');
  const pipeHandle = document.getElementById('pipeDragHandle');

  if (pipeContainer && pipeClogged && pipeHandle) {
    let isDragging = false;

    const setSliderPosition = (clientX) => {
      const rect = pipeContainer.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      pipeClogged.style.width = `${percentage}%`;
      pipeHandle.style.left = `${percentage}%`;
    };

    pipeHandle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch events
    pipeHandle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      setSliderPosition(e.touches[0].clientX);
    }, { passive: true });
  }

  // 5. Contact / Inquiry Form Handler
  const inquiryForm = document.getElementById('corporateInquiryForm');
  const formSuccessModal = document.getElementById('formSuccessModal');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formSuccessModal) {
        formSuccessModal.style.display = 'flex';
      } else {
        alert('Thank you for reaching out to Win Energy. Our engineering team will contact you shortly.');
      }
      inquiryForm.reset();
    });
  }

  const closeModalBtn = document.getElementById('closeModalBtn');
  if (closeModalBtn && formSuccessModal) {
    closeModalBtn.addEventListener('click', () => {
      formSuccessModal.style.display = 'none';
    });
  }
});
