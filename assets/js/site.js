function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('is-open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('is-open');
}

// Contact page: no backend is wired up yet (see README). This only swaps the
// visible UI state client-side; it does not send the message anywhere.
function handleContactSubmit(event) {
  event.preventDefault();
  var form = document.getElementById('contact-form');
  var success = document.getElementById('contact-success');
  if (form) form.classList.add('is-hidden');
  if (success) success.classList.add('is-visible');
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
