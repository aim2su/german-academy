import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!username.trim() || !password) {
    setError("Заполните все поля");
    return;
  }

  setLoading(true);

  try {
    await login(username.trim(), password);
    toast.success("Добро пожаловать!");
    navigate("/admin/leads");
  } catch (err) {
    let message = "Ошибка сервера";

    if (err.response?.status === 401) {
      const code = err.response.data?.code;

      if (code === "ACCOUNT_DISABLED") {
        message = "Аккаунт отключён. Обратитесь к администратору.";
      } else {
        message = "Неверный логин или пароль";
      }
    } else if (err.response?.status === 429) {
      message = "Слишком много попыток. Подождите минуту.";
    }

    setError(message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-white">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold">Tojikon Olmon</h1>
          <p className="mt-1 text-sm text-ink-500">Панель администратора</p>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Логин
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Введите логин"
                autoFocus
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Введите пароль"
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
</div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={loading}>
                {loading ? "Вход..." : "Войти"}
                {!loading && <LogIn size={18} />}
              </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          Только для администраторов Tojikon Olmon
        </p>
      </div>
    </div>
  );
}