// Visitors who open this site inside an app's built-in browser (TikTok, Instagram,
// Facebook, ...) usually can't complete App Store hand-offs: tapping the download or
// offer button ends in an error. In those browsers only, show a short banner next to
// each App Store button explaining how to open the page in the real browser.
// Normal browsers are unaffected. Add ?inapp=1 to any page URL to preview the banner.
(function () {
  var ua = navigator.userAgent || '';
  var inApp = /TikTok|musical_ly|Bytedance|Instagram|FBAN|FBAV|FB_IAB|Snapchat|LinkedInApp|Pinterest/i.test(ua) ||
              /[?&]inapp=1(&|$)/.test(location.search);
  if (!inApp) return;

  // Link to copy: this page, without any query string or hash.
  var pageUrl = location.origin + location.pathname;

  function legacyCopy(field) {
    try {
      field.focus();
      field.select();
      field.setSelectionRange(0, field.value.length);
      return document.execCommand('copy');
    } catch (e) {
      return false;
    }
  }

  function buildNotice(action) {
    var box = document.createElement('div');
    box.className = 'promo-inapp';
    box.setAttribute('role', 'note');

    var h = document.createElement('h3');
    h.textContent = 'Open this page in your browser first';
    box.appendChild(h);

    var p = document.createElement('p');
    p.appendChild(document.createTextNode('You’re viewing this inside an app’s built-in browser, which can’t open the App Store. Tap '));
    p.appendChild(strong('⋯'));
    p.appendChild(document.createTextNode(' or the share icon and choose '));
    p.appendChild(strong('Open in browser'));
    p.appendChild(document.createTextNode(' (or '));
    p.appendChild(strong('Open in Safari'));
    p.appendChild(document.createTextNode('), then tap '));
    p.appendChild(strong(action));
    p.appendChild(document.createTextNode('.'));
    box.appendChild(p);

    var alt = document.createElement('p');
    alt.textContent = 'Or copy this page’s link, open Safari, and paste it in:';
    box.appendChild(alt);

    var row = document.createElement('div');
    row.className = 'promo-inapp-copy';

    var field = document.createElement('input');
    field.type = 'text';
    field.readOnly = true;
    field.value = pageUrl;
    field.className = 'promo-inapp-url';
    field.setAttribute('aria-label', 'Page link');
    field.addEventListener('focus', function () { field.select(); });

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary promo-copy';
    button.textContent = 'Copy link';

    function finish(ok) {
      button.textContent = ok ? 'Copied! Now paste it into Safari' : 'Press and hold the link to copy it';
      if (!ok) { field.focus(); }
    }

    button.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(function () { finish(true); }, function () { finish(legacyCopy(field)); });
      } else {
        finish(legacyCopy(field));
      }
    });

    row.appendChild(field);
    row.appendChild(button);
    box.appendChild(row);
    return box;
  }

  function strong(text) {
    var s = document.createElement('strong');
    s.textContent = text;
    return s;
  }

  // While the offer is showing, it gets one banner above its cards. Everywhere else,
  // one banner after each row of buttons that contains an App Store link.
  var offerGrid = document.querySelector('#black-friday .promo-grid');
  if (offerGrid) {
    offerGrid.parentNode.insertBefore(buildNotice('Get the offer'), offerGrid);
  }

  var rows = document.querySelectorAll('.hero-actions');
  Array.prototype.forEach.call(rows, function (row) {
    if (!row.querySelector('a[href*="apps.apple.com"]')) return;
    if (offerGrid && row.closest('#black-friday')) return;
    row.parentNode.insertBefore(buildNotice('Download on the App Store'), row.nextSibling);
  });
})();
