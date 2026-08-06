import { useState } from 'react';
import type { SubmitEvent } from 'react';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageHero from '../ui/PageHero';
import Reveal from '../ui/Reveal';
import { useLocale } from '../../i18n';
import type { Lang } from '../../i18n';
import { COMPANIES, type CompanyId } from '../../data/companies';
import { useQueryParam } from '../../hooks/useQueryParam';
import { companyIcons } from '../ui/companyIcons';
import { EMAILJS } from '../../config/emailjs';
import { EMAIL, PHONES } from '../../config/site';

type Status = 'idle' | 'sending' | 'success' | 'error';

interface Props {
  lang: Lang;
}

export default function Contact({ lang }: Props) {
  const { t } = useLocale(lang);
  const [status, setStatus] = useState<Status>('idle');
  // Arriving via "Get a Quote" (/contact?subject=quote) pre-fills the subject. Read
  // through the hook rather than off `window` during render — an inline read makes the
  // client's first paint disagree with the pre-rendered HTML.
  const defaultSubject = useQueryParam('subject') === 'quote' ? t('contact.quoteSubject') : '';

  // Which company page the visitor arrived from, carried through as context on the email.
  const paramCompany = useQueryParam('company');
  const company = COMPANIES.some((c) => c.id === paramCompany) ? (paramCompany as CompanyId) : '';

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '');
    const email = String(data.get('email') || '');
    const phone = String(data.get('phone') || '');
    const subject = String(data.get('subject') || '');
    const message = String(data.get('message') || '');
    const companyId = String(data.get('company') || '');
    // Send the readable name, not the slug — this lands in an inbox, not a database.
    const companyName = companyId ? t(`companies.${companyId}.name`) : '';

    setStatus('sending');
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          name,
          email,
          phone,
          subject,
          title: companyName ? `${subject} — ${companyName}` : subject,
          company: companyName,
          message,
          from_name: name,
          from_email: email,
          submitted_at: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Amman' }),
        },
        { publicKey: EMAILJS.publicKey },
      );
      setStatus('success');
      form.reset();
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

      {/* One desk answers for all three companies — say so before the form, so nobody
          wonders whether they are writing to the wrong part of the group. */}
      <section className="section-tight bg-sand">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">{t('contact.oneDesk.eyebrow')}</span>
            <h2 className="heading-lg mt-3">{t('contact.oneDesk.title')}</h2>
            <p className="lead mt-4">{t('contact.oneDesk.body')}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {COMPANIES.map((c, i) => {
              const Icon = companyIcons[c.id];
              return (
                <Reveal key={c.id} delay={i * 0.08}>
                  <div className="flex h-full items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5">
                    <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink">{t(`companies.${c.id}.name`)}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-500">
                        {t(`companies.${c.id}.tagline`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

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
                      href={`mailto:${EMAIL}`}
                      className="font-medium mt-1 block hover:text-primary-300 break-all"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/50">{t('contact.labels.phone')}</p>
                    <a href={`tel:${PHONES[0]}`} className="font-medium mt-1 block hover:text-primary-300 transition-colors" dir="ltr">
                      {t('contact.info.phone')}
                    </a>
                    <a href={`tel:${PHONES[1]}`} className="font-medium mt-0.5 block hover:text-primary-300 transition-colors" dir="ltr">
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
                <Field name="name" label={t('contact.form.name')} required autoComplete="name" />
                <Field
                  name="email"
                  type="email"
                  label={t('contact.form.email')}
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field
                  name="phone"
                  type="tel"
                  label={t('contact.form.phone')}
                  autoComplete="tel"
                  inputMode="tel"
                />
                {/* `key` remounts the uncontrolled input once the query param resolves —
                    defaultValue alone would never reach an already-mounted field. */}
                <Field
                  key={defaultSubject}
                  name="subject"
                  label={t('contact.form.subject')}
                  defaultValue={defaultSubject}
                  required
                />
              </div>
              {/* Which company's page the enquiry came from. Useful context for whoever
                  picks it up; not a choice we make the visitor take, because one team
                  answers for all three. */}
              <input type="hidden" name="company" value={company} />
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink mb-1.5">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
                />
              </div>
              {/* aria-live so a screen reader hears the outcome; without it the form
                  appears to do nothing on submit. */}
              <div className="pt-2 space-y-3" aria-live="polite">
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
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email';
}) {
  // `name` is unique per form, so it doubles as the id that ties the label to the input.
  // Without htmlFor/id a screen reader announces every field as "edit, blank", and tapping
  // the label does not focus the input.
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {required && (
          <span className="text-primary" aria-hidden>
            {' *'}
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full rounded-xl border border-ink-100 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition"
      />
    </div>
  );
}
