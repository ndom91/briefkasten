!(function () {
  'use strict'
  var a = window.location,
    r = window.document,
    o = r.currentScript,
    l = o.getAttribute('data-api') || new URL(o.src).origin + '/api/event'

  function s(t, e) {
    t && console.warn('Ignoring Event: ' + t), e && e.callback && e.callback()
  }

  function t(t, e) {
    if (
      /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(a.hostname) ||
      'file:' === a.protocol
    )
      return s('localhost', e)
    if (
      (window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress) &&
      !window.__plausible
    )
      return s(null, e)
    try {
      if ('true' === window.localStorage.plausible_ignore)
        return s('localStorage flag', e)
    } catch (t) {}
    var i = {},
      n =
        ((i.n = t),
        (i.u = a.href),
        (i.d = o.getAttribute('data-domain')),
        (i.r = r.referrer || null),
        e && e.meta && (i.m = JSON.stringify(e.meta)),
        e && e.props && (i.p = e.props),
        new XMLHttpRequest())
    n.open('POST', l, !0),
      n.setRequestHeader('Content-Type', 'text/plain'),
      n.send(JSON.stringify(i)),
      (n.onreadystatechange = function () {
        4 === n.readyState &&
          e &&
          e.callback &&
          e.callback({
            status: n.status,
          })
      })
  }
  var e = (window.plausible && window.plausible.q) || []
  window.plausible = t
  for (var i, n = 0; n < e.length; n++) t.apply(this, e[n])

  function p() {
    i !== a.pathname && ((i = a.pathname), t('pageview'))
  }
  var c,
    u = window.history
  u.pushState &&
    ((c = u.pushState),
    (u.pushState = function () {
      c.apply(this, arguments), p()
    }),
    window.addEventListener('popstate', p)),
    'prerender' === r.visibilityState
      ? r.addEventListener('visibilitychange', function () {
          i || 'visible' !== r.visibilityState || p()
        })
      : p()
})()
