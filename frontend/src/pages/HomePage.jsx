import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  GraduationCap,
  Plane,
  Globe,
  MapPin,
  Quote,
} from "lucide-react";

import Section from "../components/ui/Section";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Accordion from "../components/ui/Accordion";

import { courseProgram, formats } from "../data/courses";
import { steps } from "../data/steps";
import { faq } from "../data/faq";
import { testimonials } from "../data/testimonials";

export default function HomePage() {
  usePageTitle("Немецкий от A1 до C1 и Ausbildung в Германии");
 // const previewCourses = courses.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div>
            <Badge className="mb-5">
              Немецкий A1–C1 · Ausbildung · Душанбе
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Немецкий от нуля до{" "}
              <span className="text-brand-600">контракта на Ausbildung</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700 sm:text-lg">
              Учебный центр <strong>Tojikon Olmon</strong>: учим немецкому
              онлайн и офлайн, помогаем найти работодателя в Германии и ведём
              вас по всем документам — до самого визита в консульство.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/contacts" size="lg">
                Получить консультацию
                <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/level-test" size="lg" variant="outline">
                Пройти тест уровня
              </Button>
            </div>


            <ul className="mt-8 grid gap-3 text-sm text-ink-700 sm:grid-cols-3">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0 text-brand-600" />
                <span>1 курс за 2 месяца</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0 text-brand-600" />
                <span>Онлайн и офлайн</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0 text-brand-600" />
                <span>Сопровождение до визы</span>
              </li>
            </ul>
          </div>

    
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-3xl bg-red-300 shadow-xl ring-1 ring-brand-100">
              <img
                src="/images/hero.webp"
                alt="Онлайн-занятие немецкого в Tojikon Olmon"
                className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl ring-1 ring-brand-100"
              />
            </div>
          </div>
        </Container>
      </section>

      <Section className="border-b border-ink-100">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { icon: GraduationCap, value: "A1 → C1", label: "Все уровни языка" },
            { icon: Clock, value: "2 месяца", label: "На уровень A1.1" },
            { icon: Users, value: "12–18 мес", label: "От нуля до контракта" },
            { icon: FileText, value: "100%", label: "Сопровождение документов" },
          ].map((item, i) => (
            <div key={i} className="text-center sm:text-left">
              <item.icon className="mx-auto mb-3 text-brand-600 sm:mx-0" size={24} />
              <div className="text-2xl font-bold sm:text-3xl">{item.value}</div>
              <div className="mt-1 text-sm text-ink-500">{item.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-ink-50/50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Наше отличие</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Не просто курсы немецкого
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            Обычные языковые школы довозят вас до сертификата и прощаются.
            Мы довозим до подписанного контракта на Ausbildung и визита в
            консульство.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-ink-100">
            <h3 className="mb-4 text-lg font-semibold text-ink-500">
              Обычные курсы
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Учат только языку",
                "Сертификат — и дальше сам",
                "Про Ausbildung никто не расскажет",
                "Документы собираешь самостоятельно",
                "К консулу идёшь без подготовки",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-500">
                  <XCircle size={18} className="mt-0.5 shrink-0 text-ink-300" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-brand-200 bg-brand-50/40">
            <h3 className="mb-4 text-lg font-semibold text-brand-700">
              Tojikon Olmon
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Язык A1–C1 + подготовка к Ausbildung",
                "Помогаем найти работодателя в Германии",
                "Резюме, мотивационное письмо, интервью",
                "Полное сопровождение по документам",
                "Тренировка интервью с консулом",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-900">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-600"
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Процесс</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Как это работает
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            Шесть шагов от первого звонка до визита в консульство.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.number} className="flex flex-col">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-base font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-ink-700">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ============ КУРСЫ (превью) ============ */}
<Section className="bg-ink-50/50">
  <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
    <div className="max-w-2xl">
      <Badge className="mb-4">Курсы</Badge>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Программа от A1.1 до C1.2
      </h2>
      <p className="mt-4 text-base text-ink-700 sm:text-lg">
        10 уровней по 2 месяца. Мини-группы до 6 человек. Онлайн или офлайн.
      </p>
    </div>
    <Button as={Link} to="/courses" variant="outline">
      Все курсы
      <ArrowRight size={16} />
    </Button>
  </div>

  <div className="mx-auto mt-12 max-w-4xl">
    <Card className="p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {courseProgram.levels.map((level) => (
          <span
            key={level}
            className="inline-flex items-center rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700"
          >
            {level}
          </span>
        ))}
      </div>

      <p className="mb-6 text-base leading-relaxed text-ink-700">
        {courseProgram.description}
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-ink-50 px-4 py-3 text-center">
          <Clock size={20} className="mx-auto mb-2 text-brand-600" />
          <div className="text-sm font-semibold">
            {courseProgram.duration}
          </div>
        </div>
        <div className="rounded-xl bg-ink-50 px-4 py-3 text-center">
          <Users size={20} className="mx-auto mb-2 text-brand-600" />
          <div className="text-sm font-semibold">
            Группы {courseProgram.groupSize}
          </div>
        </div>
        <div className="rounded-xl bg-ink-50 px-4 py-3 text-center">
          <Globe size={20} className="mx-auto mb-2 text-brand-600" />
          <div className="text-sm font-semibold">Онлайн и офлайн</div>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-ink-100 pt-6">
        <span className="text-3xl font-extrabold text-ink-900">
          {courseProgram.price} смн
        </span>
        <span className="text-base text-ink-500 line-through">
          {courseProgram.oldPrice} смн
        </span>
        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
          −{Math.round((1 - courseProgram.price / courseProgram.oldPrice) * 100)}%
        </span>
        <span className="ml-auto text-sm text-ink-500">
          за уровень · 2 месяца
        </span>
      </div>
    </Card>
  </div>
</Section>



      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Форматы</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Учитесь так, как удобно
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {formats.map((format, i) => {
            const Icon = i === 0 ? Globe : MapPin;
            return (
              <Card key={format.id} className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{format.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-700">
                    {format.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="bg-ink-50/50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Истории успеха</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Уже в Германии
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            Наши студенты уехали по Ausbildung в Гамбург, Мюнхен и Штутгарт.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="flex flex-col">
              <Quote size={28} className="mb-4 text-brand-300" />
              <p className="flex-1 text-sm leading-relaxed text-ink-700">
                {t.text}
              </p>
              <div className="mt-6 border-t border-ink-100 pt-4">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-ink-500">{t.city}</div>
                <Badge className="mt-3">{t.level}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Частые вопросы
            </h2>
            <p className="mt-4 text-base text-ink-700 sm:text-lg">
              Не нашли ответ? Напишите нам — ответим лично.
            </p>
          </div>
          <div className="mt-10">
            <Accordion items={faq} />
          </div>
        </div>
      </Section>

      <Section className="pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Plane size={28} className="mb-4 text-brand-400" />
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Готовы начать путь в Германию?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                Оставьте заявку — мы бесплатно проконсультируем, определим ваш
                уровень немецкого и составим план до контракта на Ausbildung.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button as={Link} to="/contacts" size="lg">
                Оставить заявку
                <ArrowRight size={18} />
              </Button>
              <Button
                as={Link}
                to="/level-test"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Тест уровня
              </Button>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
          />
        </div>
      </Section>
    </>
  );
}