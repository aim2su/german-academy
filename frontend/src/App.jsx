import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";

import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";

import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import AboutPage from "./pages/AboutPage";
import LevelTestPage from "./pages/LevelTestPage";
import ContactsPage from "./pages/ContactsPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminLoginPage from "./pages/admin/LoginPage";
import AdminLeadsPage from "./pages/admin/LeadsPage";
import AdminAdminsPage from "./pages/admin/AdminsPage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import PrivacyPage from "./pages/PrivacyPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontSize: "14px",
              borderRadius: "12px",
              background: "#0f172a",
              color: "#ffffff",
            },
          }}
        />

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/level-test" element={<LevelTestPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/leads" replace />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="admins" element={<AdminAdminsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}














// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import Layout from "./components/layout/Layout";
// import HomePage from "./pages/HomePage";
// import CoursesPage from "./pages/CoursesPage";
// import AboutPage from "./pages/AboutPage";
// import LevelTestPage from "./pages/LevelTestPage";
// import ContactsPage from "./pages/ContactsPage";
// import NotFoundPage from "./pages/NotFoundPage";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             fontSize: "14px",
//             borderRadius: "12px",
//             background: "#0f172a",
//             color: "#ffffff",
//           },
//           success: {
//             iconTheme: {
//               primary: "#de5c16",
//               secondary: "#ffffff",
//             },
//           },
//         }}
//       />

//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/courses" element={<CoursesPage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/level-test" element={<LevelTestPage />} />
//           <Route path="/contacts" element={<ContactsPage />} />
//           <Route path="*" element={<NotFoundPage />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }




