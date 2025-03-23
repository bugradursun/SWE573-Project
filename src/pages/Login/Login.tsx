import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import email_icon from "../../Assets/email.png";
import password_icon from "../../Assets/password.png";
import user_icon from "../../Assets/person.png";
function Login() {
  const [action, setAction] = useState("Sign Up");
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    e.preventDefault();
    console.log("Button submitted");
    // will add logic here
    navigate("/feed");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleClick}>
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" ref={email} />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Password" ref={password} />
          </div>
        </div>
        <div className="submit-container">
          <button className="submit" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
