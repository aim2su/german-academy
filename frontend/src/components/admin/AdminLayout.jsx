import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "./AdminSideBar";

export default function AdminLayout() {
  const { admin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col">
        {/* Мобильная шапка с бургером */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-100"
            aria-label="Открыть меню"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <ShieldCheck size={16} />
            </div>
            <span className="text-sm font-semibold">Админка</span>
          </div>
        </header>

        {/* Контент */}
        <main className="flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}









// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";
// import AdminSidebar from "./AdminSidebar";

// export default function AdminLayout() {
//   const { admin, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-brand-600" />
//       </div>
//     );
//   }

//   if (!admin) {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return (
//     <div className="flex min-h-screen bg-ink-50">
//       <AdminSidebar />
//       <main className="flex-1 overflow-x-auto p-8">
//         <Outlet />
//       </main>
//     </div>
//   );
// }