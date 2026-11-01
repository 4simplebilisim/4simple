/*!
 * 4SIMPLE - cerez tercih katmani
 * Tercih kaydi disinda hicbir cerez yazilmaz. Zorunlu olmayan hicbir betik
 * onay verilmeden calistirilmaz.
 *
 * Yeni bir analitik/pazarlama betigi eklerken DOGRUDAN <script src=...> yazma.
 * Bunun yerine:
 *   <script type="text/plain" data-kvkk="analitik" src="..."></script>
 *   <script type="text/plain" data-kvkk="pazarlama">...kod...</script>
 * Bu betik, ilgili kategoriye onay verilmisse onlari calistirir; verilmemisse
 * hic dokunmaz. data-kvkk tasimayan satir ici betikler zorunlu sayilir.
 */
(function () {
  'use strict';

  var ADI = '4s_cerez';
  var SURUM = 1;
  var GUN = 365;
  var EN = (document.documentElement.lang || 'tr').toLowerCase().indexOf('en') === 0;

  // Kok alan adi: alt alanlarda yazilmis analitik cerezleri de silebilmek icin.
  var KOK = (function () {
    var h = location.hostname;
    var p = h.split('.');
    if (p.length <= 2 || /^\d+$/.test(p[p.length - 1])) return h;
    // 4simple.com.tr -> .4simple.com.tr  |  www.4simple.com.tr -> .4simple.com.tr
    var ikili = p.slice(-2).join('.');
    if (/^(com|net|org|gov|edu)\.[a-z]{2}$/.test(ikili)) return '.' + p.slice(-3).join('.');
    return '.' + ikili;
  })();

  var T = {
    baslik: EN ? 'Cookies on this site' : 'Bu sitede çerezler',
    metin: EN
      ? 'This site needs no cookies to work. We only store your choice below. Analytics cookies are used only if you accept them.'
      : 'Bu sitenin çalışması için çerez gerekmiyor. Yalnızca aşağıdaki tercihinizi saklıyoruz. Analitik çerezler ancak siz kabul ederseniz kullanılır.',
    kabul: EN ? 'Accept' : 'Kabul et',
    ret: EN ? 'Reject' : 'Reddet',
    tercih: EN ? 'Preferences' : 'Tercihler',
    kaydet: EN ? 'Save preferences' : 'Tercihleri kaydet',
    kapat: EN ? 'Close' : 'Kapat',
    pBaslik: EN ? 'Cookie preferences' : 'Çerez tercihleri',
    pMetin: EN
      ? 'Choose per category. You can change this at any time from the “Cookie preferences” link in the footer.'
      : 'Kategori bazında seçim yapabilirsiniz. Bu seçimi altbilgideki “Çerez Tercihleri” bağlantısından her zaman değiştirebilirsiniz.',
    zorunluAd: EN ? 'Strictly necessary' : 'Zorunlu',
    zorunluAc: EN
      ? 'Only the record of your cookie choice. Cannot be switched off; without it we would have to ask on every page.'
      : 'Yalnızca çerez tercihinizin kaydı. Kapatılamaz; olmazsa her sayfada tekrar sormak zorunda kalırız.',
    analitikAd: EN ? 'Analytics' : 'Analitik',
    analitikAc: EN
      ? 'Measuring how the site is used. Not in use on this site today; your choice is applied in advance and also covers the analytics cookie set by our application subdomain.'
      : 'Sitenin nasıl kullanıldığını ölçmek için. Bu sitede şu an kullanılmıyor; tercihiniz şimdiden uygulanır ve uygulama alt alanımızda yazılan analitik çerezi de kapsar.',
    pazarlamaAd: EN ? 'Marketing' : 'Pazarlama',
    pazarlamaAc: EN
      ? 'Measuring advertising and campaign performance. Not in use on this site today.'
      : 'Reklam ve kampanya ölçümü için. Bu sitede şu an kullanılmıyor.',
    acik: EN ? 'On' : 'Açık',
    kapali: EN ? 'Off' : 'Kapalı'
  };

  /* ---------- cerez okuma / yazma ---------- */

  function oku() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + ADI + '=([^;]*)'));
    if (!m) return null;
    try {
      var o = JSON.parse(decodeURIComponent(m[1]));
      return (o && o.v === SURUM) ? o : null;
    } catch (e) { return null; }
  }

  function yaz(o) {
    o.v = SURUM;
    o.t = new Date().toISOString().slice(0, 10);
    var son = new Date(Date.now() + GUN * 864e5).toUTCString();
    document.cookie = ADI + '=' + encodeURIComponent(JSON.stringify(o)) +
      ';path=/;expires=' + son + ';SameSite=Lax' +
      (location.protocol === 'https:' ? ';Secure' : '');
  }

  function sil(ad) {
    var yollar = ['/', location.pathname];
    var alanlar = ['', ';domain=' + KOK, ';domain=' + location.hostname];
    for (var i = 0; i < yollar.length; i++) {
      for (var j = 0; j < alanlar.length; j++) {
        document.cookie = ad + '=;path=' + yollar[i] + alanlar[j] +
          ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  }

  // Onay verilmemis kategorilere ait, baska yerde yazilmis cerezleri temizler.
  var DESENLER = {
    analitik: [/^ph_/, /^_ga/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/, /^_hj/, /^ym_/],
    pazarlama: [/^_fbp$/, /^_fbc$/, /^fr$/, /^_gcl/, /^IDE$/, /^li_/, /^_ttp$/]
  };

  function temizle(t) {
    var adlar = document.cookie.split(';').map(function (c) {
      return c.split('=')[0].trim();
    }).filter(Boolean);
    var silinen = [];
    Object.keys(DESENLER).forEach(function (kat) {
      if (t[kat]) return;
      adlar.forEach(function (ad) {
        if (ad === ADI) return;
        DESENLER[kat].some(function (rx) {
          if (rx.test(ad)) { sil(ad); silinen.push(ad); return true; }
          return false;
        });
      });
    });
    return silinen;
  }

  /* ---------- bekleyen betikleri calistirma ---------- */

  function betikleriAc(t) {
    var liste = document.querySelectorAll('script[type="text/plain"][data-kvkk]');
    Array.prototype.forEach.call(liste, function (eski) {
      var kat = eski.getAttribute('data-kvkk');
      if (!t[kat]) return;
      var yeni = document.createElement('script');
      Array.prototype.forEach.call(eski.attributes, function (a) {
        if (a.name !== 'type' && a.name !== 'data-kvkk') yeni.setAttribute(a.name, a.value);
      });
      if (!eski.src) yeni.text = eski.textContent;
      eski.parentNode.replaceChild(yeni, eski);
    });
  }

  function uygula(t) {
    temizle(t);
    betikleriAc(t);
    try {
      document.dispatchEvent(new CustomEvent('kvkk:tercih', { detail: t }));
    } catch (e) { /* eski tarayici */ }
  }

  /* ---------- arayuz ---------- */

  var STIL = [
    '.kv-bar,.kv-mdl{font-family:inherit;color:#152341;box-sizing:border-box}',
    '.kv-bar *,.kv-mdl *{box-sizing:border-box}',
    '.kv-bar{position:fixed;left:0;right:0;bottom:0;z-index:9998;background:#fff;',
    'border-top:1px solid #C6D2E2;box-shadow:0 -6px 28px rgba(21,35,65,.10);padding:18px 20px}',
    '.kv-in{max-width:1120px;margin:0 auto;display:flex;gap:22px;align-items:center;flex-wrap:wrap}',
    '.kv-tx{flex:1 1 380px;min-width:260px}',
    '.kv-tx h2{margin:0 0 5px;font-size:15px;font-weight:700;line-height:1.3}',
    '.kv-tx p{margin:0;font-size:13.5px;line-height:1.55;color:#4A5873}',
    '.kv-tx a{color:#2563C9}',
    '.kv-bt{display:flex;gap:10px;flex-wrap:wrap}',
    /* Ucu dugme de ayni: ayni boyut, ayni cerceve, ayni zemin, ayni yazi. */
    '.kv-b{appearance:none;cursor:pointer;font:inherit;font-size:14px;font-weight:600;',
    'padding:11px 22px;min-width:116px;text-align:center;border-radius:9px;',
    'border:1.5px solid #1B2B4B;background:#fff;color:#1B2B4B;line-height:1.2;transition:background .15s}',
    '.kv-b:hover{background:#EAF1FD}',
    '.kv-b:focus-visible{outline:3px solid #5B8DEF;outline-offset:2px}',
    '.kv-ov{position:fixed;inset:0;z-index:9999;background:rgba(21,35,65,.45);',
    'display:flex;align-items:center;justify-content:center;padding:20px}',
    '.kv-mdl{background:#fff;border-radius:16px;max-width:620px;width:100%;',
    'max-height:88vh;overflow:auto;padding:28px}',
    '.kv-mdl h2{margin:0 0 8px;font-size:21px;font-weight:700}',
    '.kv-mdl>p{margin:0 0 20px;font-size:14px;line-height:1.6;color:#4A5873}',
    '.kv-row{border:1px solid #E2E8F0;border-radius:12px;padding:15px 17px;margin-bottom:12px;',
    'display:flex;gap:16px;align-items:flex-start}',
    '.kv-row div{flex:1}',
    '.kv-row strong{display:block;font-size:14.5px;margin-bottom:3px}',
    '.kv-row span{font-size:13px;line-height:1.5;color:#5A6880}',
    '.kv-sw{flex:0 0 auto;display:flex;align-items:center;gap:9px;font-size:12.5px;color:#5A6880}',
    '.kv-sw input{width:18px;height:18px;accent-color:#2563C9;cursor:pointer}',
    '.kv-sw input:disabled{cursor:not-allowed;opacity:.65}',
    '.kv-end{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:18px}',
    '@media(max-width:640px){.kv-in{gap:14px}.kv-bt{width:100%}.kv-b{flex:1 1 auto}}'
  ].join('');

  function stilEkle() {
    if (document.getElementById('kv-stil')) return;
    var s = document.createElement('style');
    s.id = 'kv-stil';
    s.textContent = STIL;
    document.head.appendChild(s);
  }

  // Site alan adi kokunden yayinlandigi icin kok-mutlak yol en guvenlisi:
  // en/ ve blog/ altindan da dogru cozulur.
  function yol(dosya) {
    return (EN ? '/en/' : '/') + dosya;
  }

  var bar = null;

  function barKapat() {
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null;
  }

  function barGoster() {
    stilEkle();
    bar = document.createElement('section');
    bar.className = 'kv-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', T.pBaslik);
    bar.innerHTML =
      '<div class="kv-in"><div class="kv-tx"><h2>' + T.baslik + '</h2><p>' + T.metin +
      ' <a href="' + yol('cerez-politikasi.html') + '">' +
      (EN ? 'Cookie Policy' : 'Çerez Politikası') + '</a></p></div>' +
      '<div class="kv-bt">' +
      '<button type="button" class="kv-b" data-kv="kabul">' + T.kabul + '</button>' +
      '<button type="button" class="kv-b" data-kv="ret">' + T.ret + '</button>' +
      '<button type="button" class="kv-b" data-kv="tercih">' + T.tercih + '</button>' +
      '</div></div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-kv]');
      if (!b) return;
      var k = b.getAttribute('data-kv');
      if (k === 'kabul') { var t = { analitik: true, pazarlama: true }; yaz(t); uygula(t); barKapat(); }
      else if (k === 'ret') { var r = { analitik: false, pazarlama: false }; yaz(r); uygula(r); barKapat(); }
      else { panelAc(); }
    });
    document.body.appendChild(bar);
  }

  function panelAc() {
    stilEkle();
    var m = oku() || { analitik: false, pazarlama: false };
    var ov = document.createElement('div');
    ov.className = 'kv-ov';
    ov.innerHTML =
      '<div class="kv-mdl" role="dialog" aria-modal="true" aria-labelledby="kv-h">' +
      '<h2 id="kv-h">' + T.pBaslik + '</h2><p>' + T.pMetin + '</p>' +
      satir(T.zorunluAd, T.zorunluAc, 'zorunlu', true, true) +
      satir(T.analitikAd, T.analitikAc, 'analitik', m.analitik, false) +
      satir(T.pazarlamaAd, T.pazarlamaAc, 'pazarlama', m.pazarlama, false) +
      '<div class="kv-end">' +
      '<button type="button" class="kv-b" data-kv="iptal">' + T.kapat + '</button>' +
      '<button type="button" class="kv-b" data-kv="kaydet">' + T.kaydet + '</button>' +
      '</div></div>';

    function kapat() {
      document.removeEventListener('keydown', esc);
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    }
    function esc(e) { if (e.key === 'Escape') kapat(); }

    ov.addEventListener('click', function (e) {
      if (e.target === ov) return kapat();
      var b = e.target.closest('button[data-kv]');
      if (!b) return;
      if (b.getAttribute('data-kv') === 'kaydet') {
        var t = {
          analitik: ov.querySelector('[data-kat="analitik"]').checked,
          pazarlama: ov.querySelector('[data-kat="pazarlama"]').checked
        };
        yaz(t); uygula(t); barKapat();
      }
      kapat();
    });
    ov.addEventListener('change', function (e) {
      var i = e.target;
      if (!i.hasAttribute || !i.hasAttribute('data-kat')) return;
      var d = i.parentNode.querySelector('.kv-dr');
      if (d) d.textContent = i.checked ? T.acik : T.kapali;
    });
    document.addEventListener('keydown', esc);
    document.body.appendChild(ov);
    var ilk = ov.querySelector('input:not(:disabled)');
    if (ilk) ilk.focus();
  }

  function satir(ad, ac, kat, isaretli, kilit) {
    var id = 'kv-' + kat;
    return '<div class="kv-row"><div><strong>' + ad + '</strong><span>' + ac + '</span></div>' +
      '<label class="kv-sw" for="' + id + '"><input type="checkbox" id="' + id + '" data-kat="' + kat + '"' +
      (isaretli ? ' checked' : '') + (kilit ? ' disabled' : '') + '>' +
      (kilit ? T.acik : '<span class="kv-dr">' + (isaretli ? T.acik : T.kapali) + '</span>') + '</label></div>';
  }

  /* ---------- baslat ---------- */

  function baslat() {
    // Altbilgideki "Cerez Tercihleri" baglantisi.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-kvkk-tercih]');
      if (a) { e.preventDefault(); panelAc(); }
    });
    var t = oku();
    if (t) { uygula(t); } else { barGoster(); }
  }

  window.KVKK = {
    ac: panelAc,
    tercih: oku,
    uygula: uygula,
    // Tarayici kanitini kolaylastirmak icin: mevcut cerez adlari.
    dokum: function () {
      return document.cookie.split(';').map(function (c) { return c.split('=')[0].trim(); }).filter(Boolean);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', baslat);
  } else { baslat(); }
})();
