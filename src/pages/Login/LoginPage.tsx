import "./LoginPage.css";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is a required field!";
    } else if (!/\S+@\S+\.S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is a required field!";
    }

    return newErrors;
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Login form submitted!", formData);
    } else {
      setErrors(validationErrors);
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

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
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
