import { useState, useEffect } from "react";
import { UserPlus, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import { adminsApi } from "../../api/admins";
import { useAuth } from "../../contexts/AuthContext";
import AdminsTable from "../../components/admin/AdminsTable";
import CreateAdminModal from "../../components/admin/CreateAdminModal";
import Button from "../../components/ui/Button";

export default function AdminAdminsPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await adminsApi.getAll();
      setAdmins(data);
    } catch (err) {
      toast.error(
        err.response?.status === 403
          ? "Недостаточно прав"
          : "Не удалось загрузить список"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleToggleActive = async (admin) => {
    if (admin.role === "SuperAdmin") {
      toast.error("SuperAdmin нельзя отключить");
      return;
    }

    const action = admin.isActive ? "отключить" : "включить";
    if (!window.confirm(`Точно ${action} админа "${admin.username}"?`)) {
      return;
    }

    setUpdatingId(admin.id);
    try {
      const { data } = await adminsApi.toggleActive(admin.id);
      setAdmins((prev) =>
        prev.map((a) => (a.id === data.id ? { ...a, ...data } : a))
      );
      toast.success(
        data.isActive
          ? `Админ "${data.username}" включён`
          : `Админ "${data.username}" отключён`
      );
    } catch (err) {
      const message =
        err.response?.status === 400
          ? err.response.data?.error || "Нельзя выполнить"
          : "Ошибка сервера";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Админы</h1>
          <p className="mt-1 text-sm text-ink-500">Всего: {admins.length}</p>
        </div>

        <div className="flex gap-2">

          <Button onClick={() => setModalOpen(true)} className="cursor-pointer">
            <UserPlus size={16} />
            Создать админа
          </Button>
        </div>
      </div>

      {loading && admins.length === 0 ? (
        <div className="flex items-center justify-center rounded-xl border border-ink-100 bg-white py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
        </div>
      ) : (
        <AdminsTable
          admins={admins}
          currentAdminUsername={currentAdmin?.username}
          onToggleActive={handleToggleActive}
          updatingId={updatingId}
        />
      )}

      <CreateAdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadAdmins}
      />
    </div>
  );
}