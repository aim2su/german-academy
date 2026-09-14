import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "./Button";
import { courseProgram } from "../../data/courses";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  name: "",
  phone: "",
  email: "",
  course: "",
  comment: "",
  website: "",
  agreed: false,
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
    if (form.name.trim().length < 2) return "Имя слишком короткое";
    if (form.name.trim().length > 100)
      return "Имя слишком длинное (максимум 100 символов)";

    if (!form.phone.trim()) return "Укажите телефон для связи";

    const phoneRegex = /^[\d\s+\-()]+$/;
    if (!phoneRegex.test(form.phone)) {
      return "Телефон может содержать только цифры, пробел, +, -, (, )";
    }

    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 9) return "Телефон слишком короткий (минимум 9 цифр)";
    if (digitsOnly.length > 15)
      return "Телефон слишком длинный (максимум 15 цифр)";

    if (form.email && form.email.trim()) {
      if (!form.email.includes("@")) {
        return "Email должен содержать символ @";
      }
    }

    if (form.comment && form.comment.length > 300) {
      return "Комментарий слишком длинный (максимум 300 символов)";
    }

    if (!form.agreed) {
      return "Необходимо согласие с политикой конфиденциальности";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.website) {
      setStatus("success");
      setForm(initialState);
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setStatus("error");
      toast.error(validationError);
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5136";

      await axios.post(`${apiUrl}/api/leads`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        level: form.course || "Не указан",
        comment: form.comment.trim() || null,
      });

      setStatus("success");
      setForm(initialState);
      toast.success("Заявка отправлена! Мы свяжемся с вами.");
    } catch (err) {
      setStatus("error");

      let message = "Не удалось отправить заявку. Попробуйте позже.";
      if (err.response?.status === 429) {
        message = "Слишком много заявок. Подождите минуту и попробуйте снова.";
      } else if (err.response?.status === 400) {
        message = "Проверьте заполненные поля.";
      } else if (err.code === "ERR_NETWORK") {
        message = "Сервер недоступен. Проверьте интернет.";
      }

      setError(message);
      toast.error(message);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-8 text-center">
        <CheckCircle2 size={40} className="mx-auto mb-4 text-brand-600" />
        <h3 className="mb-2 text-xl font-bold">Заявка отправлена!</h3>
        <p className="text-sm text-ink-700">
          Мы свяжемся с вами в течение рабочего дня. Обычно отвечаем в течение
          2–3 часов.
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
            maxLength={100}
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
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d\s+\-()]/g, "");
              setForm({ ...form, phone: cleaned });
            }}
            placeholder="+992 93 123 45 67"
            maxLength={30}
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
            maxLength={60}
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
            {courseProgram.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
            <option value="ausbildung">Помощь с Ausbildung-контрактом</option>
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
            maxLength={300}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      )}

      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => {
            setForm({ ...form, agreed: e.target.checked });
            if (error) setError("");
          }}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-100"
        />
        <span>
          Я согласен с{" "}
          <Link
            to="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline hover:text-brand-700"
            onClick={(e) => e.stopPropagation()}
          >
            политикой конфиденциальности
          </Link>
        </span>
      </label>

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
        className={`w-full sm:w-auto ${!form.agreed ? "opacity-50" : ""}`}
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