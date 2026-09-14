import { Shield, ShieldCheck, Check, Ban } from "lucide-react";
import { formatDushanbe } from "../../utils/date";
import Button from "../ui/Button";

export default function AdminsTable({
  admins,
  currentAdminUsername,
  onToggleActive,
  updatingId,
}) {
  if (!admins || admins.length === 0) {
    return (
      <div className="rounded-xl border border-ink-100 bg-white p-12 text-center">
        <p className="text-sm text-ink-500">Админов нет</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-ink-100 bg-ink-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                Логин
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                Роль
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                Создан
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                Статус
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-ink-500">
                Действие
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {admins.map((admin) => {
              const isSuperAdmin = admin.role === "SuperAdmin";
              const isSelf = admin.username === currentAdminUsername;

              return (
                <tr key={admin.id} className="transition-colors hover:bg-ink-50">
                  <td className="px-4 py-3 text-sm font-medium text-ink-900">
                    {admin.username}
                    {isSelf && (
                      <span className="ml-2 text-xs text-ink-500">(вы)</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {isSuperAdmin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                        <ShieldCheck size={12} />
                        SuperAdmin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">
                        <Shield size={12} />
                        Admin
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm text-ink-700">
                    {formatDushanbe(admin.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    {admin.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                        <Check size={12} />
                        Активен
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                        <Ban size={12} />
                        Отключён
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {isSuperAdmin ? (
                      <span className="text-xs text-ink-500">
                        Нельзя отключить
                      </span>
                    ) : admin.isActive ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleActive(admin)}
                        disabled={updatingId === admin.id}
                        className="cursor-pointer p-1"
                      >
                        {updatingId === admin.id ? "..." : "Отключить"}
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleActive(admin)}
                        disabled={updatingId === admin.id}
                        className="cursor-pointer p-1"
                      >
                        {updatingId === admin.id ? "..." : "Включить"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}