/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./login.css";

function Login() {
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const handleClick = (e: any) => {
    e.preventDefault();
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Connect the Dots</h3>
          <span className="loginDesc">Contribute and connect the dots!</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit">
              Log In
            </button>
            <span className="loginForgot">Forgot password?</span>
            <button
              className="loginRegisterButton"
              onClick={() => navigate("/register")}
            >
              Create a new account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
