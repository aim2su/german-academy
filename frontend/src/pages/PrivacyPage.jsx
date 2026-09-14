import { Mail, Phone, MapPin } from "lucide-react";

import Section from "../components/ui/Section";
import Badge from "../components/ui/Badge";
import usePageTitle from "../hooks/usePageTitle";
import { contacts } from "../data/contacts";

export default function PrivacyPage() {
  usePageTitle("Политика конфиденциальности");

  return (
    <>
      <section className="border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge className="mb-5">Документы</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Политика <span className="text-brand-600">конфиденциальности</span>
          </h1>
        </div>
      </section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          <div>
            <h2 className="mb-4 text-2xl font-bold">
              Что вы нам оставляете
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                Мы сохраняем только те данные, которые вы указываете в форме: имя, телефон и эл. почту. Они нужны, чтобы связаться с вами, проконсультировать и подобрать курс. Мы не передаём данные третьим лицам.
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold">Зачем нам это</h2>
            <div className="space-y-4 text-base leading-relaxed text-ink-700">
              <p>Только чтобы:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>позвонить или написать вам по заявке</li>
                <li>рассказать про курсы и наши услуги</li>
                <li>подобрать удобную группу и график</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Cookie</h2>
            <div className="space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                Мы используем только технические cookie — они нужны, чтобы
                сайт работал. Рекламных и следящих cookie у нас нет.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Ваши права</h2>
            <div className="space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                Хотите узнать, что мы о вас храним, исправить или удалить —
                просто напишите или позвоните. Мы всё сделаем.
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">
              Как с нами связаться
            </h2>

            <div className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-ink-50/50 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Email
                  </div>
                  <a
                    href={`mailto:${contacts.email}`}
                    className="mt-1 block text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    {contacts.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Телефон
                  </div>
                  <a
                    href={`tel:${contacts.phones[0].replace(/\s/g, "")}`}
                    className="mt-1 block text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    {contacts.phones[0]}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Адрес
                  </div>
                  <div className="mt-1 text-sm font-medium text-ink-900">
                    {contacts.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}