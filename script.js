// desktop mode identifier
(() => {
    window.isDesktopMode = () => {
        if (window.SettingsBridge?.isDesktopModeForced?.()) return true;
        return document.querySelector('html[id="facebook"]') !== null;
    }
})();

// Feed identifier
(() => {
    window.isFeed = () => {
    const isHomeUrl = window.location.pathname === '/' &&
        (window.location.hostname === 'm.facebook.com' 
          || window.location.hostname === 'www.facebook.com'
          || window.location.hostname === 'web.facebook.com');

    if (window.isDesktopMode()) return isHomeUrl;

    const hasSpecialButton = Array.from(document.querySelectorAll('[role="button"] span'))
        .some(span => span.textContent === '󱥆');

    return isHomeUrl && hasSpecialButton;
};
})();





(function() {
    if (!window.isDesktopMode()) return;

    document.documentElement.style.fontSize = '18px';


    // do not stick the navbar by default
    (() => {
      const waitForBanner = () => new Promise(resolve => {
        const existing = document.querySelector('div[role="banner"]');
        if (existing) return resolve(existing);

        new MutationObserver((mutations, obs) => {
          for (const { addedNodes } of mutations) {
            for (const node of addedNodes) {
              if (node.nodeType === 1 && node.matches('div[role="banner"]')) {
                obs.disconnect();
                return resolve(node);
              }
            }
          }
        }).observe(document.body, { childList: true, subtree: true });
      });

      const forceAbsolute = el => {
        if (el?.classList.contains('xixxii4')) {
          el.style.setProperty('position', 'absolute', 'important');
        }
      };

      waitForBanner().then(banner => {
        const style = document.createElement('style');
        style.textContent = `
          div[role="banner"].xixxii4,
          div[role="banner"] .xixxii4 {
            position: absolute !important;
          }
        `;
        document.head.appendChild(style);

        forceAbsolute(banner);
        banner.querySelectorAll('.xixxii4').forEach(forceAbsolute);

        new MutationObserver(mutations => {
          for (const m of mutations) {
            if (m.type === 'childList') {
              m.addedNodes.forEach(n => {
                forceAbsolute(n);
                n.querySelectorAll?.('.xixxii4')?.forEach(forceAbsolute);
              });
            } else if (m.type === 'attributes' && m.attributeName === 'class') {
              forceAbsolute(m.target);
            }
          }
        }).observe(banner, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      });
    })();


    // remove "send" button to save space
    // remove the third element in the interaction bar if nb is 4
    (function() {
      const parentSelector = '.xbmvrgn.x1diwwjn';
      const childSelector = '.x10b6aqq.x1yrsyyn.xs83m0k';

      function checkAndRemoveThird(parent) {
        const children = parent.querySelectorAll(childSelector);
        if (children.length === 4) children[2].remove();
      }

      document.querySelectorAll(parentSelector).forEach(checkAndRemoveThird);

      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              if (node.matches(parentSelector)) {
                checkAndRemoveThird(node);
              }
              node.querySelectorAll(parentSelector).forEach(checkAndRemoveThird);
            }
          });
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    })();
})();


// Scroll to top on back-press at feed.
(() => {
    window.backHandlerNB = () => {

        const dialogs = document.querySelectorAll('div[role="dialog"]');
        const isMenu = document.querySelector('div[role="menu"]')

        function scrollToTop() {
            if (window.scrollY !== 0) {
              // to interrupt any current scroll event.
              document.body.style.overflow = 'hidden';
              setTimeout(() => {
                 document.body.style.overflow = '';
                 window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 30);
              return "scrolling";
           } else return "exit";
        }

        if (window.isDesktopMode()) {
            if (window.isFeed() && !isMenu && dialogs.length === 1)
                return scrollToTop();
            else if (isMenu || dialogs.length > 1) {
                const escapeEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                });
                window.dispatchEvent(escapeEvent);
                return "true";
            } else return "false"
        } else if (window.isFeed() && !isMenu && !dialogs.length) {
            return scrollToTop();
        } else return "false";
    }
})();

// Enable press and hold caption selection and apply custom selection color.
(() => {
  const makeSelectable = (el) => {
    if (el.closest('div[role="button"]')) return;
    el.style.userSelect = 'text';
    el.style.pointerEvents = 'auto';
  };

  const updateText = () => {
    document.querySelectorAll('.native-text').forEach(makeSelectable);
  };

  const selectionStyle = document.createElement('style');
  selectionStyle.textContent = `
    .native-text::selection {
      background: #ccc;
      color: black;
    }
  `;
  document.head.appendChild(selectionStyle);

  updateText();

  new MutationObserver(updateText).observe(document.body, {
    childList: true,
    subtree: true
  });
})();

// Enhance Loading Overlay Script
(function() {
    function applyOverlayStyle() {
        const overlays = document.querySelectorAll('.loading-overlay');
        overlays.forEach(overlay => {
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        });
    }
    applyOverlayStyle();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length)
                applyOverlayStyle();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

// Hide facebook download button at login page.
(function() {
    const element = document.querySelector('div[data-bloks-name="bk.components.Flexbox"].wbloks_1');
    if (element) element.remove();
})();

// Hide annoying bottom banners
(function() {
  if (window._bottomBannerObserverInit) return;
  window._bottomBannerObserverInit = true;

  const bannerObserver = new MutationObserver(() => {
    if (location.pathname === '/'
      && document.querySelector('div[role="button"][aria-label*="Facebook"]') === null) return;

    const element = document.querySelector('.bottom.fixed-container');
    if (
      element &&
      !element.hasAttribute('data-shift-on-keyboard-shown')
    ) {
      const heightAttr = element.getAttribute('data-actual-height');
      if (heightAttr && parseInt(heightAttr, 10) < 80) {
        element.style.display = 'none';
      }
    }
  });

  bannerObserver.observe(document.body, { childList: true, subtree: true });
})();


// Hold Effect Script
(function() {
  const style = document.createElement('style');
  style.innerHTML = '* { -webkit-tap-highlight-color: rgba(180, 180, 180, 0.35); }';
  document.head.appendChild(style);
})();


/* Application . */


(() => {
  const onReady = (fn) => {
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', fn);
     else fn();
  };

  onReady(() => {
    const BUTTON_ID = 'custom-settings-btn';
    const ICON_SVG = `
      <svg width="28" height="28" fill="%FILL%" viewBox="0 0 24 24">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"/>
      </svg>`;

    const getFillColor = () => {
      const color = document.querySelector('meta[name="theme-color"]')?.content?.toLowerCase();
      return color === '#ffffff' ? '#242526' : '#d0d0d0';
    };

    const updateButtonColor = () => {
      const svg = document.querySelector(`#${BUTTON_ID} svg`);
      if (svg) svg.setAttribute('fill', getFillColor());
    };

    const findInsertionPoint = () => {
  const iconSpan = Array.from(document.querySelectorAll('span'))
    .find(span => span.textContent === '󱥊');
  const container = iconSpan?.closest('div[role="button"]')?.parentNode;

  const desktopTarget = document.querySelector(
    '.x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z'
  );

  return { container, desktopTarget };
};

 const createButton = () => {
  const { desktopTarget } = findInsertionPoint();
  const btn = document.createElement('button');
  btn.id = BUTTON_ID;

  const baseStyle = `
    background: ${getFillColor() === '#242526' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.1)'};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  `;

  let iconSize;

  if (desktopTarget) {
    // Desktop
    btn.setAttribute('style', `
  ${baseStyle}
  position: relative;
  width: 40px;
  height: 40px;
  margin-left: 0;
  margin-right: 7px;
  padding: 0;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`);
    iconSize = 24; // ikon lebih kecil dari lingkaran → padding proporsional
  } else {
    // Mobile
    btn.setAttribute('style', `
      ${baseStyle}
      position: fixed;
      top: 5px;
      right: 100px;
      width: 37px;
      height: 37px;
      padding: 0;
      z-index: 9999;
    `);
    iconSize = 27; // dari 28 → 20, padding jadi ~6px tiap sisi
  }

  btn.innerHTML = ICON_SVG
    .replace('%FILL%', getFillColor())
    .replace('width="28" height="28"', `width="${iconSize}" height="${iconSize}"`);

  btn.onclick = () => SettingsBridge?.onSettingsToggle?.();
  return btn;
};

    const insertButton = () => {
      if (window.SettingsBridge?.isSettingsBtnEnabled && !window.SettingsBridge.isSettingsBtnEnabled()) return;
      if (document.getElementById(BUTTON_ID)) return;

      const { container, desktopTarget } = findInsertionPoint();
      const button = createButton();

      if (desktopTarget)
    desktopTarget.insertBefore(button, desktopTarget.children[1] || null);
else if (container)
    container.insertBefore(button, container.firstChild);
    };



    const applyCustomLogo = () => {
  if (!window.SettingsBridge?.isLogoHidden || !window.SettingsBridge.isLogoHidden()) return;

  const logoBtn = document.querySelector('div[role="button"][aria-label="Logo Facebook"]');
  if (!logoBtn) return;

  const customText = window.SettingsBridge?.A0R?.() || 'Facebook';
  const customColor = window.SettingsBridge?.A0L?.() || '#1877f2';

  const visual = logoBtn.querySelector('img, svg');
  if (visual && visual.style.visibility !== 'hidden') {
    visual.style.visibility = 'hidden';
  }

  let label = logoBtn.querySelector('.custom-logo-text');
  if (!label) {
    label = document.createElement('span');
    label.className = 'custom-logo-text';
    label.style.cssText = `
      position: absolute;
      top: 0; left: 6px;
      display: flex;
      align-items: center;
      height: 100%;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 25px;
      letter-spacing: -0.5px;
      white-space: nowrap;
      pointer-events: auto;
      z-index: 99999;
      cursor: pointer;
    `;
    logoBtn.style.position = 'relative';
    logoBtn.appendChild(label);
  }

  if (label.textContent !== customText) {
    label.textContent = customText;
  }
  if (label.style.color !== customColor) {
    label.style.color = customColor;
  }

  // Tambah handler klik ke label (bukan logoBtn) karena label ada di atas
  if (!label.dataset.drawerHandlerAttached) {
    label.dataset.drawerHandlerAttached = 'true';
    let lastTrigger = 0;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const now = Date.now();
      if (now - lastTrigger < 500) return; // cegah double-trigger dari pointerdown+touchstart
      lastTrigger = now;
      window.SettingsBridge?.openDrawer?.();
    };
    label.addEventListener('pointerdown', handler, { capture: true });
    label.addEventListener('touchstart', handler, { capture: true, passive: false });
  }
};


if (window.isFeed()) insertButton();
applyCustomLogo();

let scheduled = false;

const observer = new MutationObserver(() => {
  if (scheduled) return;
  scheduled = true;

  requestAnimationFrame(() => {
    scheduled = false;

    const btn = document.getElementById(BUTTON_ID);

    if (window.isFeed()) {
      if (!btn) insertButton();
    } else {
      btn?.remove();
    }

    applyCustomLogo();
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

    // Observer for theme-color changes
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      new MutationObserver(updateButtonColor).observe(themeMeta, {
        attributes: true,
        attributeFilter: ['content'],
      });
    }
  });
})();


// Color Extraction Script
(function() {
    const meta = document.querySelector('meta[name="theme-color"]');
    const notify = () => window.ThemeBridge?.onThemeColorChanged?.(meta?.content ?? "null");
    if (meta) {
        notify();
        new MutationObserver(() => notify())
            .observe(meta, { attributes: true, attributeFilter: ['content'] });
    }
})();

// File Download Script
(function() {
    if (window._downloadBridgeInitialized) return;
    window._downloadBridgeInitialized = true;
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
        const reader = new FileReader();
        reader.onloadend = function() {
            if (reader.result)
                DownloadBridge.downloadBase64File(reader.result, blob.type);
        };
        reader.readAsDataURL(blob);
        return originalCreateObjectURL(blob);
    };
})(); 

(function() {
  const applyNavOrder = () => {
  const swapEnabled = window.SettingsBridge?.isNavSwapEnabled?.() ?? false;

  const logoBtn = document.querySelector('div[role="button"][aria-label="Logo Facebook"]');
  const homeIconSpan = Array.from(document.querySelectorAll('[role="button"] span'))
    .find(span => span.textContent === '󱥆');
  const homeRow = homeIconSpan?.closest('div[role="button"]')?.parentElement;

  if (!logoBtn || !homeRow) {
    alert('STOP: logoBtn=' + !!logoBtn + ' homeRow=' + !!homeRow);
    return;
  }

  const logoRow = logoBtn.parentElement;
  const commonAncestor = homeRow.parentElement;

  alert(
    'logoRow parent === commonAncestor? ' + (logoRow.parentElement === commonAncestor) + '\n' +
    'commonAncestor exists? ' + !!commonAncestor + '\n' +
    'swapEnabled: ' + swapEnabled + '\n' +
    'firstChild currently: ' + commonAncestor?.firstElementChild?.className
  );

  if (!commonAncestor || logoRow.parentElement !== commonAncestor) {
    alert('STOP: safety check gagal');
    return;
  }

  if (swapEnabled) {
    if (commonAncestor.firstElementChild !== logoRow) {
      commonAncestor.insertBefore(logoRow, homeRow);
      alert('SWAP DONE: logo dipindah ke atas');
    } else {
      alert('SKIP: logo sudah di atas');
    }
  } else {
    if (commonAncestor.firstElementChild !== homeRow) {
      commonAncestor.insertBefore(homeRow, logoRow);
    }
  }
};

  applyNavOrder();

  new MutationObserver(() => applyNavOrder()).observe(document.body, {
    childList: true,
    subtree: true
  });
})();    

if (!window._debugLayoutLogged) {
  window._debugLayoutLogged = true;
  setTimeout(() => {
    const logoBtn = document.querySelector('div[role="button"][aria-label="Logo Facebook"]');
    const homeIconSpan = Array.from(document.querySelectorAll('[role="button"] span'))
      .find(span => span.textContent === '󱥆');
    const homeRow = homeIconSpan?.closest('div[role="button"]')?.parentElement;

    const dumpChain = (el, label) => {
      let out = label + ':\n';
      let e = el;
      for (let i = 0; i < 6 && e; i++) {
        out += i + ': ' + e.tagName + (e.className ? '.' + String(e.className).substring(0,40) : '') + '\n';
        e = e.parentElement;
      }
      return out;
    };

    alert(
      'logoBtn found: ' + !!logoBtn + '\n' +
      'homeRow found: ' + !!homeRow + '\n\n' +
      dumpChain(logoBtn, 'LOGO CHAIN') + '\n' +
      dumpChain(homeRow, 'HOME CHAIN')
    );
  }, 2000);
}
