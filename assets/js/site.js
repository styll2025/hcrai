function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('is-open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('is-open');
}

var CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyQ2JqqZFd00Bhyq3wHTZFSAcCSp7m-hTyRLD9s2prpPb_2BYvt6v8EpYncnkc4hGVdtQ/exec';
var NOTIFY_SIGNUP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzrCKh-iHAG0tmKEPUKol-s8-joX9HHw1mNV0EgW1ZTeOFAEL_slwj8_BNiUyvjwVYQBA/exec';

// Contact page: send submissions to the Google Sheet via Apps Script.
function handleContactSubmit(event) {
  event.preventDefault();
  var form = event.target;
  var success = document.getElementById('contact-success');
  var submitButton = form.querySelector('button[type="submit"]');
  var originalButtonText = submitButton ? submitButton.textContent : '';
  var formData = new FormData(form);

  formData.append('submittedAt', new Date().toISOString());
  formData.append('pageUrl', window.location.href);

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  fetch(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  }).then(function () {
    form.reset();
    form.classList.add('is-hidden');
    if (success) success.classList.add('is-visible');
  }).catch(function () {
    alert('Sorry, something went wrong. Please email contact@hcrai.com instead.');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

// Article pages: native Web Share API with a clipboard-copy fallback.
// Updates #share-label text temporarily if that element exists on the page.
function shareArticle(title) {
  var label = document.getElementById('share-label');
  var url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: title, url: url }).catch(function () {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function () {
      if (label) {
        var original = label.textContent;
        label.textContent = 'Link copied';
        setTimeout(function () { label.textContent = original; }, 2000);
      }
    }).catch(function () {});
  }
}

// Behavioural Risk article: collect newsletter signups through Apps Script.
function handleNotifySignup(event) {
  event.preventDefault();
  var form = event.target;
  var nameInput = form.querySelector('input[name="name"]');
  var emailInput = form.querySelector('input[name="email"]');
  var btn = form.querySelector('button[type="submit"]');
  var originalButtonText = btn ? btn.textContent : '';
  var payload = {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : ''
  };

  if (!payload.name || !payload.email) return;

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }

  fetch(NOTIFY_SIGNUP_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(function () {
    form.reset();
    if (btn) btn.textContent = 'Thanks!';
    setTimeout(function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalButtonText;
      }
    }, 2500);
  }).catch(function () {
    alert('Sorry, something went wrong. Please try again later.');
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalButtonText;
    }
  });
}
