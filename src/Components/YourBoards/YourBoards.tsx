import React from "react";
import { useNavigate } from "react-router-dom";

interface Board {
  id: number | string;
  title: string;
  updated?: string;
  nodes?: number;
  contributors?: number;
  description?: string;
}

interface Props {
  boards: Board[];
  title?: string;
}

const YourBoardsSection: React.FC<Props> = ({ boards, title = "Your Boards" }) => {
  const navigate = useNavigate();

  return (
    <div className="your-boards-section">
      <h4 className="your-boards-title">{title}</h4>
      <div className="your-boards-list">
        {boards.length === 0 ? (
          <div className="no-boards-message">You haven't created any boards yet.</div>
        ) : (
          boards.map((board) => (
            <div
              className="your-board-card"
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="your-board-title">{board.title}</div>
              {board.description && (
                <div className="your-board-description">{board.description}</div>
              )}
              <div className="your-board-meta">
                {board.updated && <>Last updated: {board.updated}</>}
                {typeof board.nodes === "number" && typeof board.contributors === "number" && (
                  <div className="your-board-stats">
                    <span>{board.nodes} nodes</span> ·{" "}
                    <span>{board.contributors} contributors</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default YourBoardsSection;