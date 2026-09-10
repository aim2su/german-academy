import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { contacts } from "../../data/contacts";

const nav = [
  { to: "/", label: "Главная" },
  { to: "/courses", label: "Курсы" },
  { to: "/about", label: "О центре" },
  { to: "/level-test", label: "Тест уровня" },
  { to: "/contacts", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-brand-600" : "text-ink-700 hover:text-brand-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">

       <Link to="/" className="flex items-center gap-2" aria-label="Tojikon Olmon — на главную">
          <img
            src="/images/logo5.svg"
            alt="Tojikon Olmon"
            className="h-12 w-auto sm:h-14"
          />
        </Link>
        {/* <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
            TO
          </div>
          <span className="text-lg font-bold tracking-tight">Tojikon Olmon</span>
        </Link> */}

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${contacts.phones[0].replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-brand-600"
          >
            <Phone size={16} />
            {contacts.phones[0]}
          </a>
          <Button as={Link} to="/contacts">
            Оставить заявку
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <Container className="flex flex-col gap-4 py-4">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Button as={Link} to="/contacts" onClick={() => setOpen(false)}>
              Оставить заявку
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}