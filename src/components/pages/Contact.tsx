import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';

type Status = 'idle' | 'sending' | 'success' | 'error';

interface Props {
  lang: Lang;
}

export default function Contact({ lang }: Props) {
  const { t } = useLocale(lang);
  const [status, setStatus] = useState<Status>('idle');
  // When arriving via the "Get a Quote" button (/contact?subject=quote),
  // pre-fill the subject so the user lands on a quote request.
  const isQuote = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('subject') === 'quote';
  const defaultSubject = isQuote ? t('contact.quoteSubject') : '';

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const phone = data.get('phone') || '';
    const subject = data.get('subject');
    const message = data.get('message');

    const bodyText = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`;
    const mailtoHref = `mailto:info@abusonbul-transporters.com?subject=${encodeURIComponent(String(subject))}&body=${encodeURIComponent(bodyText)}`;

    setStatus('sending');
    try {
      window.location.href = mailtoHref;
      setTimeout(() => {
        setStatus('success');
        form.reset();
      }, 500);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        eyebrow={t('contact.hero.eyebrow')}
        title={t('contact.hero.title')}
        subtitle={t('contact.hero.subtitle')}
      />

      <section className="section">
        <div className="container-page grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-3xl bg-ink text-white p-8 md:p-10 h-full">
              <h3 className="font-display text-2xl mb-8">{t('contact.getInTouch')}</h3>
              <ul className="space-y-7">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">{t('contact.labels.office')}</p>
                    <p className="font-medium mt-1">{t('contact.info.address')}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">{t('contact.labels.email')}</p>
                    <a
                      href="mailto:info@abusonbul-transporters.com"
                      className="font-medium mt-1 block hover:text-primary-300 break-all"
                    >
                      info@abusonbul-transporters.com
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">{t('contact.labels.phone')}</p>
                    <a href="tel:+962795700658" className="font-medium mt-1 block hover:text-primary-300 transition-colors" dir="ltr">
                      {t('contact.info.phone')}
                    </a>
                    <a href="tel:+962799128641" className="font-medium mt-0.5 block hover:text-primary-300 transition-colors" dir="ltr">
                      {t('contact.info.phone2')}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">{t('contact.labels.hours')}</p>
                    <p className="font-medium mt-1">{t('contact.info.hours')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              className="card p-8 md:p-10 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <Field name="name" label={t('contact.form.name')} required />
                <Field name="email" type="email" label={t('contact.form.email')} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field name="phone" label={t('contact.form.phone')} />
                <Field name="subject" label={t('contact.form.subject')} defaultValue={defaultSubject} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
                />
              </div>
              <div className="pt-2 space-y-3">
                {status === 'success' && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    {t('contact.form.success')}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-sm text-red-600">{t('contact.form.error')}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
                    <Send className="h-4 w-4 rtl-flip" />
                  </button>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container-page">
          <Reveal>
            <div className="rounded-3xl overflow-hidden shadow-soft border border-ink-100">
              <iframe
                title={t('contact.mapTitle')}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.85!2d36.035675!3d31.854288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151b5b09f9d7dc0d%3A0x96d3444021cea3bb!2z2LQub5Cz7r-t2KrZiCDYo9io2Yj2s9mG2KjZhCDZhNmE2YbYp9qC2YQ!5e0!3m2!1sar!2sjo!4v1716000000000"
                width="100%"
                height="420"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">
        {label}{required && <span className="text-primary"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
      />
    </div>
  );
}
