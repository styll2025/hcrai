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

// Cookie consent: first-party preference stored for 90 days. Optional services
// (analytics, marketing) are registered here and only activated after consent.
var COOKIE_CONSENT = {
  cookieName: 'hcrai_cookie_consent',
  storageKey: 'hcrai_cookie_consent',
  version: 1,
  days: 90,
  categories: ['necessary', 'analytics', 'marketing']
};

// Optional services by category. Add a new service by listing it here and
// tagging the script/iframe with data-consent="<category>". Scripts should use
// type="text/plain" and data-consent-src until consent is granted.
var COOKIE_SERVICES = {
  analytics: [],
  marketing: [
    { id: 'youtube', type: 'iframe', selector: 'iframe[data-consent="marketing"]' }
  ]
};

function cookieConsentSecureAttr() {
  return window.location.protocol === 'https:' ? '; Secure' : '';
}

function cookieConsentMaxAgeSeconds() {
  return COOKIE_CONSENT.days * 24 * 60 * 60;
}

function cookieConsentTtlMs() {
  return COOKIE_CONSENT.days * 24 * 60 * 60 * 1000;
}

function defaultCookieConsent(status) {
  return {
    v: COOKIE_CONSENT.version,
    status: status || '',
    categories: {
      necessary: true,
      analytics: false,
      marketing: false
    },
    ts: new Date().toISOString()
  };
}

function parseCookieConsent(raw) {
  if (!raw) return null;
  try {
    var data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (data.v !== COOKIE_CONSENT.version || !data.ts) return null;
    var age = Date.now() - Date.parse(data.ts);
    if (!isFinite(age) || age < 0 || age > cookieConsentTtlMs()) return null;
    if (!data.categories || data.categories.necessary !== true) return null;
    data.categories.necessary = true;
    data.categories.analytics = !!data.categories.analytics;
    data.categories.marketing = !!data.categories.marketing;
    return data;
  } catch (err) {
    return null;
  }
}

function readCookieValue(name) {
  var prefix = name + '=';
  var parts = document.cookie.split(';');
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].replace(/^\s+/, '');
    if (part.indexOf(prefix) === 0) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return '';
}

function getStoredCookieConsent() {
  var fromCookie = parseCookieConsent(readCookieValue(COOKIE_CONSENT.cookieName));
  if (fromCookie) return fromCookie;
  try {
    return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT.storageKey));
  } catch (err) {
    return null;
  }
}

function persistCookieConsent(consent) {
  var encoded = encodeURIComponent(JSON.stringify(consent));
  document.cookie = COOKIE_CONSENT.cookieName + '=' + encoded +
    '; Max-Age=' + cookieConsentMaxAgeSeconds() +
    '; Path=/; SameSite=Lax' + cookieConsentSecureAttr();
  try {
    localStorage.setItem(COOKIE_CONSENT.storageKey, JSON.stringify(consent));
  } catch (err) {}
}

function clearStoredCookieConsent() {
  document.cookie = COOKIE_CONSENT.cookieName + '=; Max-Age=0; Path=/; SameSite=Lax' + cookieConsentSecureAttr();
  try {
    localStorage.removeItem(COOKIE_CONSENT.storageKey);
  } catch (err) {}
}

function hasCookieCategory(category) {
  if (category === 'necessary') return true;
  var consent = getStoredCookieConsent();
  return !!(consent && consent.categories && consent.categories[category]);
}

function activateConsentScripts(category) {
  var nodes = document.querySelectorAll('script[type="text/plain"][data-consent="' + category + '"]');
  for (var i = 0; i < nodes.length; i++) {
    var source = nodes[i];
    if (source.getAttribute('data-consent-loaded') === 'true') continue;
    var script = document.createElement('script');
    if (source.src || source.getAttribute('data-consent-src')) {
      script.src = source.src || source.getAttribute('data-consent-src');
    } else {
      script.textContent = source.textContent;
    }
    if (source.async) script.async = true;
    source.setAttribute('data-consent-loaded', 'true');
    source.parentNode.insertBefore(script, source.nextSibling);
  }
}

function loadConsentIframe(iframe) {
  var src = iframe.getAttribute('data-consent-src');
  if (!src) return;
  var wrap = iframe.parentNode;
  var placeholder = wrap ? wrap.querySelector('.consent-embed-placeholder') : null;
  iframe.setAttribute('src', src);
  iframe.removeAttribute('hidden');
  iframe.style.display = '';
  if (placeholder) placeholder.hidden = true;
}

function unloadConsentIframe(iframe) {
  var wrap = iframe.closest('.consent-embed') || iframe.parentNode;
  if (wrap && !wrap.querySelector('.consent-embed-placeholder')) {
    var placeholder = document.createElement('div');
    placeholder.className = 'consent-embed-placeholder';
    placeholder.innerHTML = '<p>This content is hosted by a third party and uses optional cookies.</p><button type="button" class="cookie-btn cookie-btn--primary" onclick="openCookiePreferences()">Manage cookie preferences</button>';
    wrap.appendChild(placeholder);
  }
  var placeholderNode = wrap ? wrap.querySelector('.consent-embed-placeholder') : null;
  iframe.removeAttribute('src');
  try { iframe.src = 'about:blank'; } catch (err) {}
  iframe.setAttribute('hidden', '');
  iframe.style.display = 'none';
  if (placeholderNode) placeholderNode.hidden = false;
}

function applyCookieConsent(consent) {
  var allowed = consent && consent.categories ? consent.categories : { necessary: true, analytics: false, marketing: false };
  COOKIE_CONSENT.categories.forEach(function (category) {
    if (category === 'necessary') return;
    var enabled = !!allowed[category];
    var taggedFrames = document.querySelectorAll('iframe[data-consent="' + category + '"]');
    for (var f = 0; f < taggedFrames.length; f++) {
      if (enabled) loadConsentIframe(taggedFrames[f]);
      else unloadConsentIframe(taggedFrames[f]);
    }
    if (enabled) activateConsentScripts(category);
  });
}

function saveCookieConsent(partial) {
  var consent = defaultCookieConsent(partial.status);
  if (partial.categories) {
    consent.categories.analytics = !!partial.categories.analytics;
    consent.categories.marketing = !!partial.categories.marketing;
  }
  persistCookieConsent(consent);
  applyCookieConsent(consent);
  hideCookieBanner();
  closeCookiePreferences();
  return consent;
}

function acceptAllCookies() {
  saveCookieConsent({
    status: 'accepted',
    categories: { analytics: true, marketing: true }
  });
}

function rejectOptionalCookies() {
  saveCookieConsent({
    status: 'rejected',
    categories: { analytics: false, marketing: false }
  });
}

function dismissCookieBanner() {
  saveCookieConsent({
    status: 'dismissed',
    categories: { analytics: false, marketing: false }
  });
}

function saveCustomCookiePreferences() {
  var analytics = document.getElementById('cookie-analytics');
  var marketing = document.getElementById('cookie-marketing');
  saveCookieConsent({
    status: 'custom',
    categories: {
      analytics: !!(analytics && analytics.checked),
      marketing: !!(marketing && marketing.checked)
    }
  });
}

function hideCookieBanner() {
  var banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.hidden = true;
    banner.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('cookie-banner-visible');
}

function showCookieBanner() {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.hidden = false;
  banner.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cookie-banner-visible');
}

function syncPreferenceToggles(consent) {
  var analytics = document.getElementById('cookie-analytics');
  var marketing = document.getElementById('cookie-marketing');
  var categories = consent && consent.categories ? consent.categories : { analytics: false, marketing: false };
  if (analytics) analytics.checked = !!categories.analytics;
  if (marketing) marketing.checked = !!categories.marketing;
}

function closeCookiePreferences() {
  var panel = document.getElementById('cookie-preferences');
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  panel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cookie-prefs-open');
  var trigger = closeCookiePreferences._trigger;
  if (trigger && typeof trigger.focus === 'function') trigger.focus();
}

function openCookiePreferences() {
  var panel = document.getElementById('cookie-preferences');
  if (!panel) return;
  closeCookiePreferences._trigger = document.activeElement;
  syncPreferenceToggles(getStoredCookieConsent());
  panel.hidden = false;
  panel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cookie-prefs-open');
  var heading = document.getElementById('cookie-preferences-title');
  if (heading) heading.focus();
}

function buildCookieConsentUI() {
  if (document.getElementById('cookie-banner')) return;

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-labelledby', 'cookie-banner-title');
  banner.setAttribute('aria-describedby', 'cookie-banner-copy');
  banner.hidden = true;
  banner.innerHTML =
    '<button type="button" class="cookie-banner__close" aria-label="Close cookie banner" onclick="dismissCookieBanner()">' +
      '<span aria-hidden="true">×</span>' +
    '</button>' +
    '<div class="cookie-banner__inner">' +
      '<div class="cookie-banner__text">' +
        '<h2 id="cookie-banner-title" class="cookie-banner__title">We use cookies</h2>' +
        '<p id="cookie-banner-copy" class="cookie-banner__copy">We use necessary cookies to keep this website working. Optional cookies are used only with your permission, to understand how the site is used. <button type="button" class="cookie-banner__inline" onclick="openCookiePreferences()">Manage preferences</button></p>' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="cookie-btn cookie-btn--primary" onclick="acceptAllCookies()">Accept all</button>' +
        '<button type="button" class="cookie-btn cookie-btn--secondary" onclick="rejectOptionalCookies()">Reject optional cookies</button>' +
      '</div>' +
    '</div>';

  var panel = document.createElement('div');
  panel.id = 'cookie-preferences';
  panel.className = 'cookie-prefs';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'cookie-preferences-title');
  panel.hidden = true;
  panel.innerHTML =
    '<div class="cookie-prefs__backdrop" onclick="closeCookiePreferences()"></div>' +
    '<div class="cookie-prefs__panel" role="document">' +
      '<div class="cookie-prefs__header">' +
        '<h2 id="cookie-preferences-title" class="cookie-prefs__title" tabindex="-1">Cookie preferences</h2>' +
        '<button type="button" class="cookie-banner__close" aria-label="Close cookie preferences" onclick="closeCookiePreferences()">' +
          '<span aria-hidden="true">×</span>' +
        '</button>' +
      '</div>' +
      '<p class="cookie-prefs__copy">Necessary cookies are always on. Optional cookies stay off unless you choose to enable them. You can change this at any time.</p>' +
      '<div class="cookie-prefs__list">' +
        '<div class="cookie-prefs__item">' +
          '<div>' +
            '<div class="cookie-prefs__label">Necessary cookies</div>' +
            '<p class="cookie-prefs__help">Required for the website to function, including remembering this cookie choice. These cannot be switched off.</p>' +
          '</div>' +
          '<label class="cookie-switch">' +
            '<input type="checkbox" checked disabled>' +
            '<span class="cookie-switch__ui" aria-hidden="true"></span>' +
            '<span class="visually-hidden">Necessary cookies, always enabled</span>' +
          '</label>' +
        '</div>' +
        '<div class="cookie-prefs__item">' +
          '<div>' +
            '<div class="cookie-prefs__label">Analytics cookies</div>' +
            '<p class="cookie-prefs__help">Help us understand how the website is used so we can improve it. These are optional and off by default.</p>' +
          '</div>' +
          '<label class="cookie-switch">' +
            '<input id="cookie-analytics" type="checkbox">' +
            '<span class="cookie-switch__ui" aria-hidden="true"></span>' +
            '<span class="visually-hidden">Enable analytics cookies</span>' +
          '</label>' +
        '</div>' +
        '<div class="cookie-prefs__item">' +
          '<div>' +
            '<div class="cookie-prefs__label">Marketing cookies</div>' +
            '<p class="cookie-prefs__help">Used by optional third-party content such as embedded videos. These are optional and off by default.</p>' +
          '</div>' +
          '<label class="cookie-switch">' +
            '<input id="cookie-marketing" type="checkbox">' +
            '<span class="cookie-switch__ui" aria-hidden="true"></span>' +
            '<span class="visually-hidden">Enable marketing cookies</span>' +
          '</label>' +
        '</div>' +
      '</div>' +
      '<div class="cookie-prefs__actions">' +
        '<button type="button" class="cookie-btn cookie-btn--primary" onclick="saveCustomCookiePreferences()">Save preferences</button>' +
        '<button type="button" class="cookie-btn cookie-btn--secondary" onclick="acceptAllCookies()">Accept all</button>' +
        '<button type="button" class="cookie-btn cookie-btn--secondary" onclick="rejectOptionalCookies()">Reject optional cookies</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);
  document.body.appendChild(panel);

  document.addEventListener('keydown', function (event) {
    var prefs = document.getElementById('cookie-preferences');
    if (!prefs || prefs.hidden) return;
    if (event.key === 'Escape') {
      closeCookiePreferences();
      return;
    }
    if (event.key !== 'Tab') return;
    var focusable = prefs.querySelectorAll('button, [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
    var list = [];
    for (var i = 0; i < focusable.length; i++) {
      if (focusable[i].offsetParent !== null || focusable[i] === document.activeElement) list.push(focusable[i]);
    }
    if (!list.length) return;
    var first = list[0];
    var last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initCookieConsent() {
  buildCookieConsentUI();
  var stored = getStoredCookieConsent();
  if (!stored) {
    clearStoredCookieConsent();
    applyCookieConsent(defaultCookieConsent(''));
    showCookieBanner();
    return;
  }
  applyCookieConsent(stored);
  hideCookieBanner();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
  initCookieConsent();
}
