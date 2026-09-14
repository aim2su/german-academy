import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Clock,
  ListChecks,
} from "lucide-react";

import Section from "../components/ui/Section";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

import { testQuestions, levelDescriptions } from "../data/levelTest";
import usePageTitle from "../hooks/usePageTitle";

function shuffleWithAnswer(question) {
  if (question.type !== "choice") return question;

  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledOptions = indices.map((i) => question.options[i]);
  const newCorrectIndex = indices.indexOf(question.correct);
  return { ...question, options: shuffledOptions, correct: newCorrectIndex };
}

function normalize(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;]/g, "");
}

function checkInputAnswer(userAnswer, correctAnswers) {
  const normalized = normalize(userAnswer);
  return correctAnswers.some((ans) => normalize(ans) === normalized);
}

function calculateLevel(answers) {
  const scorePerLevel = { A1: 0, A2: 0, B1: 0 };
  const totalPerLevel = { A1: 0, A2: 0, B1: 0 };

  for (const a of answers) {
    totalPerLevel[a.level] += 1;
    if (a.isCorrect) scorePerLevel[a.level] += 1;
  }

  const percentA1 = scorePerLevel.A1 / totalPerLevel.A1;
  const percentA2 = scorePerLevel.A2 / totalPerLevel.A2;
  const percentB1 = scorePerLevel.B1 / totalPerLevel.B1;

  if (percentB1 >= 0.6) return "B2";
  if (percentA2 >= 0.6 && percentB1 >= 0.3) return "B1";
  if (percentA1 >= 0.6) return "A2";
  return "A1";
}

export default function LevelTestPage() {
  usePageTitle("Тест на уровень немецкого");

  const [screen, setScreen] = useState("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const currentQuestion = useMemo(
    () =>
      screen === "test" ? shuffleWithAnswer(testQuestions[currentIndex]) : null,
    [screen, currentIndex],
  );

  const total = testQuestions.length;
  const progress = screen === "test" ? ((currentIndex + 1) / total) * 100 : 0;

  const startTest = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setInputValue("");
    setScreen("test");
  };

  const goNext = (isCorrect) => {
    const newAnswers = [
      ...answers,
      { level: currentQuestion.level, isCorrect },
    ];
    setAnswers(newAnswers);
    setInputValue("");

    if (currentIndex + 1 < total) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setScreen("result");
    }
  };

  const handleChoiceAnswer = (optionIndex) => {
    goNext(optionIndex === currentQuestion.correct);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const isCorrect = checkInputAnswer(
      inputValue,
      currentQuestion.correct,
    );
    goNext(isCorrect);
  };

  const restart = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setInputValue("");
    setScreen("intro");
  };

  if (screen === "intro") {
    return (
      <>
        <section className="border-b border-ink-100 bg-gradient-to-b from-brand-50/60 to-white">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <Badge className="mb-5">Тест на уровень</Badge>
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Узнайте свой{" "}
              <span className="text-brand-600">уровень немецкого</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
              10 вопросов, 4 минуты, без регистрации. В конце узнаете свой
              уровень и получите рекомендацию по курсу.
            </p>
          </div>
        </section>

        <Section>
          <div className="mx-auto max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="text-center">
                <ListChecks size={24} className="mx-auto mb-3 text-brand-600" />
                <div className="font-semibold">10 вопросов</div>
                <div className="mt-1 text-sm text-ink-500">Грамматика и словарный запас</div>
              </Card>
              <Card className="text-center">
                <Clock size={24} className="mx-auto mb-3 text-brand-600" />
                <div className="font-semibold">~4 минуты</div>
                <div className="mt-1 text-sm text-ink-500">Без таймера</div>
              </Card>
              <Card className="text-center">
                <Sparkles size={24} className="mx-auto mb-3 text-brand-600" />
                <div className="font-semibold">Бесплатно</div>
                <div className="mt-1 text-sm text-ink-500">
                  Без регистрации
                </div>
              </Card>
            </div>

            <div className="mt-10 flex justify-center">
              <Button size="lg" onClick={startTest}>
                Начать тест
                <ArrowRight size={18} />
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-ink-500">
              Результат — ориентировочный. Точный уровень определим на
              бесплатной консультации.
            </p>
          </div>
        </Section>
      </>
    );
  }

  if (screen === "test" && currentQuestion) {
    return (
      <Section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between text-sm text-ink-500">
            <span>
              Вопрос {currentIndex + 1} из {total}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-10">
            <Badge className="mb-4">{currentQuestion.level}</Badge>
            <h2 className="whitespace-pre-line text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === "choice" && (
              <div className="mt-8 grid gap-3">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoiceAnswer(i)}
                    className="w-full rounded-2xl border border-ink-200 bg-white px-5 py-4 text-left text-base font-medium text-ink-900 transition-all hover:border-brand-400 hover:bg-brand-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ink-100 text-xs font-bold text-ink-700">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "input" && (
              <form onSubmit={handleInputSubmit} className="mt-8">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentQuestion.placeholder || "Ваш ответ"}
                  autoFocus
                  className="w-full rounded-2xl border border-ink-200 bg-white px-5 py-4 text-base outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <div className="mt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!inputValue.trim()}
                  >
                    Ответить
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </Section>
    );
  }

  if (screen === "result") {
    const level = calculateLevel(answers);
    const info = levelDescriptions[level];
    const correctCount = answers.filter((a) => a.isCorrect).length;

    return (
      <Section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <CheckCircle2 size={32} />
            </div>
            <Badge className="mb-4">Ваш результат</Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {info.title}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-700">
              {info.text}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-sm text-ink-700">
              Правильных ответов:{" "}
              <strong>
                {correctCount} из {total}
              </strong>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button as={Link} to="/contacts" size="lg">
                Записаться на консультацию
                <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={restart}>
                <RotateCcw size={18} />
                Пройти заново
              </Button>
            </div>

            <p className="mt-6 text-xs text-ink-500">
              Это ориентировочный результат. На бесплатной консультации мы
              точно определим ваш уровень и подберём группу.
            </p>
          </Card>
        </div>
      </Section>
    );
  }

  return null;
}