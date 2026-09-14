import { X, Phone, Mail, BookOpen, MessageSquare, Clock, Hash, CheckCircle2, Circle } from "lucide-react";
import { formatDushanbe, formatRelative } from "../../utils/date";
import Button from "../ui/Button";

export default function LeadDetailsModal({ lead, isOpen, onClose, onToggleStatus, updating }) {
  if (!isOpen || !lead) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <Hash size={12} />
              Заявка #{lead.id}
            </div>
            <h2 className="mt-1 truncate text-lg font-bold sm:text-xl">
              {lead.name}
            </h2>
            <div className="mt-1 text-xs text-ink-500">
              {formatDushanbe(lead.createdAt)} 
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-100"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Phone size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Телефон
              </div>
              <p
                className="mt-0.5 block break-all text-base font-medium text-brand-600"
              >
                {lead.phone}
              </p>
            </div>
          </div>

          {lead.email && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Mail size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Email
                </div>
                <p
                  className="mt-0.5 block break-all text-base font-medium text-brand-600"
                >
                  {lead.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Уровень
              </div>
              <div className="mt-0.5 inline-flex rounded-md bg-ink-100 px-2 py-1 text-sm font-medium text-ink-700">
                {lead.level}
              </div>
            </div>
          </div>

          {lead.comment && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <MessageSquare size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Комментарий
                </div>
                <div className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-900">
                  {lead.comment}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                lead.isProcessed
                  ? "bg-green-50 text-green-600"
                  : "bg-yellow-50 text-yellow-600"
              }`}
            >
              {lead.isProcessed ? (
                <CheckCircle2 size={16} />
              ) : (
                <Circle size={16} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Статус
              </div>
              <div className="mt-0.5">
                {lead.isProcessed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-sm font-medium text-green-700">
                    <CheckCircle2 size={14} />
                    Обработано
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-sm font-medium text-yellow-700">
                    <Circle size={14} />
                    Новое
                  </span>
                )}
              </div>
            </div>
          </div>

          {lead.notifiedAt && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
                <Clock size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Уведомление отправлено
                </div>
                <div className="mt-0.5 text-sm text-ink-700">
                  {formatDushanbe(lead.notifiedAt)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="sm:order-1 cursor-pointer"
          >
            Закрыть
          </Button>
          <Button
            variant={"outline"}
            onClick={() => onToggleStatus(lead)}
            disabled={updating}
            className="sm:order-2 cursor-pointer"
          >
            {updating ? (
              "..."
            ) : lead.isProcessed ? (
              <>
                Вернуть в работу
              </>
            ) : (
              <>
                Пометить обработано
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}