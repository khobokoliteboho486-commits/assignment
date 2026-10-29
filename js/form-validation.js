/* =========================================================
   KINGDOM IN THE SKY — form-validation.js
   Client-side validation for the contact form and the
   newsletter form on the homepage.
   These are front-end demonstrations only — no data is sent,
   stored, or processed on a backend.
   ========================================================= */

(function () {
  'use strict';

  /* ========================================================
     CONTACT FORM VALIDATION
     ======================================================== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const feedback = document.getElementById('formFeedback');
    const resetBtn = document.getElementById('formReset');
    const travelDateInput = document.getElementById('travelDate');

    const fields = {
      fullName: {
        el: document.getElementById('fullName'),
        error: document.getElementById('fullNameError'),
        validate: (value) => {
          if (!value.trim()) return 'Please enter your full name.';
          if (value.trim().length < 2) return 'Your name is too short.';
          if (!/^[a-zA-Z\u00C0-\u024F'.\-\s]{2,}$/.test(value.trim())) {
            return 'Please use letters only (spaces, apostrophes, and hyphens allowed).';
          }
          return '';
        }
      },
      email: {
        el: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (value) => {
          if (!value.trim()) return 'Please enter your email address.';
          // Reasonable international-friendly pattern
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!pattern.test(value.trim())) {
            return 'Please enter a valid email address (e.g. name@example.com).';
          }
          return '';
        }
      },
      phone: {
        el: document.getElementById('phone'),
        error: document.getElementById('phoneError'),
        validate: (value) => {
          if (!value.trim()) return ''; // optional
          const cleaned = value.trim();
          // Accept international formats: +, spaces, hyphens, parentheses, digits
          // Require between 7 and 15 digits
          const digits = cleaned.replace(/\D/g, '');
          if (!/^[+()\d\s\-.]{6,}$/.test(cleaned)) {
            return 'Please use a valid phone number (digits, spaces, +, -, () allowed).';
          }
          if (digits.length < 7 || digits.length > 15) {
            return 'Phone number should contain 7–15 digits.';
          }
          return '';
        }
      },
      destination: {
        el: document.getElementById('destination'),
        error: document.getElementById('destinationError'),
        validate: (value) => {
          if (!value) return 'Please choose a destination.';
          return '';
        }
      },
      travelDate: {
        el: document.getElementById('travelDate'),
        error: document.getElementById('travelDateError'),
        validate: (value) => {
          if (!value) return 'Please choose a travel date.';
          const selected = new Date(value + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (isNaN(selected.getTime())) {
            return 'Please enter a valid date.';
          }
          if (selected < today) {
            return 'Travel date cannot be in the past.';
          }
          return '';
        }
      },
      travellers: {
        el: document.getElementById('travellers'),
        error: document.getElementById('travellersError'),
        validate: (value) => {
          if (!value) return 'Please enter the number of travellers.';
          const num = Number(value);
          if (!Number.isInteger(num)) {
            return 'Please enter a whole number.';
          }
          if (num < 1) return 'At least 1 traveller is required.';
          if (num > 30) return 'Please contact us directly for groups larger than 30.';
          return '';
        }
      },
      experience: {
        el: document.getElementById('experience'),
        error: document.getElementById('experienceError'),
        validate: (value) => {
          if (!value) return 'Please choose a type of experience.';
          return '';
        }
      },
      message: {
        el: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: (value) => {
          if (!value) return ''; // optional
          if (value.length > 1000) {
            return 'Message is too long (max 1000 characters).';
          }
          return '';
        }
      }
    };

    /* ---------- HELPERS ---------- */
    function setFieldError(field, message) {
      if (!field || !field.el) return;

      if (message) {
        field.el.classList.add('is-invalid');
        field.el.classList.remove('is-valid');
        field.el.setAttribute('aria-invalid', 'true');
        if (field.error) {
          field.error.textContent = message;
          field.error.classList.add('show');
        }
      } else {
        field.el.classList.remove('is-invalid');
        field.el.classList.add('is-valid');
        field.el.removeAttribute('aria-invalid');
        if (field.error) {
          field.error.textContent = '';
          field.error.classList.remove('show');
        }
      }
    }

    function clearFieldState(field) {
      if (!field || !field.el) return;
      field.el.classList.remove('is-invalid');
      field.el.classList.remove('is-valid');
      field.el.removeAttribute('aria-invalid');
      if (field.error) {
        field.error.textContent = '';
        field.error.classList.remove('show');
      }
    }

    function showFeedback(message, type) {
      if (!feedback) return;
      feedback.textContent = message;
      feedback.classList.remove('success', 'error');
      feedback.classList.add('show', type);
    }

    function hideFeedback() {
      if (!feedback) return;
      feedback.textContent = '';
      feedback.classList.remove('show', 'success', 'error');
    }

    /* ---------- FIELD-LEVEL EVENTS ---------- */
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.el) return;

      const eventType = field.el.tagName === 'SELECT' ? 'change' : 'input';

      field.el.addEventListener(eventType, () => {
        // Only validate on the fly if the field already has an error showing
        // OR after the field has been touched by submit.
        if (field.el.classList.contains('is-invalid')) {
          const errorMsg = field.validate(field.el.value);
          setFieldError(field, errorMsg);
        }
      });

      // Blur validation for required fields
      field.el.addEventListener('blur', () => {
        if (field.el.value || field.el.required) {
          const errorMsg = field.validate(field.el.value);
          setFieldError(field, errorMsg);
        }
      });
    });

    /* ---------- DATE MIN ATTRIBUTE ---------- */
    function setMinTravelDate() {
      if (!travelDateInput) return;
      const today = new Date();
      // Offset to local ISO date
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const iso = yyyy + '-' + mm + '-' + dd;
      travelDateInput.setAttribute('min', iso);
    }
    setMinTravelDate();

    /* ---------- SUBMIT HANDLER ---------- */
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideFeedback();

      let firstInvalidEl = null;
      let valid = true;

      Object.keys(fields).forEach((key) => {
        const field = fields[key];
        if (!field.el) return;

        const errorMsg = field.validate(field.el.value);
        if (errorMsg) {
          setFieldError(field, errorMsg);
          valid = false;
          if (!firstInvalidEl) firstInvalidEl = field.el;
        } else {
          setFieldError(field, '');
        }
      });

      if (!valid) {
        showFeedback(
          'Please correct the highlighted fields and try again.',
          'error'
        );
        if (firstInvalidEl) {
          firstInvalidEl.focus();
          firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // SUCCESS (frontend only — no data sent)
      showFeedback(
        'Thank you! Your enquiry has been validated. ' +
        'Note: this is a frontend demonstration — no data has been sent or stored.',
        'success'
      );

      contactForm.reset();
      // Clear all field states after reset
      Object.keys(fields).forEach((key) => clearFieldState(fields[key]));
      setMinTravelDate();
    });

    /* ---------- RESET HANDLER ---------- */
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Defer to let native reset run first
        setTimeout(() => {
          Object.keys(fields).forEach((key) => clearFieldState(fields[key]));
          hideFeedback();
          setMinTravelDate();
        }, 0);
      });
    }
  }

  /* ========================================================
     NEWSLETTER FORM (homepage)
     ======================================================== */
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    const emailInput = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    function showNewsletterMessage(message, type) {
      if (!newsletterFeedback) return;
      newsletterFeedback.textContent = message;
      newsletterFeedback.classList.remove('success', 'error');
      newsletterFeedback.classList.add(type);
    }

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!emailInput) return;

      const value = emailInput.value.trim();
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!value) {
        showNewsletterMessage('Please enter your email address.', 'error');
        emailInput.focus();
        return;
      }

      if (!pattern.test(value)) {
        showNewsletterMessage('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }

      // Success — demonstration only
      showNewsletterMessage(
        'Thanks! This is a demonstration — your email has not been saved or subscribed.',
        'success'
      );
      newsletterForm.reset();
    });

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (newsletterFeedback) {
          newsletterFeedback.textContent = '';
          newsletterFeedback.classList.remove('success', 'error');
        }
      });
    }
  }
})();