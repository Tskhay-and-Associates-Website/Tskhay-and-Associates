import { clientWork } from '../content/site.js';
import { caseStudies } from '../content/caseStudies.js';

export default function ClientWork() {
  return (
    <section id="client-work" className="section section-alt" aria-labelledby="client-work-title">
      <div className="container">
        <div className={`client-intro${clientWork.photo ? '' : ' no-photo'}`}>
          <header className="section-head">
            <h2 id="client-work-title">{clientWork.title}</h2>
            <p className="section-intro">{clientWork.intro}</p>
          </header>
          {clientWork.photo && (
            <figure className="client-photo">
              <img
                src={clientWork.photo.src}
                alt={clientWork.photo.alt}
                width={clientWork.photo.width}
                height={clientWork.photo.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
          )}
        </div>

        <dl className="stats">
          {clientWork.stats.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="examples">
          <div className="examples-head">
            <h3>{clientWork.examplesTitle}</h3>
            {clientWork.examplesNote && <p className="muted">{clientWork.examplesNote}</p>}
          </div>
          <ul className="example-list">
            {clientWork.examples.map((e) => (
              <li key={e.title}>
                {e.context && <p className="example-context">{e.context}</p>}
                <h4>{e.title}</h4>
                <p>{e.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {caseStudies.length > 0 && (
          <div className="case-studies">
            <h3>Case studies</h3>
            <div className="case-grid">
              {caseStudies.map((c) => (
                <article key={c.title} className="case">
                  <p className="muted">{c.client}</p>
                  <h4>{c.title}</h4>
                  <dl>
                    <dt>Challenge</dt>
                    <dd>{c.challenge}</dd>
                    <dt>Approach</dt>
                    <dd>{c.approach}</dd>
                    <dt>Outcome</dt>
                    <dd>{c.outcome}</dd>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
