import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import DonorPage from "./pages/DonorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MyMatchesPage from "./pages/MyMatchesPage";
import RecipientPage from "./pages/RecipientPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-28 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/donor"
            element={
              <ProtectedRoute roles={["Admin", "Donor", "Recipient"]}>
                <DonorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipient"
            element={
              <ProtectedRoute roles={["Admin", "Donor", "Recipient"]}>
                <RecipientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-matches"
            element={
              <ProtectedRoute roles={["Admin", "Donor", "Recipient"]}>
                <MyMatchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
