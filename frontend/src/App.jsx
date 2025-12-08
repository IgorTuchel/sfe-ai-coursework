import { Route, Routes } from "react-router";
import "./App.css";
import DashboardPage from "./pages/DashboardPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import CharactersPage from "./pages/CharactersPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { NavbarProvider } from "./context/NavbarContext.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <NavbarProvider>
        <Toaster />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<CharactersPage />} />
            <Route path="/dashboard/chat/:chatId" element={<ChatPage />} />
          </Route>
        </Routes>
      </NavbarProvider>
    </AuthProvider>
  );
}

export default App;
