// HomePage.tsx
import React from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

// Static data for user
const user = {
  displayName: "Bugra Dursun",
  username: "bugradursun",
  boards: 9,
  contributions: 0,
};

// Static data for recommended boards
const recommendedBoards = [
  {
    id: 1,
    title: "Where do green parrots in Bosphorus area come from?",
    description:
      "This board was created to discuss where the green parrots in the Bosphorus region come from.",
    author: "dsonbay2",
  },
  {
    id: 2,
    title: "123",
    description: "123",
    author: "dennis",
  },
];

// Static data for user's boards
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

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-layout">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-avatar">
            <div className="avatar-circle">D</div>
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-displayname">{user.displayName}</div>
            <div className="sidebar-username">{user.username}</div>
            <div className="sidebar-stats">
              <div>
                <span className="stat-number">{user.boards}</span> Boards
              </div>
              <div>
                <span className="stat-number">{user.contributions}</span>{" "}
                Contributions
              </div>
            </div>
            <button className="sidebar-create-btn" onClick={() => navigate("/create-board")}>+ Create New Board</button>
            <button className="sidebar-edit-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="feed">
          <div className="feed-header">
            <h2>Recommended Boards</h2>
          </div>
          <div className="recommended-boards-list">
            {recommendedBoards.map((board) => (
              <div className="recommended-board-card" key={board.id}>
                <div className="recommended-board-title">{board.title}</div>
                <div className="recommended-board-description">
                  {board.description}
                </div>
                <div className="recommended-board-footer">
                  <div className="recommended-board-author">
                    <span className="avatar-circle small">
                      {board.author[0].toUpperCase()}
                    </span>{" "}
                    {board.author}
                  </div>
                  <button className="investigate-btn" onClick={() => navigate(`/board/${board.id}`)}>Investigate</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="profile">
          <div className="your-boards-section">
            <h4 className="your-boards-title">Your Boards</h4>
            <div className="your-boards-list">
              {userBoards.map((board) => (
                <div className="your-board-card" key={board.id}>
                  <div className="your-board-title">{board.title}</div>
                  <div className="your-board-meta">
                    Last updated: {board.updated}
                  </div>
                  <div className="your-board-stats">
                    <span>{board.nodes} nodes</span> ·{" "}
                    <span>{board.contributors} contributors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
