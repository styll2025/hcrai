/**
 * HCRAI cookie consent — first-party consent banner + preferences panel.
 *
 * Mount once per page:
 *   <x-import component-from-global-scope="cookie-consent" from="./cookie-consent.js"
 *             hint-size="0px,0px"></x-import>
 *
 * Reopen the panel from anywhere (e.g. a footer link):
 *   <a href="#cookie-preferences" data-cookie-preferences="true">Cookie preferences</a>
 *   or window.HCRAIConsent.open()
 *
 * Register an optional service so it only ever runs after consent:
 *   window.HCRAIConsent.register({
 *     id: 'ga4', category: 'analytics',
 *     load: () => { ...inject script... },
 *     unload: () => { ...remove cookies / disable... }
 *   });
 *
 * State is stored first-party (cookie + localStorage mirror) as
 * {version, status, categories, timestamp} and expires after 90 days.
 */
(() => {
  const KEY = 'hcrai_cookie_consent';
  const VERSION = 1;
  const DAYS = 90;
  const MAX_AGE_MS = DAYS * 24 * 60 * 60 * 1000;

  const CATEGORIES = [
    {
      id: 'necessary',
      name: 'Strictly necessary',
      required: true,
      desc: 'Needed for the website to work: page delivery, security and remembering this cookie choice. These are always on.'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      required: false,
      desc: 'Help us understand which pages and research are read, so we can improve them. Not set unless you turn them on.'
    }
  ];

  const OPTIONAL = CATEGORIES.filter(c => !c.required).map(c => c.id);
  const denyAll = () => OPTIONAL.reduce((o, id) => (o[id] = false, o), { necessary: true });
  const allowAll = () => OPTIONAL.reduce((o, id) => (o[id] = true, o), { necessary: true });

  /* ── storage (first-party cookie, localStorage mirror for file:// ) ── */

  function readRaw() {
    let raw = null;
    try {
      const m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]*)'));
      if (m) raw = decodeURIComponent(m[1]);
    } catch (e) {}
    if (!raw) { try { raw = localStorage.getItem(KEY); } catch (e) {} }
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function writeRaw(state) {
    const raw = JSON.stringify(state);
    try {
      document.cookie = KEY + '=' + encodeURIComponent(raw) +
        ';path=/;max-age=' + Math.floor(MAX_AGE_MS / 1000) + ';SameSite=Lax' +
        (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
    try { localStorage.setItem(KEY, raw); } catch (e) {}
  }

  function clearRaw() {
    try { document.cookie = KEY + '=;path=/;max-age=0;SameSite=Lax'; } catch (e) {}
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  /** Valid, non-expired, current-version state — otherwise null (banner shows). */
  function loadState() {
    const s = readRaw();
    if (!s || typeof s !== 'object' || !s.timestamp) return null;
    const expired = Date.now() - new Date(s.timestamp).getTime() > MAX_AGE_MS;
    if (expired || s.version !== VERSION) { clearRaw(); return null; }
    const cats = Object.assign(denyAll(), s.categories || {});
    cats.necessary = true;
    return { version: VERSION, status: s.status || 'dismissed', categories: cats, timestamp: s.timestamp };
  }

  /* ── consent API + service registry ── */

  const api = {
    categories: CATEGORIES,
    _state: loadState(),
    _services: [],
    _listeners: [],
    _loaded: {},

    get() { return this._state ? JSON.parse(JSON.stringify(this._state)) : null; },
    hasConsent(cat) { return !!(this._state && this._state.categories[cat]); },

    /** Register an optional service; runs immediately if already consented. */
    register(svc) {
      if (!svc || !svc.id || this._services.some(s => s.id === svc.id)) return;
      this._services.push(svc);
      this._sync();
    },

    onChange(cb) { if (typeof cb === 'function') this._listeners.push(cb); },

    save(categories, status) {
      const cats = Object.assign(denyAll(), categories || {});
      cats.necessary = true;
      this._state = {
        version: VERSION,
        status: status || 'custom',
        categories: cats,
        timestamp: new Date().toISOString()
      };
      writeRaw(this._state);
      this._sync();
      this._listeners.forEach(cb => { try { cb(this.get()); } catch (e) {} });
      document.dispatchEvent(new CustomEvent('hcrai-consent:change', { detail: this.get() }));
    },

    acceptAll() { this.save(allowAll(), 'accepted'); },
    rejectOptional() { this.save(denyAll(), 'rejected'); },
    /** Closing the banner is NOT consent: optional categories stay off. */
    dismiss() { this.save(denyAll(), 'dismissed'); },

    /** Forget the decision — banner shows again, optional services unloaded. */
    reset() {
      clearRaw();
      this._state = null;
      this._sync();
      this._listeners.forEach(cb => { try { cb(null); } catch (e) {} });
      document.dispatchEvent(new CustomEvent('hcrai-consent:change', { detail: null }));
    },

    open() { document.querySelectorAll('cookie-consent').forEach(el => el.openPanel && el.openPanel()); },

    /** Load newly-consented services, unload withdrawn ones. */
    _sync() {
      this._services.forEach(svc => {
        const allowed = this.hasConsent(svc.category);
        if (allowed && !this._loaded[svc.id]) {
          this._loaded[svc.id] = true;
          try { svc.load && svc.load(); } catch (e) { console.warn('[consent] load failed', svc.id, e); }
        } else if (!allowed && this._loaded[svc.id]) {
          this._loaded[svc.id] = false;
          try { svc.unload && svc.unload(); } catch (e) { console.warn('[consent] unload failed', svc.id, e); }
        }
      });
    }
  };

  window.HCRAIConsent = window.HCRAIConsent || api;

  /* ── element ── */

  const CSS = `
    :host { all: initial; font-family: 'Inter', system-ui, sans-serif; }
    * { box-sizing: border-box; }
    button { font: inherit; cursor: pointer; }
    .wrap { position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483000; display: flex; justify-content: center; padding: 16px; pointer-events: none; }
    .card { pointer-events: auto; width: 100%; max-width: 1100px; background: #FFFFFF; color: #14181A;
      border: 1px solid rgba(20,24,26,0.10); border-radius: 20px; box-shadow: 0 18px 48px rgba(20,24,26,0.20); overflow: hidden; }
    .body { padding: 26px 28px 22px; display: flex; gap: 24px; align-items: flex-start; }
    .copy { flex: 1 1 auto; min-width: 0; }
    h2 { font-family: 'Baloo 2', 'Inter', sans-serif; font-weight: 700; font-size: 21px; line-height: 1.2; margin: 0 0 8px; }
    p { font-size: 14.5px; line-height: 1.65; color: #3A3730; margin: 0; text-wrap: pretty; }
    p a { color: #14181A; text-decoration: underline; }
    .x { flex: 0 0 auto; width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(20,24,26,0.15);
      background: transparent; color: #14181A; display: flex; align-items: center; justify-content: center; line-height: 1; font-size: 16px; }
    .x:hover { background: #F2F2F0; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; padding: 0 28px 24px; }
    .btn { border-radius: 100px; padding: 13px 26px; font-family: 'Baloo 2', 'Inter', sans-serif; font-weight: 700; font-size: 15px; border: 1.5px solid #14181A; white-space: nowrap; }
    .btn.primary { background: #14181A; color: #D7E85B; }
    .btn.primary:hover { background: #000; }
    .btn.ghost { background: #FFFFFF; color: #14181A; }
    .btn.ghost:hover { background: #F2F2F0; }
    .btn.link { border-color: transparent; background: transparent; text-decoration: underline; padding: 13px 8px; }
    .btn.link:hover { color: #6B6558; }
    :focus-visible { outline: 3px solid #8FA829; outline-offset: 2px; }

    .scrim { position: fixed; inset: 0; z-index: 2147483001; background: rgba(20,24,26,0.55); display: flex; align-items: center; justify-content: center; padding: 20px; }
    .panel { width: 100%; max-width: 620px; max-height: 88vh; overflow: auto; background: #FFFFFF; color: #14181A; border-radius: 22px; padding: 30px 32px; }
    .panel h2 { font-size: 24px; margin-bottom: 10px; }
    .cat { border-top: 1px solid rgba(20,24,26,0.10); padding: 20px 0; display: flex; gap: 18px; align-items: flex-start; }
    .cat:last-of-type { border-bottom: 1px solid rgba(20,24,26,0.10); margin-bottom: 22px; }
    .cat h3 { font-family: 'Baloo 2', 'Inter', sans-serif; font-weight: 700; font-size: 17px; margin: 0 0 6px; }
    .cat p { font-size: 14px; }
    .always { font-size: 13px; font-weight: 600; color: #6B6558; white-space: nowrap; padding-top: 4px; }
    .sw { flex: 0 0 auto; width: 52px; height: 30px; border-radius: 100px; border: 1.5px solid #14181A; background: #FFFFFF; position: relative; padding: 0; }
    .sw[aria-checked="true"] { background: #14181A; }
    .knob { position: absolute; top: 3px; left: 3px; width: 21px; height: 21px; border-radius: 50%; background: #14181A; transition: transform .15s ease, background .15s ease; }
    .sw[aria-checked="true"] .knob { transform: translateX(21px); background: #D7E85B; }
    .panel .actions { padding: 0; }
    @media (max-width: 720px) {
      .wrap { padding: 10px; }
      .body { padding: 22px 20px 16px; gap: 14px; }
      .actions { padding: 0 20px 20px; }
      .btn, .btn.primary, .btn.ghost { width: 100%; text-align: center; }
      .panel { padding: 24px 20px; }
      .cat { flex-wrap: wrap; }
    }
  `;

  class CookieConsent extends HTMLElement {
    constructor() {
      super();
      this._root = this.attachShadow({ mode: 'open' });
      this._panelOpen = false;
      this._draft = null;
      this._onKey = this._onKey.bind(this);
      this._onExternalChange = () => this.render();
    }

    connectedCallback() {
      this.style.display = 'contents';
      document.addEventListener('keydown', this._onKey);
      document.addEventListener('hcrai-consent:change', this._onExternalChange);
      this._delegate = (e) => {
        const t = e.target.closest && e.target.closest('[data-cookie-preferences]');
        if (t) { e.preventDefault(); this.openPanel(); }
      };
      document.addEventListener('click', this._delegate);
      api._sync();
      this.render();
    }

    disconnectedCallback() {
      document.removeEventListener('keydown', this._onKey);
      document.removeEventListener('hcrai-consent:change', this._onExternalChange);
      document.removeEventListener('click', this._delegate);
    }

    openPanel() {
      const st = api.get();
      this._draft = st ? Object.assign({}, st.categories) : denyAll();
      this._panelOpen = true;
      this.render();
      const first = this._root.querySelector('.panel .sw, .panel .btn');
      if (first) first.focus();
    }

    closePanel() { this._panelOpen = false; this._draft = null; this.render(); }

    _onKey(e) { if (e.key === 'Escape' && this._panelOpen) this.closePanel(); }

    render() {
      const needsBanner = !api.get();
      if (!needsBanner && !this._panelOpen) { this._root.innerHTML = ''; return; }

      const style = `<style>${CSS}</style>`;
      let html = style;

      if (needsBanner && !this._panelOpen) {
        html += `
          <div class="wrap">
            <div class="card" role="dialog" aria-modal="false" aria-labelledby="cc-title" aria-describedby="cc-desc">
              <div class="body">
                <div class="copy">
                  <h2 id="cc-title">We use cookies</h2>
                  <p id="cc-desc">We use necessary cookies to keep this website working. With your permission, we may also use optional cookies to understand how the website is used and improve your experience. You can accept all cookies, reject optional cookies, or manage your preferences.</p>
                </div>
                <button class="x" data-act="dismiss" aria-label="Close and reject optional cookies">&#10005;</button>
              </div>
              <div class="actions">
                <button class="btn primary" data-act="accept">Accept all</button>
                <button class="btn ghost" data-act="reject">Reject optional cookies</button>
                <button class="btn link" data-act="manage">Manage preferences</button>
              </div>
            </div>
          </div>`;
      }

      if (this._panelOpen) {
        const cats = CATEGORIES.map(c => {
          const on = c.required ? true : !!(this._draft && this._draft[c.id]);
          const control = c.required
            ? `<span class="always">Always on</span>`
            : `<button class="sw" role="switch" aria-checked="${on}" data-toggle="${c.id}" aria-label="${c.name} cookies"><span class="knob"></span></button>`;
          return `<div class="cat"><div class="copy"><h3>${c.name}</h3><p>${c.desc}</p></div>${control}</div>`;
        }).join('');

        html += `
          <div class="scrim" data-act="scrim">
            <div class="panel" role="dialog" aria-modal="true" aria-labelledby="cc-panel-title">
              <div class="body" style="padding:0 0 6px;">
                <div class="copy">
                  <h2 id="cc-panel-title">Cookie preferences</h2>
                  <p>Choose which optional cookies this website may use. Necessary cookies cannot be switched off. You can change or withdraw your choice at any time from the &ldquo;Cookie preferences&rdquo; link in the footer.</p>
                </div>
                <button class="x" data-act="close-panel" aria-label="Close cookie preferences">&#10005;</button>
              </div>
              ${cats}
              <div class="actions">
                <button class="btn primary" data-act="save">Save preferences</button>
                <button class="btn ghost" data-act="accept">Accept all</button>
                <button class="btn ghost" data-act="reject">Reject optional cookies</button>
              </div>
            </div>
          </div>`;
      }

      this._root.innerHTML = html;
      this._root.querySelectorAll('[data-act], [data-toggle]').forEach(el => {
        el.addEventListener('click', (e) => this._act(e, el));
      });
    }

    _act(e, el) {
      const toggle = el.getAttribute('data-toggle');
      if (toggle) {
        this._draft = Object.assign(denyAll(), this._draft, { [toggle]: !this._draft[toggle] });
        this.render();
        const again = this._root.querySelector(`[data-toggle="${toggle}"]`);
        if (again) again.focus();
        return;
      }
      const act = el.getAttribute('data-act');
      if (act === 'scrim' && e.target !== el) return;
      switch (act) {
        case 'accept': api.acceptAll(); this._panelOpen = false; break;
        case 'reject': api.rejectOptional(); this._panelOpen = false; break;
        case 'dismiss': api.dismiss(); break;
        case 'manage': this.openPanel(); return;
        case 'save': api.save(this._draft, 'custom'); this._panelOpen = false; break;
        case 'close-panel':
        case 'scrim': this._panelOpen = false; break;
      }
      this._draft = null;
      this.render();
    }
  }

  if (!customElements.get('cookie-consent')) customElements.define('cookie-consent', CookieConsent);
})();
