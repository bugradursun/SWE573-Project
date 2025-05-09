import React, { useState } from "react";
import "./CreateBoard.css";

const EditProfile: React.FC = () => {
  const [profession, setProfession] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Log the form data
    console.log({ profession, age, email, password, username });
    // In a real app, send this data to the backend
  };

  return (
    <div className="create-board-container">
      <form className="create-board-form" onSubmit={handleSubmit}>
        <h1>Edit Profile</h1>
        <div className="form-group">
          <label htmlFor="profession">Profession</label>
          <input
            id="profession"
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="create-board-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile; 