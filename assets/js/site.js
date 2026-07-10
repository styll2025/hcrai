function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('is-open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('is-open');
}

var CONTACT_FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyQ2JqqZFd00Bhyq3wHTZFSAcCSp7m-hTyRLD9s2prpPb_2BYvt6v8EpYncnkc4hGVdtQ/exec';

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

// Article pages: "notify me" email signup. No backend is wired up yet (see
// README) — this only gives visual confirmation client-side and does not
// actually collect or send the email address anywhere.
function handleNotifySignup(event) {
  event.preventDefault();
  var form = event.target;
  var input = form.querySelector('input[type="email"]');
  var btn = form.querySelector('button[type="submit"]');
  if (!input || !input.value || !btn) return;
  var original = btn.textContent;
  btn.textContent = 'Thanks!';
  input.value = '';
  setTimeout(function () { btn.textContent = original; }, 2500);
}
