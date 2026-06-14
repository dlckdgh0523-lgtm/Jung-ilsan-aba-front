/* 정지은 일산 ABA — frontend API client + bootstrap.
 * Loaded as a plain <script> BEFORE the Babel app scripts. Exposes window.ABA_API
 * and window.__ABA_BOOT__ (a Promise that hydrates window.SITE_DATA from the API,
 * always resolving — on any failure the inlined static data is kept as a fallback).
 */
(function () {
  'use strict';

  // Same-origin in production (Nginx serves SPA + proxies /v1); localhost:4000 in dev.
  var API_BASE =
    typeof window.ABA_API_BASE === 'string'
      ? window.ABA_API_BASE
      : location.protocol === 'file:' || location.port === '5173'
        ? 'http://localhost:4000'
        : '';
  var PREFIX = '/v1';
  var TOKEN_KEY = 'aba-token';

  // Admin token in sessionStorage → cleared when the browser/tab closes (shared-PC safety).
  function token() { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function setToken(t) { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
  function urlFor(path) { return API_BASE + PREFIX + path; }

  async function request(method, path, body, opts) {
    opts = opts || {};
    var headers = Object.assign({}, opts.headers || {});
    var init = { method: method, headers: headers };
    if (body instanceof FormData) {
      init.body = body; // let the browser set the multipart boundary
    } else if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
    var t = token();
    if (t && !opts.noAuth) headers['Authorization'] = 'Bearer ' + t;

    var res = await fetch(urlFor(path), init);
    var text = await res.text();
    var data = null;
    if (text) { try { data = JSON.parse(text); } catch (e) { data = text; } }
    if (!res.ok) {
      // Expired / revoked token on an authed request → drop it and tell the app to show login.
      if (res.status === 401 && !opts.noAuth) {
        setToken('');
        try { window.dispatchEvent(new Event('aba-unauthorized')); } catch (e) {}
      }
      var err = new Error((data && data.error && data.error.message) || res.statusText || ('HTTP ' + res.status));
      err.status = res.status;
      err.code = data && data.error && data.error.code;
      err.fields = data && data.error && data.error.fields;
      err.body = data;
      throw err;
    }
    return data;
  }

  var api = {
    base: API_BASE,
    token: token,
    setToken: setToken,
    uuid: uuid,
    get: function (p, o) { return request('GET', p, undefined, o); },
    post: function (p, b, o) { return request('POST', p, b, o); },
    put: function (p, b, o) { return request('PUT', p, b, o); },
    patch: function (p, b, o) { return request('PATCH', p, b, o); },
    del: function (p, o) { return request('DELETE', p, undefined, o); },

    // ── auth ──
    login: async function (username, password) {
      var r = await request('POST', '/auth/login', { username: username, password: password }, { noAuth: true });
      if (r && r.token) setToken(r.token);
      return r;
    },
    logout: async function () { try { await request('POST', '/auth/logout'); } catch (e) {} setToken(''); },
    me: function () { return request('GET', '/auth/me'); },
    isAuthed: function () { return !!token(); },

    // ── consultations (public create; idempotent via per-submit key) ──
    createConsultation: function (payload, key) {
      return request('POST', '/consultations', payload, { noAuth: true, headers: { 'Idempotency-Key': key || uuid() } });
    },

    // ── uploads (admin) → { url, width, height, ... } ──
    upload: function (file) { var fd = new FormData(); fd.append('file', file); return request('POST', '/uploads', fd); },
    // ── file uploads (admin, non-image: xlsx/pdf/...) → { url, name, size, ext } ──
    uploadFile: function (file) { var fd = new FormData(); fd.append('file', file); return request('POST', '/uploads/file', fd); },

    // ── realtime (EventSource carries the JWT in the query — it can't set headers) ──
    sse: function (path) {
      var u = urlFor(path) + (path.indexOf('?') >= 0 ? '&' : '?') + 'token=' + encodeURIComponent(token());
      return new EventSource(u);
    },

    // ── visitor stats (fire-and-forget) ──
    hit: function () {
      try {
        var s = localStorage.getItem('aba-sid');
        if (!s) { s = uuid(); localStorage.setItem('aba-sid', s); }
        return request('POST', '/stats/hit', { path: location.pathname + location.hash, session: s }, { noAuth: true }).catch(function () {});
      } catch (e) {}
    },
  };
  window.ABA_API = api;

  // ── Bootstrap: hydrate window.SITE_DATA from the API. Never rejects. ──
  function unwrap(r) { return r && Array.isArray(r.items) ? r.items : r; }

  window.__ABA_BOOT__ = (async function () {
    var D = (window.SITE_DATA = window.SITE_DATA || {});
    try {
      var r = await Promise.allSettled([
        api.get('/site', { noAuth: true }),         // 0
        api.get('/hero', { noAuth: true }),         // 1
        api.get('/about', { noAuth: true }),        // 2
        api.get('/director', { noAuth: true }),     // 3
        api.get('/center-info', { noAuth: true }),  // 4
        api.get('/programs', { noAuth: true }),     // 5
        api.get('/therapists', { noAuth: true }),   // 6
        api.get('/notices', { noAuth: true }),      // 7
        api.get('/gallery', { noAuth: true }),      // 8
        api.get('/popups/active', { noAuth: true }),// 9
      ]);
      var val = function (i) { return r[i].status === 'fulfilled' ? r[i].value : null; };

      var site = val(0);
      if (site) {
        if (site.brand) D.brand = Object.assign({}, D.brand, site.brand);
        if (site.nav) D.nav = site.nav;
        if (site.sections) D.sections = site.sections;
      }
      var hero = unwrap(val(1)); if (hero) D.hero = hero;
      var about = val(2); if (about) D.about = Object.assign({}, D.about, about);
      var director = val(3); if (director) D.directorProfile = Object.assign({}, D.directorProfile, director);
      var center = val(4); if (center) D.centerInfo = Object.assign({}, D.centerInfo, center);
      var programs = unwrap(val(5)); if (programs) D.programs = programs;
      var therapists = unwrap(val(6)); if (therapists) D.therapists = therapists;
      var notices = unwrap(val(7)); if (notices) D.notices = notices;
      var gallery = unwrap(val(8)); if (gallery) D.gallery = gallery;
      var popups = unwrap(val(9)); if (popups) D.popups = popups;

      window.__ABA_LIVE__ = true;
    } catch (e) {
      console.warn('[ABA] API bootstrap failed — using inlined static data.', e);
      window.__ABA_LIVE__ = false;
    }
    return window.SITE_DATA;
  })();
})();
