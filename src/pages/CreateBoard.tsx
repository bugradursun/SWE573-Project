import React, { useEffect, useState } from "react";
import "./CreateBoard.css";
import "./Home/Homepage.css";
import { useNavigate } from "react-router-dom";
import { boardApi, BoardResponse } from "../api/board";
import { useAuth } from "../context/AuthContext";

// Static data for user (same as HomePage)
const user = {
  displayName: "Bugra Dursun",
  username: "bugradursun",
  boards: 9,
  contributions: 0,
};

interface WikidataResult {
  id: string;
  label: string;
  description: string;
  url: string;
}

const CreateBoard: React.FC = () => {
  const [label, setLabel] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [userBoards, setUserBoards] = useState<BoardResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser, userEmail } = useAuth();
  const [wikidataResults, setWikidataResults] = useState<WikidataResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAllBoards = async () => {
      try {
        const response = await boardApi.getAllBoards();
        setBoards(response);
        const boardsToShow = response.filter(board => board.createdBy === currentUser);
        setUserBoards(boardsToShow);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchAllBoards();
  }, [currentUser]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (newTitle.length > 2) {
      const timeout = setTimeout(async () => {
        try {
          const results = await boardApi.searchWikidata(newTitle);
          setWikidataResults(results);
          setShowResults(true);
        } catch (error) {
          console.error("Failed to search Wikidata:", error);
        }
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setWikidataResults([]);
      setShowResults(false);
    }
  };

  const handleWikidataSelect = (result: WikidataResult) => {
    setTitle(result.label);
    setDescription(result.description);
    setShowResults(false);
  };

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
        createdBy: currentUser
      };
      const response = await boardApi.addBoard(boardData);
      
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
                <span className="stat-number">{userBoards.length}</span> Boards
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
                  onChange={handleTitleChange}
                  required
                  disabled={isLoading}
                />
                {showResults && wikidataResults.length > 0 && (
                  <div className="wikidata-results">
                    {wikidataResults.map((result) => (
                      <div
                        key={result.id}
                        className="wikidata-result-item"
                        onClick={() => handleWikidataSelect(result)}
                      >
                        <h3>{result.label}</h3>
                        <p>{result.description}</p>
                      </div>
                    ))}
                  </div>
                )}
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
              {userBoards.length === 0 ? (
                <div className="no-boards-message">You haven't created any boards yet.</div>
              ) : (
                userBoards.map((board) => (
                  <div 
                    className="your-board-card" 
                    key={board.id}
                    onClick={() => navigate(`/board/${board.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="your-board-title">{board.title}</div>
                    <div className="your-board-description">{board.description}</div>
                    <div className="your-board-footer">
                      <span className="board-label">{board.label}</span>
                      <span className="board-date">
                        {new Date(board.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard; 
