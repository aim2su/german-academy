export const testQuestions = [

  {
    id: 1,
    level: "A1",
    type: "choice",
    question: "Wie heißt du?",
    options: [
      "Ich heiße Anna.",
      "Ich bin 20 Jahre alt.",
      "Ich wohne in Berlin.",
      "Ich komme aus Spanien.",
    ],
    correct: 0,
  },
  {
    id: 2,
    level: "A1",
    type: "choice",
    question: "___ du Deutsch?",
    options: ["Sprichst", "Sprechen", "Sprich", "Spricht"],
    correct: 0,
  },
  {
    id: 3,
    level: "A1",
    type: "input",
    question: "Вставьте правильную форму глагола sein:\nIch ___ müde.",
    correct: ["bin"],
    placeholder: "Ваш ответ",
  },

  {
    id: 4,
    level: "A2",
    type: "choice",
    question: "Gestern ___ ich ins Kino gegangen.",
    options: ["bin", "habe", "war", "hatte"],
    correct: 0,
  },
  {
    id: 5,
    level: "A2",
    type: "choice",
    question: "Ich interessiere mich ___ Musik.",
    options: ["für", "an", "über", "auf"],
    correct: 0,
  },
  {
    id: 6,
    level: "A2",
    type: "choice",
    question: "Welcher Satz ist richtig?",
    options: [
      "Ich habe gestern einen Film gesehen.",
      "Ich gestern habe einen Film gesehen.",
      "Ich habe gesehen gestern einen Film.",
      "Gestern ich habe einen Film gesehen.",
    ],
    correct: 0,
  },
  {
    id: 7,
    level: "A2",
    type: "input",
    question: "Вставьте правильный предлог:\nIch fahre ___ dem Bus zur Arbeit.",
    correct: ["mit"],
    placeholder: "Один предлог",
  },

  {
    id: 8,
    level: "B1",
    type: "choice",
    question: "___ ich in Deutschland war, habe ich viele Freunde kennengelernt.",
    options: ["Als", "Wenn", "Wann", "Ob"],
    correct: 0,
  },
  {
    id: 9,
    level: "B1",
    type: "choice",
    question: "Der Brief ___ gestern von meiner Schwester geschrieben.",
    options: ["wurde", "worden", "wird", "werden"],
    correct: 0,
  },
  {
    id: 10,
    level: "B1",
    type: "input",
    question: "Вставьте правильное относительное местоимение:\nDas ist der Mann, ___ ich gestern getroffen habe.",
    correct: ["den"],
    placeholder: "Одно слово",
  },
];

export const levelDescriptions = {
  A1: {
    title: "Начальный уровень (A1)",
    text: "Вы только начинаете. Понимаете простые фразы и можете представиться. Рекомендуем начать с курса A1 — от нуля до базового общения за 4 месяца.",
  },
  A2: {
    title: "Базовый уровень (A2)",
    text: "Вы справляетесь с простыми бытовыми темами, но для Ausbildung нужен B1. Рекомендуем курс A2 + B1 — примерно 9 месяцев.",
  },
  B1: {
    title: "Пороговый уровень (B1)",
    text: "Отличный результат! B1 — минимальный уровень для большинства Ausbildung. Можно начинать поиск работодателя параллельно с подготовкой к B2.",
  },
  B2: {
    title: "Продвинутый уровень (B2+)",
    text: "Вы уверенно владеете немецким. Можно сразу переходить к поиску Ausbildung-контракта и подготовке документов.",
  },
};