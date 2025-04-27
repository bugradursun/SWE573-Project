import "./LoginPage.css";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginFormErrors {
  username?: string;
  password?: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const navgiate = useNavigate();
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof LoginFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }

    if (apiError) {
      setApiError(null);
    }
  };

  const validate = (): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!formData.username) {
      newErrors.username = "username is a required field!";
    }
    if (!formData.password) {
      newErrors.password = "Password is a required field!";
    }

    return newErrors;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Login form submitted!", formData);
      try {
        setIsLoading(true);
        setApiError(null);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            accepts: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", //include cookies for api uses cookie based authentication
        });
        console.log("Login response:", response);
        const data: LoginResponse = await response.json();
        console.log("data:", data);
        if (data.message === "ok") {
          setIsLoading(false);
          setApiError(null);
          navgiate("/");
          localStorage.setItem("user", JSON.stringify(data.token));
        } else {
          setIsLoading(false);
          setApiError("Wrong credentials");
          console.log("AUTH FAILURE");
        }
      } catch (error) {
        console.log("Login error:", error);
        setIsLoading(false);
        setApiError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    } else {
      setErrors(validationErrors);
      console.log("Validation error ocurred!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Sign in to your account</h2>
          <p>
            Don't have an account?{" "}
            <a href="/register" className="login-link">
              Register now
            </a>
          </p>
        </div>
        {apiError && <div className="api-error">{apiError}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="email">Username</label>
              <input
                id="username"
                name="username"
                type="username"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && (
                <p className="error-message">{errors.username}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="login-options">
            <div className="remember-me">
              <input id="remember-me" name="remember-me" type="checkbox" />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <div className="forgot-password">
              <a href="#">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" className="login-button">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
