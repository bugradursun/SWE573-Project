import React from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import { useParams } from "react-router-dom";
import "./CreateBoard.css";

// Dummy board data
const boards = [
  {
    id: "1",
    title: "Where do green parrots in Bosphorus area come from?",
    description:
      "This board was created to discuss where the green parrots in the Bosphorus region come from.",
    nodes: [
      { id: "1", data: { label: "Initial Question" }, position: { x: 100, y: 100 } },
      { id: "2", data: { label: "Contribution A" }, position: { x: 300, y: 100 } },
      { id: "3", data: { label: "Contribution B" }, position: { x: 200, y: 250 } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3" },
    ],
  },
  {
    id: "2",
    title: "123",
    description: "123",
    nodes: [
      { id: "1", data: { label: "Start" }, position: { x: 100, y: 100 } },
      { id: "2", data: { label: "Node 2" }, position: { x: 300, y: 100 } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
    ],
  },
];

const BoardDetail: React.FC = () => {
  const { id } = useParams();
  const board = boards.find((b) => b.id === id) || boards[0];

  return (
    <div className="create-board-container">
      <div className="create-board-form" style={{ maxWidth: 900 }}>
        <h1 style={{ textAlign: "center" }}>{board.title}</h1>
        <p style={{ textAlign: "center", color: "#4a5568" }}>{board.description}</p>
        <div style={{ height: 400, background: "#f8fafc", borderRadius: 12, marginTop: 32 }}>
          <ReactFlow nodes={board.nodes} edges={board.edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail; 