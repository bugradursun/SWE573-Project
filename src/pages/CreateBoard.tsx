import React, { useEffect, useState } from "react";
import "./CreateBoard.css";
import "./Home/Homepage.css";
import { useNavigate } from "react-router-dom";
import { boardApi, BoardResponse } from "../api/board";
import { useAuth } from "../context/AuthContext";
import YourBoardsSection from "../Components/YourBoards/YourBoards";

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
  const [userBoards, setUserBoards] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [wikidataResults, setWikidataResults] = useState<WikidataResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  console.log("current userxxx", currentUser);

  useEffect(() => {
    const fetchAllBoards = async () => {
      try {
        const response = await boardApi.getAllBoards();
        setBoards(response);
        const boardsToShow = response.filter(
          (board) => board.createdBy === currentUser
        );
        setUserBoards(boardsToShow);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchAllBoards();
  }, [currentUser]);

  // Debounce function to limit API calls
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Search Wikidata API
  const searchWikidata = async (query: string) => {
    if (!query.trim()) {
      setWikidataResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
          query
        )}&language=en&format=json&origin=*`
      );
      const data = await response.json();
      console.log("wikidata data debug:", data);
      const results = data.search.map((item: any) => ({
        id: item.id,
        label: item.label,
        description: item.description,
        url: `https://www.wikidata.org/wiki/${item.id}`,
      }));
      console.log("wikidata results debug:", results);
      setWikidataResults(results);
    } catch (error) {
      console.error("Error searching Wikidata:", error);
      setWikidataResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(searchWikidata, 500);

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSearch(newTitle);
  };

  // Handle Wikidata result selection
  const handleWikidataSelect = (result: WikidataResult) => {
    setTitle(result.label);
    setDescription(result.description);
    setWikidataResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!currentUser) {
      console.log("no current user", currentUser);
      setError("You must be logged in to create a board");
      setIsLoading(false);
      return;
    }

    try {
      const boardData = {
        label,
        title,
        content,
        description,
        createdBy: currentUser,
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
      setError(
        error instanceof Error ? error.message : "Failed to create board"
      );
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
            <div className="sidebar-displayname">
              {currentUser?.username || "User"}
            </div>
            <div className="sidebar-username">
              {currentUser?.username || "user"}
            </div>
            <div className="sidebar-stats">
              <div>
                <span className="stat-number">{userBoards.length}</span> Boards
              </div>
              <div>
                <span className="stat-number">0</span> Contributions
              </div>
            </div>
            <button
              className="sidebar-create-btn"
              onClick={() => navigate("/create-board")}
            >
              + Create New Board
            </button>
            <button className="sidebar-edit-btn">Edit Profile</button>
          </div>
        </div>

        {/* Middle: Create Board Form */}
        <div className="feed">
          <div className="feed-header">
            <h2>Create a New Board</h2>
          </div>
          {error && <div className="api-error">{error}</div>}
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
                  placeholder="Enter a unique label for your board"
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <div className="wikidata-search-container">
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter a title for your board"
                  />
                  {isSearching && (
                    <div className="search-loading">Searching...</div>
                  )}
                  {wikidataResults.length > 0 && (
                    <div className="wikidata-results">
                      {wikidataResults.map((result) => (
                        <div
                          key={result.id}
                          className="wikidata-result-item"
                          onClick={() => handleWikidataSelect(result)}
                        >
                          <div className="result-label">{result.label}</div>
                          <div className="result-description">
                            {result.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                  placeholder="Enter the main content of your board"
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
                  placeholder="Enter a description for your board"
                />
              </div>
              <button
                type="submit"
                className="create-board-btn"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Board"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="profile">
          <YourBoardsSection boards={userBoards} />
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
