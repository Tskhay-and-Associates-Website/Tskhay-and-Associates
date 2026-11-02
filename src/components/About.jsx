import { about, contactButton } from '../content/site.js';

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container about-grid">
        <figure className="about-photo">
          <img
            src={about.photo.src}
            alt={about.photo.alt}
            width={about.photo.width}
            height={about.photo.height}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="signature">
            <span className="signature-name">{about.signature}</span>
            <span className="signature-role">{about.signatureRole}</span>
            <span className="signature-role">{about.signatureCompany}</span>
          </figcaption>
        </figure>

        <div className="about-copy">
          <h2 id="about-title">{about.title}</h2>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <div className="actions about-actions">
            <a className="button" href={contactButton.href}>
              {contactButton.label}
            </a>
          </div>

          <div className="about-facts">
            <h3>{about.credentialsTitle}</h3>
            <ul className="plain-list">
              {about.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
