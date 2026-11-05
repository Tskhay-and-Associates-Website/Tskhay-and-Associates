import { nav, site, contactButton } from '../content/site.js';
import { openConsentSettings } from '../analytics.js';

// The footer lists the sections of this website only. The course and newsletter
// links (which open other websites) appear in the top menu, not here.
export default function Footer() {
  const year = new Date().getFullYear();
  // Internal pages only, with grouped items (e.g. Resources) flattened.
  const links = nav.flatMap((item) => item.children || [item]).filter((item) => !item.external);
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <img
          className="footer-logo"
          src={`${import.meta.env.BASE_URL}logo-tskhay-associates-white.png`}
          alt={site.name}
          width="154"
          height="20"
          loading="lazy"
        />
        <nav aria-label="Footer">
          <ul>
            {links.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href={contactButton.href}>{contactButton.label}</a>
            </li>
          </ul>
        </nav>
        <p className="copyright">
          © {year} {site.legalName}
          <button type="button" className="footer-cookie-link" onClick={openConsentSettings}>
            Cookie settings
          </button>
        </p>
      </div>
    </footer>
  );
}
