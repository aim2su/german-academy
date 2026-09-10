import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

import Section from "../components/ui/Section";
import Button from "../components/ui/Button";
import usePageTitle from "../hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Страница не найдена");

  return (
    <Section className="py-24 sm:py-32">
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-6 text-7xl font-extrabold tracking-tight text-brand-600 sm:text-9xl">
          404
        </div>
        <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
          Страница не найдена
        </h1>
        <p className="mb-8 text-base text-ink-700">
          Возможно, ссылка устарела или вы ошиблись в адресе. Давайте вернёмся
          на главную.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/" size="lg">
            <Home size={18} />
            На главную
          </Button>
          <Button as={Link} to="/courses" size="lg" variant="outline">
            <ArrowLeft size={18} />
            К курсам
          </Button>
        </div>
      </div>
    </Section>
  );
}