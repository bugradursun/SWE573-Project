import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Discover from "./pages/discover/Discover";
import NewSpace from "./pages/newspace/NewSpace";
import Profile from "./pages/profile/Profile";
import "./App.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header";
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
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Discover /> : <Register />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/new-space" element={<NewSpace />} />
        <Route path="/profile" element={<Profile />} />
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
