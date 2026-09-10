import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "./Button";
import { courses } from "../../data/courses";

const initialState = {
  name: "",
  phone: "",
  email: "",
  course: "",
  comment: "",
};

export default function LeadForm({ compact = false }) {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (error) setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Укажите ваше имя";
    if (!form.phone.trim()) return "Укажите телефон для связи";
    if (form.phone.replace(/\D/g, "").length < 9)
      return "Телефон слишком короткий";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      return "Проверьте формат email";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");
    console.log("[LeadForm] submit:", form);

    await new Promise((r) => setTimeout(r, 800));

    setStatus("success");
    setForm(initialState);
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-8 text-center">
        <CheckCircle2
          size={40}
          className="mx-auto mb-4 text-brand-600"
        />
        <h3 className="mb-2 text-xl font-bold">Заявка отправлена!</h3>
        <p className="text-sm text-ink-700">
          Мы свяжемся с вами в течение рабочего дня. Обычно отвечаем в
          течение 2–3 часов.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Имя <span className="text-brand-600">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Как к вам обращаться"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Телефон <span className="text-brand-600">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+992 ..."
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="example@mail.com"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Интересующий курс
          </label>
          <select
            value={form.course}
            onChange={update("course")}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Не выбрано / не знаю уровень</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.level} — {c.title}
              </option>
            ))}
            <option value="ausbildung">
              Помощь с Ausbildung-контрактом
            </option>
          </select>
        </div>
      </div>

      {!compact && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">
            Комментарий
          </label>
          <textarea
            rows={4}
            value={form.comment}
            onChange={update("comment")}
            placeholder="Расскажите о вашей цели: язык, Ausbildung, сроки, вопросы"
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      )}

      {status === "error" && error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting" ? "Отправляем..." : "Отправить заявку"}
        {status !== "submitting" && <Send size={16} />}
      </Button>

      <p className="text-xs text-ink-500">
        Нажимая «Отправить», вы соглашаетесь на обработку персональных данных.
        Мы не передаём контакты третьим лицам.
      </p>
    </form>
  );
}