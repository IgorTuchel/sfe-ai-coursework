import { Route, Routes } from "react-router";
import "./App.css";
import DashboardPage from "./pages/DashboardPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import CharactersPage from "./pages/DashboardLandingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { NavbarProvider } from "./context/NavbarContext.jsx";
import { Toaster } from "react-hot-toast";
import CreateCharacterPage from "./pages/CreateCharacterPage.jsx";
import DashboardLandingPage from "./pages/DashboardLandingPage.jsx";
import UserSettingsPage from "./pages/UserSettings.jsx";
import LandingPage from "./pages/HomePage.jsx";
import ChatHistory from "./pages/ChatHistory.jsx";
function App() {
  return (
    <AuthProvider>
      <NavbarProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardLandingPage />} />
            <Route path="/dashboard/chat/:chatId" element={<ChatPage />} />
            <Route
              path="/dashboard/characters/create"
              element={<CreateCharacterPage />}
            />
            <Route
              path="/dashboard/characters/edit/:id"
              element={<CreateCharacterPage />}
            />
            <Route path="/dashboard/profile" element={<UserSettingsPage />} />
            <Route path="/dashboard/history" element={<ChatHistory />} />
          </Route>
        </Routes>
      </NavbarProvider>
    </AuthProvider>
  );
}

export default App;
