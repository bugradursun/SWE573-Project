// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./Components/Header/Header";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import CreateBoard from "./pages/CreateBoard";

import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import EditProfile from "./pages/EditProfile";
import BoardDetail from "./pages/BoardDetail";

// Layout component that conditionally renders Header
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const { currentUser } = useAuth();
  console.log("current user in useAuth : ", currentUser);

  return (
    <>
      {!isAuthPage && (
        <Header
          username={currentUser?.username || "User"}
        />
      )}
      <main>{children}</main>
    </>
  );
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route
        path="/create-board"
        element={
          <AppLayout>
            <ProtectedRoute>
              <CreateBoard />
            </ProtectedRoute>
          </AppLayout>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <AppLayout>
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          </AppLayout>
        }
      />
      <Route
        path="/board/:id"
        element={
          <AppLayout>
            <ProtectedRoute>
              <BoardDetail />
            </ProtectedRoute>
          </AppLayout>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/home"
        element={
          <AppLayout>
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          </AppLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <AppLayout>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </AppLayout>
        }
      />

      <Route
        path="/board/:id"
        element={
          <AppLayout>
            <ProtectedRoute>
              <BoardDetail />
            </ProtectedRoute>
          </AppLayout>
        }
      />

      {/* Add more protected routes as needed */}

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
