import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  MapPin,
  Clock,
  Users,
  BookOpen,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

import Section from "../components/ui/Section";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Accordion from "../components/ui/Accordion";
import usePageTitle from "../hooks/usePageTitle";

import { courseProgram, formats, intensive } from "../data/courses";

const included = [
  {
    icon: BookOpen,
    title: "Учебные материалы",
    text: "Учебники, рабочие тетради, доступ к записям занятий и домашним заданиям.",
  },
  {
    icon: MessageCircle,
    title: "Разговорная практика",
    text: "На каждом уровне — диалоги, ролевые ситуации, разбор произношения.",
  },
  {
    icon: Users,
    title: "Мини-группы до 6 человек",
    text: "Преподаватель успевает уделить внимание каждому студенту.",
  },
  {
    icon: Clock,
    title: "Гибкий график",
    text: "Утренние, дневные и вечерние группы. Онлайн — в удобное время.",
  },
];

const courseFaq = [
  {
    q: "Как понять, с какого уровня начать?",
    a: "Пройдите тест на определение уровня или запишитесь на бесплатную консультацию — мы определим ваш уровень и подберём подходящую группу.",
  },
  {
    q: "Сколько длится один уровень?",
    a: "Каждый уровень — 2 месяца при стандартной нагрузке. Интенсив — 1 месяц вместо 2.",
  },
  {
    q: "Сколько человек в группе?",
    a: "Мини-группы до 6 человек. Это позволяет преподавателю уделить внимание каждому студенту.",
  },
  {
    q: "Можно ли учиться только онлайн?",
    a: "Да, у нас есть полностью онлайн-группы и смешанный формат. Офлайн-занятия проходят в Душанбе.",
  },
  {
    q: "Что если я пропустил занятие?",
    a: "Вы получаете запись занятия и материалы. Преподаватель поможет наверстать на следующем уроке или в индивидуальном порядке.",
  },
];

export default function CoursesPage() {
  usePageTitle("Курсы немецкого A1.1–C1.2");

  const discount = Math.round(
    (1 - courseProgram.price / courseProgram.oldPrice) * 100,
  );
  const intensiveDiscount = Math.round(
    (1 - intensive.price / intensive.oldPrice) * 100,
  );

  return (
    <>
      {/* Баннер скидки */}
      <div className="bg-brand-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-3 text-center text-sm font-medium sm:px-6 lg:px-8">
          🔥 Скидка на все курсы и интенсив — только до конца месяца!
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge className="mb-5">Курсы немецкого языка</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Программа{" "}
            <span className="text-brand-600">от A1.1 до C1.2</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
            10 уровней по 2 месяца. Мини-группы до 6 человек. Онлайн или
            офлайн — в удобное время.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/level-test" size="lg">
              Пройти тест уровня
              <ArrowRight size={18} />
            </Button>
            <Button as={Link} to="/contacts" size="lg" variant="outline">
              Записаться на консультацию
            </Button>
          </div>
        </div>
      </section>

      {/* Программа обучения — одна карточка */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Программа</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Все уровни немецкого
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            От первой буквы алфавита до свободного владения.
          </p>
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
                −{discount}%
              </span>
              <span className="ml-auto text-sm text-ink-500">
                за уровень · 2 месяца
              </span>
            </div>

            <Button
              as={Link}
              to="/contacts"
              size="lg"
              className="mt-6 w-full"
            >
              Записаться на курс
              <ArrowRight size={18} />
            </Button>
          </Card>
        </div>
      </Section>

      {/* Интенсив */}
      <Section className="bg-ink-50/50">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* <div>
            <Badge className="mb-4">Интенсив</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ускоренное обучение —{" "}
              <span className="text-brand-600">за 1 месяц вместо 2</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-700">
              Программа целого уровня за 1 месяц вместо 2. Занятия в
              мини-группах до 6 человек или индивидуально.
            </p>

            <ul className="mt-6 space-y-3">
              {intensive.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-ink-900"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-brand-600"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div> */}

          <Card className="flex flex-col p-8">
            <Badge className="mb-5 self-start">
              Специальное предложение
            </Badge>
            <h3 className="text-2xl font-bold">Интенсив</h3>
            <p className="mt-1 text-sm text-ink-500">
              Группы до 6 человек или индивидуально
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">
              {intensive.description}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-4xl font-extrabold text-ink-900">
                {intensive.price} смн
              </span>
              <span className="text-base text-ink-500 line-through">
                {intensive.oldPrice} смн
              </span>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                −{intensiveDiscount}%
              </span>
            </div>
            <div className="mt-2 text-sm text-ink-500">
              за уровень · {intensive.duration}
            </div>

            <Button
              as={Link}
              to="/contacts"
              size="lg"
              className="mt-6 w-full"
            >
              Записаться на интенсив
              <ArrowRight size={18} />
            </Button>
          </Card>
        </div>
      </Section>

      {/* Форматы */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Форматы обучения</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Онлайн или офлайн
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            Оба формата дают одинаковый результат. Выбирайте по удобству.
          </p>
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
                  <h3 className="mb-2 text-lg font-semibold">
                    {format.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-700">
                    {format.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Что входит */}
      <Section className="bg-ink-50/50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Включено в курс</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Что входит в обучение
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {included.map((item) => (
            <Card key={item.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <item.icon size={22} />
              </div>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-ink-700">
                {item.text}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge className="mb-4">Вопросы об обучении</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Частые вопросы
            </h2>
          </div>
          <div className="mt-10">
            <Accordion items={courseFaq} />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-ink-100 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-14">
            <Badge className="mb-4">Тест уровня</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Не знаете, какой уровень выбрать?
            </h2>
            <p className="mt-4 text-base text-ink-700 sm:text-lg">
              Пройдите короткий тест — мы определим ваш уровень и предложим
              подходящую группу.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/level-test" size="lg">
                Пройти тест
                <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/contacts" size="lg" variant="outline">
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}