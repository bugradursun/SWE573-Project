// ProfilePage.tsx
import React from "react";
import "./ProfilePage.css";

// Mock user data (same as HomePage)
const user = {
  displayName: "Bugra Dursun",
  username: "bugradursun",
  age: 28,
  profession: "Software Engineer",
  boards: 9,
  contributions: 0,
};

const userBoards = [
  {
    id: 1,
    title: "What happened to Emily?",
    updated: "-",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 2,
    title: "What is happening?",
    updated: "2024-06-05",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 3,
    title: "This is an example board title 1",
    updated: "2024-06-06",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 4,
    title: "New board",
    updated: "2024-06-06",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 5,
    title: "new 2",
    updated: "2024-06-06",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 6,
    title: "qweadasdas",
    updated: "-",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 7,
    title: "234123",
    updated: "-",
    nodes: 0,
    contributors: 0,
  },
  {
    id: 8,
    title: "asdasd",
    updated: "2024-06-10",
    nodes: 0,
    contributors: 0,
  },
];

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page-container">
      <div className="profile-content">
        <h1>Profile</h1>
        <div className="profile-user-card">
          <div className="profile-avatar-large">{user.displayName[0]}</div>
          <div className="profile-user-info">
            <div className="profile-displayname">{user.displayName}</div>
            <div className="profile-username">@{user.username}</div>
            <div className="profile-detail">Age: {user.age}</div>
            <div className="profile-detail">Profession: {user.profession}</div>
            <div className="profile-detail">Boards: {user.boards}</div>
            <div className="profile-detail">Contributions: {user.contributions}</div>
          </div>
        </div>
        <h2 className="profile-section-title">Your Boards</h2>
        <div className="profile-boards-list">
          {userBoards.map((board) => (
            <div className="profile-board-card" key={board.id}>
              <div className="profile-board-title">{board.title}</div>
              <div className="profile-board-meta">
                Last updated: {board.updated}
              </div>
              <div className="profile-board-stats">
                <span>{board.nodes} nodes</span> · <span>{board.contributors} contributors</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
