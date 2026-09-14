import { useState } from "react";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function AdminProfilePage() {
  const { admin } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Заполните все поля");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("Новый пароль — минимум 8 символов");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    if (form.currentPassword === form.newPassword) {
      toast.error("Новый пароль должен отличаться");
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(form.currentPassword, form.newPassword);
      toast.success("Пароль изменён. Войдите заново.");
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/admin/login";
      }, 1500);
    } catch (err) {
      const message =
        err.response?.status === 400
          ? err.response.data?.error || "Неверный текущий пароль"
          : "Ошибка сервера";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Профиль</h1>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
            {admin?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{admin?.username}</div>
            <div className="text-sm text-ink-500">{admin?.role}</div>
          </div>
        </div>
      </Card>

      {admin?.role === "SuperAdmin" ? (
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <KeyRound size={20} />
            Смена пароля
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Текущий пароль
              </label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={update("currentPassword")}
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Новый пароль
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={update("newPassword")}
                placeholder="Минимум 8 символов"
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Сохранение..." : "Сменить пароль"}
            </Button>
          </form>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-ink-500">
            Смена пароля доступна только SuperAdmin.
          </p>
        </Card>
      )}
    </div>
  );
}