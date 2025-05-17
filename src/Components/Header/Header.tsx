// Header.tsx
import React, { useEffect, useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import { boardApi, BoardResponse } from "../../api/board";

interface HeaderProps {
  username: any;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchInput,setSearchInput] = useState<string>("");
  const [elements,setElements] = useState<any[]>([]);
  const [showResults,setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if(searchRef.current && !searchRef.current.contains(event.target as Node) ) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown",handleClickOutside);
    return () => {
      document.removeEventListener("mousedown",handleClickOutside);
    }
  })

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      // Remove event listener after closing dropdown
      document.removeEventListener("click", handleClickOutside);
    }
  };

  const handleSearch = async() => {
    try {
      if(!searchInput.trim()) {
        setShowResults(false);
        return; // if search input is empty, return
      }
      const response: BoardResponse = await boardApi.getBoardByLabel(searchInput);
      const results = Array.isArray(response) ? response : [response];
      setElements(results);
      setShowResults(true); 
    } catch (error) {
      console.error("Failed to search:", error);
      setElements([]);
      setShowResults(true);
    }
  }

  const handleResultClick = (boardId: string) => {
    navigate(`/board/${boardId}`);
    setShowResults(false);
    setSearchInput("");
  };  
  const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key=== 'Enter') {
      handleSearch();
    }
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up

    const newDropdownState = !isDropdownOpen;
    setIsDropdownOpen(newDropdownState);

    if (newDropdownState) {
      // Add event listener when opening dropdown
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    } else {
      // Remove event listener when closing dropdown
      document.removeEventListener("click", handleClickOutside);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/home">ConnectTheDots</Link>
        </div>

        <div className="header-search" ref={searchRef}>
          <input type="text" placeholder="Search..." className="search-input" value={searchInput} onChange={(e) =>setSearchInput(e.target.value) } onKeyUp={handleKeyPress} />
          <button className="search-button" onClick={handleSearch}>🔍</button>
          {showResults && (
    <div className="search-results">
      {elements.length > 0 ? (
        elements.map((board) => (
          <div 
            key={board.id} 
            className="search-result-item"
            onClick={() => handleResultClick(board.id)}
          >
            <div className="result-title">{board.title}</div>
            <div className="result-description">{board.description}</div>
          </div>
        ))
      ) : (
        <div className="no-results">No results found</div>
      )}
    </div>
  )}
        </div>

        <nav className="header-nav">
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </nav>

        <div className="header-user">
          <div className="user-dropdown" onClick={toggleDropdown}>
            <div className="user-avatar"></div>
            <span className="username">@{username}</span>
            <span className="dropdown-icon">{isDropdownOpen ? "▲" : "▼"}</span>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  Profile
                </Link>

                <div className="dropdown-item logout" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
