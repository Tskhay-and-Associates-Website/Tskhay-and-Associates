// Google Analytics 4 with a consent banner.
// GA is not loaded, and sets no cookies, until the visitor clicks "Accept".
// The choice is remembered in this browser. "Cookie settings" in the footer
// clears it so the banner shows again.

const GA_ID = 'G-ZB7D6NZ9JJ';
const KEY = 'ta-analytics-consent'; // 'granted' | 'denied'

function readChoice() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function saveChoice(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* private browsing: the banner will simply show again next visit */
  }
}

let loaded = false;
function loadGA() {
  if (loaded || !GA_ID) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function removeBanner() {
  document.getElementById('consent-banner')?.remove();
}

function showBanner() {
  if (document.getElementById('consent-banner')) return;
  const el = document.createElement('div');
  el.id = 'consent-banner';
  el.className = 'consent-banner';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Cookie consent');
  el.innerHTML = `
    <p>We use Google Analytics cookies to understand how visitors use this site. Nothing is collected unless you accept.</p>
    <div class="consent-actions">
      <button type="button" class="button button-small" data-consent="granted">Accept</button>
      <button type="button" class="button button-outline button-small" data-consent="denied">Decline</button>
    </div>`;
  el.addEventListener('click', (e) => {
    const choice = e.target.closest('[data-consent]')?.dataset.consent;
    if (!choice) return;
    saveChoice(choice);
    removeBanner();
    if (choice === 'granted') loadGA();
  });
  document.body.appendChild(el);
}

// Reopens the banner (used by "Cookie settings" in the footer).
export function openConsentSettings() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  showBanner();
}

export function initAnalytics() {
  const choice = readChoice();
  if (choice === 'granted') loadGA();
  else if (choice !== 'denied') showBanner();
}
