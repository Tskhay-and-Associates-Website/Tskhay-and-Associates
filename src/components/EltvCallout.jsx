import { eltvCallout } from '../content/eltv.js';

// Homepage band that points visitors to the eLTV simulator at /eltv/.
export default function EltvCallout() {
  return (
    <section className="section eltv-callout" aria-labelledby="eltv-callout-title">
      <div className="container">
        <div className="eltv-callout-card">
          <div>
            <p className="label">{eltvCallout.label}</p>
            <h2 id="eltv-callout-title">{eltvCallout.title}</h2>
            <p className="lead">{eltvCallout.body}</p>
          </div>
          <a className="button" href={`${import.meta.env.BASE_URL}eltv/`}>
            {eltvCallout.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
