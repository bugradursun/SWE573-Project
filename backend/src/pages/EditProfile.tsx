import React, { useState } from "react";
import "./CreateBoard.css";
import { error } from "console";
import { authApi } from "../api/auth";

const EditProfile: React.FC = () => {
  const [profession, setProfession] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error,setError] = useState("");

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Log the form data
    console.log({ profession, age, email, password, username });
    // In a real app, send this data to the backend
    try {
      const updatedUser = await authApi.updateUser({
        username,
        email,
        age:parseInt(age),
        profession,
      });
      console.log("Updated user:",updatedUser);
      setError("");
    } catch(error){
      console.error("Error updating profile",error);
      setError("Failed to update profile");
    }
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
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
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