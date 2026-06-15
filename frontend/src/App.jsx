import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { VerifyEmailPage } from "./pages/VerifyEmailPage.jsx";

function PrivateRoute({ children }) {
  // Protege el dashboard: si no hay usuario en contexto vuelve al login.
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export function App() {
  // Define las rutas principales del frontend. El backend real se consume desde
  // los componentes usando el helper api().
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/verificar-email" element={<VerifyEmailPage />} />
          <Route path="/*" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
