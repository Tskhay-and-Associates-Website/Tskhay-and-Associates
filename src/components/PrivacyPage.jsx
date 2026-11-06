import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { privacy } from '../content/privacy.js';

// The privacy policy page at /privacy/. Words live in src/content/privacy.js.
export default function PrivacyPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <article className="section legal-page" aria-labelledby="privacy-title">
          <div className="container legal-inner">
            <h1 id="privacy-title">{privacy.title}</h1>
            <p className="muted">Last updated: {privacy.updated}</p>
            <p className="lead">{privacy.intro}</p>
            {privacy.sections.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.body?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
                {s.after?.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
