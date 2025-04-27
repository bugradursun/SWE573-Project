import React, { useState, ChangeEvent, FormEvent } from "react";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";
interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  age: string;
  profession: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
  profession?: string;
}

interface RegisterResponse {
  token?: string;
  message: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    age: "",
    profession: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.username) {
      newErrors.username = "Username is required!";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters!";
    }
    if (!formData.password) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required!";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    if (!formData.age) {
      newErrors.age = "Age is a required field!";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      newErrors.age = "Please enter a valid age!";
    }
    if (!formData.profession) {
      newErrors.profession = "Profession is a required field!";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      console.log("No errors, form submitted:", formData);
      console.log("Register form submitted");
      setIsLoading(true);
      try {
        // why do we use await TWICE using fetch?
        // in the first await we get the headers
        // in the second await we get the body. because its parsing a response stream (bytes come in incrementally) not the entire payload at once
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            accepts: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        });
        console.log("Register response: ", response);
        const data: RegisterResponse = await response.json();
      } catch (error) {
        console.log("Error from register api", error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create your account</h2>
          <p>
            Already have an account?{" "}
            <a href="/login" className="register-link">
              Sign in
            </a>
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
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
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <p className="error-message">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="1"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? "input-error" : ""}
                />
                {errors.age && <p className="error-message">{errors.age}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="profession">Profession</label>
                <input
                  id="profession"
                  name="profession"
                  type="text"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  className={errors.profession ? "input-error" : ""}
                />
                {errors.profession && (
                  <p className="error-message">{errors.profession}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button type="submit" className="register-button">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
