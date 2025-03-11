/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Register() {
  const dateofbirth = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const surname = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordAgain = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleClick = async (e: any) => {
    e.preventDefault();
    // passwords match?
    //add user to db send POST request to /auth/register
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">Connect the Dots</h3>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input
              placeholder="Name"
              required
              className="registerInput"
              ref={name}
            />
            <input
              placeholder="Surname"
              required
              className="registerInput"
              ref={surname}
            />
            <input
              placeholder="Email"
              required
              className="registerInput"
              ref={email}
            />
            <input
              placeholder="Username"
              required
              className="registerInput"
              ref={username}
            />{" "}
            <input
              placeholder="DateofBirth"
              required
              className="registerInput"
              ref={dateofbirth}
              type="date"
            />
            <input
              placeholder="Password"
              required
              className="registerInput"
              ref={password}
              type="password"
              minLength={6}
            />
            <input
              placeholder="Password again"
              required
              className="registerInput"
              ref={passwordAgain}
              type="password"
              minLength={6}
            />
            <button className="registerButton" type="submit">
              Register
            </button>
            <Link to={"/login"}>
              <button className="registerRegisterButton">
                Log into Account
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
