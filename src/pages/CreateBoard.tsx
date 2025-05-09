import React, { useState } from "react";
import "./CreateBoard.css";
import "./Home/Homepage.css";
import { useNavigate } from "react-router-dom";

// Static data for user (same as HomePage)
const user = {
  displayName: "Bugra Dursun",
  username: "bugradursun",
  boards: 9,
  contributions: 0,
};

// Static data for user's boards (same as HomePage)
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

const CreateBoard: React.FC = () => {
  const [label, setLabel] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Log the form data
    console.log({ label, title, content });
    setLabel("");
    setTitle("");
    setContent("");
    // In a real app, send this data to the backend
  };

  const submitButton = () => {
    console.log("mocking api call for now");
    navigate("/home")
  }

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
                <span className="stat-number">{user.contributions}</span> Contributions
              </div>
            </div>
            <button className="sidebar-create-btn" onClick={() => navigate("/create-board")}>+ Create New Board</button>
            <button className="sidebar-edit-btn">Edit Profile</button>
          </div>
        </div>

        {/* Middle: Create Board Form */}
        <div className="feed">
          <div className="feed-header">
            <h2>Create a New Board</h2>
          </div>
          <div className="create-board-form-wrapper">
            <form className="create-board-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="label">Label</label>
                <input
                  id="label"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                />
              </div>
              <button type="submit" className="create-board-btn" onClick={submitButton}>
                Create Board
              </button>
            </form>
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
                    <span>{board.nodes} nodes</span> · <span>{board.contributors} contributors</span>
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

export default CreateBoard; 