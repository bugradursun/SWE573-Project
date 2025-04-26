import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import Feed from "./pages/Feed/Feed";
import Header from "./Components/Header/Header";
import "./App.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const user = localStorage.getItem("user"); //if user is stored in local storage
    setIsAuthenticated(user ? true : false);
  }, []);

  const showHeader =
    isAuthenticated &&
    ["/discover", "/new-space", "/profile"].includes(location.pathname);
  // / route içinde isAuthenticated ? <Discover> : <Login> ekle sonra
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};
const AppWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};
export default AppWrapper;
