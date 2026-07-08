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
