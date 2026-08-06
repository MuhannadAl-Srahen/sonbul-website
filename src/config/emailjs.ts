/**
 * EmailJS credentials for the contact form.
 *
 * Asserted at module scope so a deploy without them fails the build rather than shipping
 * a form whose every submission shows the generic error message. `.env` is gitignored, so
 * a fresh clone or a CI build with no dashboard variables would otherwise inline
 * `undefined` and nobody would notice until an enquiry went missing.
 *
 * These are PUBLIC_ by design — EmailJS public keys are meant to be exposed to the browser.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env for local work, or set it in the host's ` +
        `environment variables. The contact form cannot send without it.`,
    );
  }
  return value;
}

export const EMAILJS = {
  serviceId: required('PUBLIC_EMAILJS_SERVICE_ID', import.meta.env.PUBLIC_EMAILJS_SERVICE_ID),
  templateId: required('PUBLIC_EMAILJS_TEMPLATE_ID', import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID),
  publicKey: required('PUBLIC_EMAILJS_PUBLIC_KEY', import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY),
} as const;
