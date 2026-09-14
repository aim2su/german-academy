import { useState } from "react";
import { X, UserPlus, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { adminsApi } from "../../api/admins";
import Button from "../ui/Button";

export default function CreateAdminModal({ isOpen, onClose, onCreated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Укажите логин");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("Логин — минимум 3 символа");
      return;
    }
    if (username.trim().length > 50) {
      toast.error("Логин — максимум 50 символов");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      toast.error("Логин: только латиница, цифры и _");
      return;
    }
    if (!password) {
      toast.error("Укажите пароль");
      return;
    }
    if (password.length < 8) {
      toast.error("Пароль — минимум 8 символов");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setLoading(true);

    try {
      await adminsApi.create(username.trim(), password);
      toast.success(`Админ "${username.trim()}" создан`);
      reset();
      onCreated?.();
      onClose();
    } catch (err) {
      const message =
        err.response?.status === 409
          ? `Логин "${username.trim()}" уже занят`
          : err.response?.status === 400
            ? "Проверьте поля"
            : err.response?.status === 403
              ? "Недостаточно прав"
              : "Ошибка сервера";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Новый админ</h2>
              <p className="text-xs text-ink-500">Роль: Admin</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="cursor-pointer rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="manager1"
              autoFocus
              disabled={loading}
              maxLength={50}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50"
            />
            <p className="mt-1 text-xs text-ink-500">
              Только латиница, цифры и _
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50"
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

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ещё раз пароль"
                disabled={loading}
                className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 pr-10 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={showConfirm ? "Скрыть пароль" : "Показать пароль"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={handleClose}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}