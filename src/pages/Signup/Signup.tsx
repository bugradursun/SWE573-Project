import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import email_icon from "../../Assets/email.png";
import password_icon from "../../Assets/password.png";
import user_icon from "../../Assets/person.png";

function Signup() {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const dateofBirth = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const surname = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordAgain = useRef<HTMLInputElement>(null);

  const handleClick = (e: any) => {
    e.preventDefault();
    console.log("Button submitted");
    if (password.current?.value !== passwordAgain.current?.value) {
      alert("Passwords do not match");
      return;
    }
    // if user is logged in successfully navigate them to Feed page
    //navigate("/feed");
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleClick}>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Name" required ref={name} />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Surname" required ref={surname} />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input type="text" placeholder="Username" required ref={username} />
          </div>
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" required ref={email} />
          </div>
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="date"
              placeholder="Date of Birth"
              required
              ref={dateofBirth}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              required
              ref={password}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password Again"
              required
              ref={passwordAgain}
            />
          </div>
        </div>
        <div className="forgot-password">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </div>
        <div className="submit-container">
          <button className="submit" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
