// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi, UserProfile } from "../../api/auth";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";

interface Board {
  id: number;
  title: string;
  updated: string;
  nodes: number;
  contributors: number;
  createdBy: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [myBoards, setMyBoards] = useState<Board[]>([]);
  const [othersBoards, setOthersBoards] = useState<Board[]>([]);
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

        // Get boards from localStorage
        const boardsJson = localStorage.getItem('boards');
        if (boardsJson) {
          const allBoards: Board[] = JSON.parse(boardsJson);
          const currentUsername = currentUser?.username;

          // Separate boards into my boards and others' boards
          const myBoardsList = allBoards.filter(board => board.createdBy === currentUsername);
          const othersBoardsList = allBoards.filter(board => board.createdBy !== currentUsername);

          console.log("My boards:", myBoardsList);
          console.log("Others' boards:", othersBoardsList);

          setMyBoards(myBoardsList);
          setOthersBoards(othersBoardsList);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  const renderBoardsList = (boards: Board[], title: string) => (
    <div className="boards-section">
      <h3>{title}</h3>
      <div className="boards-list">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <div className="board-title">{board.title}</div>
            <div className="board-meta">
              <span>Last updated: {board.updated}</span>
              <span>Created by: {board.createdBy}</span>
            </div>
            <div className="board-stats">
              <span>{board.nodes} nodes</span>
              <span>{board.contributors} contributors</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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

        {myBoards.length > 0 && renderBoardsList(myBoards, "My Boards")}
        {othersBoards.length > 0 && renderBoardsList(othersBoards, "Others' Boards")}

        <button onClick={logoutHandler} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
