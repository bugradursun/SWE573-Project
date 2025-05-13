// HomePage.tsx
import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import { boardApi } from "../../api/board";

// Static data for user
const user = {
  displayName: "Bugra Dursun",
  username: "bugradursun",
  boards: 9,
  contributions: 0,
};



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
  const [boards, setBoards] = useState<any[]>([]);
  const [othersBoards, setOthersBoards] = useState<any[]>([]);
  const [yourBoards, setYourBoards] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const localStorageUserStr: any = localStorage.getItem("user");
  const localStorageUser: any = localStorageUserStr ? JSON.parse(localStorageUserStr) : null;
  console.log("Local storage user:", localStorageUser);
  useEffect(() => {
    const fetchAllBoards = async () => {
      try {
        const response = await boardApi.getAllBoards();
        console.log("All boards:", response);
        const filteredBoards = response.filter((board:any) => board.createdBy !==localStorageUser?.username);
        console.log("Filtered boards:", filteredBoards);
        setBoards(response);
        setOthersBoards(filteredBoards);
        console.log("Others boards:", othersBoards);
        setYourBoards(response.filter((board:any) => board.createdBy === localStorageUser?.username));
        console.log("xxxx",localStorageUser.username);
        console.log("Your boards:", yourBoards);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    }
    fetchAllBoards();
  },[])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = othersBoards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(othersBoards.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
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
            <div className="pagination-controls">
              <select 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
              </select>
            </div>
          </div>
          <div className="recommended-boards-list">
            {currentItems.map((board) => (
              <div className="recommended-board-card" key={board.id}>
                <div className="recommended-board-title">{board.title}</div>
                <div className="recommended-board-description">
                  {board.description}
                </div>
                <div className="recommended-board-footer">
                  <div className="recommended-board-author">
                    <span className="avatar-circle small">
                      {board.createdBy.charAt(0)}
                    </span>{" "}
                    {board.createdBy}
                  </div>
                  <button className="investigate-btn" onClick={() => navigate(`/board/${board.id}`)}>Investigate</button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="profile">
          <div className="your-boards-section">
            <h4 className="your-boards-title">Your Boards</h4>
            <div className="your-boards-list">
              {yourBoards.map((board) => (
                <div className="your-board-card" key={board.id} onClick={() => navigate(`/board/${board.id}`)} style={{cursor:'pointer'}}>
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
