import { NavLink, useNavigate } from "react-router-dom";
import { FileText, Users, KeyRound, LogOut, Home, X, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const nav = [
  { to: "/admin/leads", label: "Заявки", icon: FileText },
  { to: "/admin/admins", label: "Админы", icon: Users, roles: ["SuperAdmin"] },
  { to: "/admin/profile", label: "Профиль", icon: KeyRound },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Вы вышли");
    navigate("/admin/login");
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const visibleNav = nav.filter(
    (item) => !item.roles || item.roles.includes(admin?.role)
  );

  return (
    <>
      {/* Затемнение фона на мобильном */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-100 bg-white
          transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between gap-2 border-b border-ink-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-bold">Tojikon Olmon</div>
              <div className="text-xs text-ink-500">Админка</div>
            </div>
          </div>

          {/* Кнопка закрытия — только на мобильном */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-ink-100 lg:hidden"
            aria-label="Закрыть меню"
          >
            <X size={20} />
          </button>
        </div>

        {/* Навигация */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-700 hover:bg-ink-50"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-100 p-4">
          <div className="mb-3 rounded-lg bg-ink-50 px-3 py-2">
            <div className="text-xs text-ink-500">Вы вошли как</div>
            <div className="text-sm font-medium">{admin?.username}</div>
            <div className="text-xs text-ink-500">{admin?.role}</div>
          </div>

          <NavLink
            to="/"
            onClick={handleLinkClick}
            className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
          >
            <Home size={18} />
            На сайт
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>
    </>
  );
}


















// import { NavLink, useNavigate } from "react-router-dom";
// import { FileText, Users, KeyRound, LogOut, Home } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAuth } from "../../contexts/AuthContext";

// const nav = [
//   { to: "/admin/leads", label: "Заявки", icon: FileText },
//   { to: "/admin/admins", label: "Админы", icon: Users, roles: ["SuperAdmin"] },
//   { to: "/admin/profile", label: "Профиль", icon: KeyRound },
// ];

// export default function AdminSidebar() {
//   const { admin, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     toast.success("Вы вышли");
//     navigate("/admin/login");
//   };

//   const visibleNav = nav.filter(
//     (item) => !item.roles || item.roles.includes(admin?.role)
//   );

//   return (
//     <aside className="flex h-screen w-64 flex-col border-r border-ink-100 bg-white">
//       <div className="flex items-center gap-2 border-b border-ink-100 px-6 py-5">
//         <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 font-bold text-white">
//           TO
//         </div>
//         <div>
//           <div className="text-sm font-bold">Tojikon Olmon</div>
//           <div className="text-xs text-ink-500">Админка</div>
//         </div>
//       </div>

//       <nav className="flex-1 space-y-1 p-4">
//         {visibleNav.map((item) => (
//           <NavLink
//             key={item.to}
//             to={item.to}
//             className={({ isActive }) =>
//               `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
//                 isActive
//                   ? "bg-brand-50 text-brand-700"
//                   : "text-ink-700 hover:bg-ink-50"
//               }`
//             }
//           >
//             <item.icon size={18} />
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="border-t border-ink-100 p-4">
//         <div className="mb-3 rounded-lg bg-ink-50 px-3 py-2">
//           <div className="text-xs text-ink-500">Вы вошли как</div>
//           <div className="text-sm font-medium">{admin?.username}</div>
//           <div className="text-xs text-ink-500">{admin?.role}</div>
//         </div>

//         <NavLink
//           to="/"
//           className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50"
//         >
//           <Home size={18} />
//           На сайт
//         </NavLink>

//         <button
//           onClick={handleLogout}
//           className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-red-50 hover:text-red-600"
//         >
//           <LogOut size={18} />
//           Выйти
//         </button>
//       </div>
//     </aside>
//   );
// }