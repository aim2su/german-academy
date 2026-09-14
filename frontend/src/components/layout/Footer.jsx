import { Link } from "react-router-dom";
import { FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import Container from "../ui/Container";
import { contacts } from "../../data/contacts";
import { Clock, MapPin, Phone, Mail } from "lucide-react";  

export default function Footer() {
  const messengers = [
    {
      icon: FaTelegramPlane,
      label: "Telegram",
      href: contacts.socials.telegram,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: contacts.socials.whatsapp,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: contacts.socials.instagram,
      color: "bg-pink-500 hover:bg-pink-600",
    },
  ];

  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-white">
      <Container className="flex flex-col items-center pt-14 pb-10">
        <Link
          to="/"
          aria-label="Tojikon Olmon — на главную"
          className="inline-block"
        >
          <img
            src="/images/logodark.svg"
            alt="Tojikon Olmon"
            className="h-16 w-auto sm:h-18"
          />
        </Link>
        <p className="mt-5 max-w-xl text-center text-sm leading-relaxed text-white/70">
          Учебный центр немецкого языка в Душанбе. От A1 до C1, помощь в
          получении Ausbildung-контракта и полное сопровождение до визита в
          консульство.
        </p>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center gap-8 py-12">

<div className="flex justify-center gap-3">
  {messengers.map((m) => (
    <a
      key={m.label}
      href={m.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={m.label}
      title={m.label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all hover:border-brand-400 hover:text-brand-400"
    >
      <m.icon size={20} />
    </a>
  ))}
</div>

<div className="flex flex-col items-center gap-3 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-3">
  <a
    href={`tel:${contacts.phones[0].replace(/\s/g, "")}`}
    className="flex items-center gap-2 transition-colors hover:text-brand-400"
  >
    <Phone size={16} className="text-brand-400" />
    <span>{contacts.phones[0]}</span>
  </a>

  <div className="hidden h-4 w-px bg-white/20 sm:block" />

  <a
    href={`mailto:${contacts.email}`}
    className="flex items-center gap-2 transition-colors hover:text-brand-400"
  >
    <Mail size={16} className="text-brand-400" />
    <span>{contacts.email}</span>
  </a>

  <div className="hidden h-4 w-px bg-white/20 sm:block" />

  <div className="flex items-center gap-2">
    <Clock size={16} className="text-brand-400" />
    <span>{contacts.workHours}</span>
  </div>

  <div className="hidden h-4 w-px bg-white/20 sm:block" />

  <div className="flex items-center gap-2">
    <MapPin size={16} className="text-brand-400" />
    <span>{contacts.address}</span>
  </div>
</div>
        </Container>
      </div>

        <div className="border-t border-white/10">
          <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
            <span>
              © {new Date().getFullYear()} Tojikon Olmon. Все права защищены.
            </span>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="transition-colors hover:text-brand-400">
                Политика конфиденциальности
              </Link>
              <span className="hidden sm:inline">·</span>
              <span>Душанбе, Таджикистан</span>
            </div>
          </Container>
        </div>
    </footer>
  );
}