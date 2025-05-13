// context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface User {
  username?: string;
  email?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true,
  userEmail: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        const savedUserEmail=localStorage.getItem("userEmail");
        console.log("savedUserEmail",savedUserEmail);

        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log("Loaded user from localStorage:", parsedUser);
          
          setCurrentUser(parsedUser);
          setUserEmail(savedUserEmail || parsedUser.email || null);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // Clear invalid auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (token: string, user: any) => {
    console.log("Login called with user:", user);
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userEmail",user.email || "xxx@gmail.com");
    setCurrentUser(user);
    setUserEmail(user.email || null);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setUserEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userEmail, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
