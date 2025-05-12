import React, { useState } from "react";
import "./CreateBoard.css";
import "./Home/Homepage.css";
import { useNavigate } from "react-router-dom";
import { boardApi } from "../api/board";
import { useAuth } from "../context/AuthContext";

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
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser, userEmail } = useAuth();
  console.log("current userxx",currentUser);

  console.log("Current user:", currentUser);
  console.log("User email:", userEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const boardData = {
        label,
        title,
        content,
        description,
        createdBy: currentUser,
      };
      console.log("Board data:", boardData);
      const response = await boardApi.addBoard(boardData);
      console.log("Board added successfully:", response);
      
      // Clear form
      setLabel("");
      setTitle("");
      setContent("");
      setDescription("");
      
      // Navigate to the new board
      navigate(`/board/${response.id}`);
    } catch (error) {
      console.error("Error adding board:", error);
      setError(error instanceof Error ? error.message : "Failed to create board");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-layout">
        {/* Left Sidebar */}
        <div className="sidebar">
          <div className="sidebar-avatar">
            <div className="avatar-circle">D</div>
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-displayname">{currentUser?.username || 'User'}</div>
            <div className="sidebar-username">{currentUser?.username || 'user'}</div>
            <div className="sidebar-stats">
              <div>
                <span className="stat-number">0</span> Boards
              </div>
              <div>
                <span className="stat-number">0</span> Contributions
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
          {error && (
            <div className="api-error">
              {error}
            </div>
          )}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className="create-board-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Board'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="profile">
          <div className="your-boards-section">
            <h4 className="your-boards-title">Your Boards</h4>
            <div className="your-boards-list">
              {/* We'll populate this with real data later */}
              <div className="your-board-card">
                <div className="your-board-title">No boards yet</div>
                <div className="your-board-meta">Create your first board!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard; 