import { useEffect, useRef, useState } from 'react';
import { nav, site, home, contactButton } from '../content/site.js';

function NavLink({ item }) {
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer">
      {item.label}
      <span className="nav-external" aria-hidden="true">
        ↗
      </span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  ) : (
    <a href={item.href}>{item.label}</a>
  );
}

// A menu item with sub-links (e.g. Resources). Opens on click or Enter/Space,
// closes on Escape, on a click outside, or when focus leaves it.
function NavGroup({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const id = `menu-${item.label.toLowerCase().replace(/\W+/g, '-')}`;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <li
      className="nav-group"
      ref={ref}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="nav-group-toggle"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <span className="nav-caret" aria-hidden="true" />
      </button>
      {open && (
        <ul id={id} className="nav-menu">
          {item.children.map((child) => (
            <li key={child.href}>
              <NavLink item={child} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// The menu is always visible: one row beside the logo on wide screens,
// its own row under the logo on narrower screens.
export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href={home()}>
          <img
            src={`${import.meta.env.BASE_URL}logo-tskhay-associates.png`}
            alt={site.name}
            width="185"
            height="24"
          />
        </a>

        <nav className="site-nav" aria-label="Main">
          <ul>
            {nav.map((item) =>
              item.children ? (
                <NavGroup key={item.label} item={item} />
              ) : (
                <li key={item.href}>
                  <NavLink item={item} />
                </li>
              )
            )}
            <li>
              <a className="button button-outline button-small" href={contactButton.href}>
                {contactButton.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
