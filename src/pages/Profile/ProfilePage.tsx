// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi, UserProfile } from "../../api/auth";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await authApi.getMe();
        console.log("Fetched profile data:", data);
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // if (loading) {
  //   return <div className="profile-container">Loading profile...</div>;
  // }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }
  const logoutHandler = () => {
    logout();
    navigate("/login")
    
  }
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile</h2>
        {profile && (
          <div className="profile-info">
            <div className="info-group">
              <label>Username:</label>
              <span>{profile.username}</span>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <span>{profile.email}</span>
            </div>
            {profile.displayName && (
              <div className="info-group">
                <label>Display Name:</label>
                <span>{profile.displayName}</span>
              </div>
            )}
            {profile.age && (
              <div className="info-group">
                <label>Age:</label>
                <span>{profile.age}</span>
              </div>
            )}
            {profile.profession && (
              <div className="info-group">
                <label>Profession:</label>
                <span>{profile.profession}</span>
              </div>
            )}
          </div>
        )}
        <button onClick={logoutHandler} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
