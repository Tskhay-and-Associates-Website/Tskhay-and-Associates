import { useEffect, useState } from 'react';
import { contactForm, formEndpoint, formService, site, visitorCopy } from '../content/site.js';

// The contact form shown in the Let's Talk section.
// The form service is set in src/content/site.js (formService and formEndpoint):
//   'formsubmit': sends the message to Konstantin and an automatic copy to the visitor.
//   'formspree':  sends the message straight to Konstantin.
//   none:         sending opens the visitor's email app with the message filled in.
export default function ContactForm() {
  const f = contactForm.fields;
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error | handoff
  const useFormSubmit = formService === 'formsubmit' && formEndpoint;
  const useFormspree = formService === 'formspree' && formEndpoint;

  // FormSubmit brings visitors back to the site with ?sent=1 after their message is sent.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') setStatus('sent');
  }, []);

  async function handleSubmit(e) {
    if (useFormSubmit) return; // a normal form post: FormSubmit takes it from here

    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!useFormspree) {
      const body = [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Company: ${data.get('company') || ''}`,
        '',
        data.get('message'),
      ].join('\n');
      const subject = `Website inquiry from ${data.get('name')}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('handoff');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-card" role="status">
        <p className="form-success">{contactForm.success}</p>
      </div>
    );
  }

  const returnUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${import.meta.env.BASE_URL}?sent=1#contact`
      : '';

  return (
    <form
      className="form form-card"
      method="POST"
      action={useFormSubmit || useFormspree ? formEndpoint : undefined}
      onSubmit={handleSubmit}
    >
      {useFormSubmit ? (
        <>
          <input type="hidden" name="_subject" value="New message from the T&A website" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_autoresponse" value={visitorCopy} />
          <input type="hidden" name="_next" value={returnUrl} />
          <p className="visually-hidden">
            <label>
              Leave this field empty <input name="_honey" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
        </>
      ) : (
        <>
          <input type="hidden" name="_subject" value="New message from the T&A website" />
          <p className="visually-hidden">
            <label>
              Leave this field empty <input name="_gotcha" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
        </>
      )}

      <div className="field">
        <label htmlFor="cf-name">{f.name}</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="cf-email">{f.email}</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="cf-company">{f.company}</label>
        <input id="cf-company" name="company" type="text" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="cf-message">{f.message}</label>
        <textarea id="cf-message" name="message" rows="5" required />
      </div>

      <button type="submit" className="button" disabled={status === 'sending'}>
        {status === 'sending' ? contactForm.sending : contactForm.submit}
      </button>
      <p className="form-error" role="alert">
        {status === 'error' ? contactForm.error : ''}
      </p>
      <p className="muted form-note">
        {status === 'handoff'
          ? contactForm.handoff
          : useFormSubmit || useFormspree
            ? contactForm.privacy
            : contactForm.mailNote}
      </p>
    </form>
  );
}
