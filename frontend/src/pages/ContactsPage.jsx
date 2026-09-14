import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import Section from "../components/ui/Section";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import LeadForm from "../components/ui/LeadForm";
import usePageTitle from "../hooks/usePageTitle";
import MapView from "../components/ui/MapView";

import { contacts } from "../data/contacts";

export default function ContactsPage() {
  usePageTitle("Контакты");
  const contactItems = [
    {
      icon: Phone,
      label: "Телефоны",
      value: contacts.phones[0],
      href: `tel:${contacts.phones[0].replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: contacts.email,
      href: `mailto:${contacts.email}`,
    },
    {
      icon: MapPin,
      label: "Адрес",
      value: contacts.address,
      href: null,
    },
    {
      icon: Clock,
      label: "Часы работы",
      value: contacts.workHours,
      href: null,
    },
  ];



  const messengers = [
  {
    icon: FaTelegramPlane,
    label: "Telegram",
    href: contacts.socials.telegram,
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    href: contacts.socials.whatsapp,
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    href: contacts.socials.instagram,
  },
];

  return (
    <>
  
      <section className="border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge className="mb-5">Контакты</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Свяжитесь с нами{" "}
            <span className="text-brand-600">удобным способом</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
            Позвоните, напишите в мессенджер или оставьте заявку через форму
            — ответим в течение рабочего дня.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      
          <div>
            <h2 className="mb-6 text-2xl font-bold">Контактные данные</h2>

            <ul className="space-y-4">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <Card className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-1 block text-sm font-medium text-ink-900 hover:text-brand-600"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="mt-1 text-sm font-medium text-ink-900">
                          {item.value}
                        </div>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          <h3 className="mt-10 mb-4 text-lg font-semibold">
            Мы в мессенджерах
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {messengers.map((m) => (
              <a
                key={m.label}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={m.label}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-ink-100 bg-white px-3 py-5 text-center transition-all hover:border-brand-300 hover:shadow-sm"
              >
                <m.icon
                  size={24}
                  className="text-ink-500 transition-colors group-hover:text-brand-600"
                />
                <span className="text-xs font-medium text-ink-700 group-hover:text-brand-700">
                  {m.label}
                </span>
              </a>
            ))}
          </div>
          
          
          
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold">Оставить заявку</h2>
            <Card className="p-6 sm:p-8">
              <LeadForm />
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-ink-50/50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Как нас найти</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Мы в Душанбе
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            {contacts.address}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
  <img
    src="/images/classroom.webp"
    alt="Аудитория Tojikon Olmon в Душанбе"
    className="aspect-[3/2] w-full object-cover"
  />

  <div className="p-8 text-center">
    <h3 className="mb-2 text-lg font-semibold">Tojikon Olmon</h3>
    <p className="mb-6 text-sm text-ink-700">{contacts.address}</p>

    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      <a
        href="https://yandex.com/maps/?text=38.564021,68.810385"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Открыть в Яндекс.Картах
      </a>
      <a
        href="https://www.google.com/maps/search/?api=1&query=38.564021,68.810385"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-50"
      >
        Открыть в Google Maps
      </a>
    </div>
  </div>
</div>


      </Section>
    </>
  );
}