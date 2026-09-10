import { Link } from "react-router-dom";
import {
  ArrowRight,
  Target,
  Heart,
  ShieldCheck,
  Users,
  GraduationCap,
  FileCheck2,
  Plane,
} from "lucide-react";

import Section from "../components/ui/Section";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import usePageTitle from "../hooks/usePageTitle";

const values = [
  {
    icon: Target,
    title: "Результат, а не просто сертификат",
    text: "Мы измеряем успех не сданным экзаменом, а подписанным контрактом и вашим отъездом в Германию.",
  },
  {
    icon: Heart,
    title: "Забота о каждом студенте",
    text: "Помогаем не только с языком, но и с мотивацией, документами, бытовыми вопросами на всём пути.",
  },
  {
    icon: ShieldCheck,
    title: "Честно и прозрачно",
    text: "Никаких обещаний «визы за месяц». Говорим реалистичные сроки и открыто о стоимости.",
  },
];

const stats = [
  { icon: Users, value: "200+", label: "Студентов обучаются сейчас" },
  {
    icon: GraduationCap,
    value: "A1 → C1",
    label: "Полная программа обучения",
  },
  { icon: FileCheck2, value: "50+", label: "Контрактов на Ausbildung" },
  { icon: Plane, value: "🇹🇯 → 🇩🇪", label: "Путь из Душанбе в Германию" },
];

const workSteps = [
  {
    title: "Индивидуальный подход",
    text: "Подбираем группу под ваш уровень и график, а не наоборот.",
  },
  {
    title: "Преподаватели с опытом",
    text: "Наши учителя профессионально владеют языком, а также имеют опыт в преподавании.",
  },
  {
    title: "Обучение + сопровождение",
    text: "Наша команда ведёт вас от первого урока до визита в консульство.",
  },
  {
    title: "Поддержка после отъезда",
    text: "Помогаем адаптироваться в Германии первое время после переезда.",
  },
];

export default function AboutPage() {
  usePageTitle("О центре");

  return (
    <>

      <section className="border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Badge className="mb-5">О центре</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Мы помогаем таджикской молодёжи{" "}
            <span className="text-brand-600">строить жизнь в Германии</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
            Tojikon Olmon — молодой учебный центр немецкого языка в Душанбе. Мы
            соединили языковые курсы, подготовку к Ausbildung и полное
            сопровождение по документам в одном месте.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge className="mb-4">Наша миссия</Badge>
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Не просто языковая школа
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-700">
              <p>
                Многие языковые центры учат немецкому и на этом останавливаются.
                Мы видели, как студенты получают B1, а дальше теряются: где
                искать работодателя? как собрать документы? что говорить в
                консульстве?
              </p>
              <p>
                Tojikon Olmon закрывает весь путь. Мы ведём студента от первой
                буквы алфавита до подписанного контракта на Ausbildung и
                собеседования в консульстве. И продолжаем поддерживать после
                переезда.
              </p>
              <p>
                Мы — <strong>молодая академия</strong> с современным подходом.
                Работаем с таджикской молодёжью и уже помогли{" "}
                <strong>более 50 студентам</strong> получить контракт на
                Ausbildung в Германии. Наша цель — сделать путь в Германию
                понятным и реальным для каждого.
              </p>
            </div>
          </div>


          <div>
            <img
              src="/images/classroom.webp"
              alt="Аудитория Tojikon Olmon в Душанбе"
              className="aspect-[3/2] w-full rounded-3xl object-cover shadow-xl ring-1 ring-brand-100"
            />
          </div>
        </div>
      </Section>


      <Section className="bg-ink-50/50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">В цифрах</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tojikon Olmon сегодня
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <stat.icon size={24} />
              </div>
              <div className="text-2xl font-extrabold text-ink-900 sm:text-3xl md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-ink-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Наши принципы</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Что для нас важно
          </h2>
          <p className="mt-4 text-base text-ink-700 sm:text-lg">
            Три простых правила, по которым мы работаем с каждым студентом.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <value.icon size={24} />
              </div>
              <h3 className="mb-3 text-lg font-semibold">{value.title}</h3>
              <p className="text-sm leading-relaxed text-ink-700">
                {value.text}
              </p>
            </Card>
          ))}
        </div>
      </Section>
      <Section className="bg-ink-50/50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4">Как мы работаем</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Четыре принципа обучения
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {workSteps.map((step, i) => (
            <Card key={step.title} className="flex items-start gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-base font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-700">
                  {step.text}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="pb-24">
        <div className="rounded-3xl bg-ink-900 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
            Хотите узнать больше о центре?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/70 sm:text-base">
            Приходите на бесплатную консультацию — покажем аудитории,
            познакомим с преподавателями и составим план обучения.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button as={Link} to="/contacts" size="lg">
              Записаться на консультацию
              <ArrowRight size={18} />
            </Button>
            <Button
              as={Link}
              to="/courses"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Посмотреть курсы
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
