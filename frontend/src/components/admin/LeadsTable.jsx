import { ArrowUp, ArrowDown, Check, Clock } from "lucide-react";
import { formatDushanbe, formatRelative } from "../../utils/date";
import Button from "../ui/Button";

const LEVEL_ORDER = [
  "A1.1", "A1.2",
  "A2.1", "A2.2",
  "B1.1", "B1.2",
  "B2.1", "B2.2",
  "C1.1", "C1.2",
];

export default function LeadsTable({
  leads,
  sortBy,
  sortDir,
  onSort,
  onToggleStatus,
  onRowClick,
  updatingId,
}) {
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortDir === "asc" ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  const SortableHeader = ({ field, children, className = "" }) => (
    <th
      className={`cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500 hover:text-ink-900 ${className}`}
      onClick={() => onSort(field)}
    >
      {children}
      <SortIcon field={field} />
    </th>
  );

  if (!leads || leads.length === 0) {
    return (
      <div className="rounded-xl border border-ink-100 bg-white p-12 text-center">
        <p className="text-sm text-ink-500">Заявок нет</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-ink-100 bg-ink-50">
          <tr>
            <SortableHeader field="createdAt">Дата</SortableHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              Имя
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              Телефон
            </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              Уровень
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
              Комментарий
            </th>
            <SortableHeader field="isProcessed">Статус</SortableHeader>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
              Действие
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="cursor-alias transition-colors hover:bg-ink-50"
              onClick={() => onRowClick?.(lead)}
            >
              <td className="px-4 py-3 text-sm">
                <div className="font-medium text-ink-900">
                  {formatDushanbe(lead.createdAt)}
                </div>
                <div className="text-xs text-ink-500">
                  {formatRelative(lead.createdAt)}
                </div>
              </td>

              <td className="px-4 py-3 text-sm font-medium text-ink-900">
                {lead.name}
              </td>

              <td className="px-4 py-3 text-sm">
                <p
                  className="text-brand-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lead.phone}
                </p>
              </td>

              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700">
                  {lead.level}
                </span>
              </td>

              <td className="max-w-xs px-4 py-3 text-sm text-ink-500">
                <div className="truncate" title={lead.comment || ""}>
                  {lead.comment || "—"}
                </div>
              </td>

              <td className="px-4 py-3">
                {lead.isProcessed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    <Check size={12} />
                    Обработано
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">
                    <Clock size={12} />
                    Новое
                  </span>
                )}
              </td>

              <td
                className="px-4 py-3 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                {!lead.isProcessed ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleStatus(lead)}
                    disabled={updatingId === lead.id}
                    className="cursor-pointer"
                  >
                    {updatingId === lead.id ? "..." : "Обработано"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleStatus(lead)}
                    disabled={updatingId === lead.id}
                    className="cursor-pointer"
                  >
                    {updatingId === lead.id ? "..." : "Вернуть"}
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}