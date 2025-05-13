import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
} from "react-flow-renderer";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateBoard.css";
import { boardApi } from "../api/board";

// Dummy board data
const boards = [
  {
    id: "1",
    title: "Where do green parrots in Bosphorus area come from?",
    description:
      "This board was created to discuss where the green parrots in the Bosphorus region come from.",
    nodes: [
      {
        id: "1",
        data: { label: "Initial Question" },
        position: { x: 100, y: 100 },
      },
      {
        id: "2",
        data: { label: "Contribution A" },
        position: { x: 300, y: 100 },
      },
      {
        id: "3",
        data: { label: "Contribution B" },
        position: { x: 200, y: 250 },
      },
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
    edges: [{ id: "e1-2", source: "1", target: "2" }],
  },
];

interface NodeData {
  id: string;
  type?: string;
  data: {
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  type?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const BoardDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Form states
  const [newContribution, setNewContribution] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(
    undefined
  );
  const [selectedContributionId, setSelectedContributionId] = useState<
    string | undefined
  >(undefined);
  const [updatedContent, setUpdatedContent] = useState("");
  const board = boards.find((b) => b.id === id) || boards[0];

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await boardApi.fetchBoardGraph(id);
        console.log("Initial board data:", data);

        if (data && data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          setTitle(data.nodes[0]?.data?.label || "");
          setDescription(data.description || "");
        } else {
          console.error("Invalid initial board data received:", data);
        }
      } catch (error) {
        console.error("Error loading board data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddContribution = async () => {
    if (!newContribution.trim() || !id) return;

    const user = localStorage.getItem("user");
    if (!user) {
      console.error("User not found in localStorage");
      return;
    }

    setLoading(true);
    try {
      await boardApi.addContribution(
        id,
        newContribution,
        selectedParentId,
        user
      );
      const updatedData = await boardApi.fetchBoardGraph(id);
      setNodes(updatedData.nodes);
      setEdges(updatedData.edges);
      setNewContribution("");
      setSelectedParentId(undefined);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContribution = async () => {
    if (!selectedContributionId || !id) return;

    setLoading(true);
    try {
      await boardApi.deleteContribution(selectedContributionId);
      const updatedData = await boardApi.fetchBoardGraph(id);
      setNodes(updatedData.nodes);
      setEdges(updatedData.edges);
      setSelectedContributionId(undefined);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContribution = async () => {
    if (!selectedContributionId || !updatedContent.trim()) return;

    setLoading(true);
    try {
      await boardApi.updateContribution(selectedContributionId, updatedContent);
      const updatedData = await boardApi.fetchBoardGraph(id!);
      setNodes(updatedData.nodes);
      setEdges(updatedData.edges);
      setSelectedContributionId(undefined);
      setUpdatedContent("");
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Failed to update contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-board-container">
      <div className="create-board-form" style={{ maxWidth: 900 }}>
        <h1 style={{ textAlign: "center" }}>{title}</h1>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        <p style={{ textAlign: "center", color: "#4a5568" }}>{description}</p>
        <div
          style={{
            height: 400,
            background: "#f8fafc",
            borderRadius: 12,
            marginTop: 32,
          }}
        >
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4299e1",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Add Contribution
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Delete Contribution
          </button>
          <button
            onClick={() => setIsUpdateModalOpen(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#38a169",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Update Contribution
          </button>
          <button
            onClick={() => navigate("/home")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4138a1",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Home Page
          </button>
        </div>

        {/* Add Contribution Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Contribution"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="text"
              value={newContribution}
              onChange={(e) => setNewContribution(e.target.value)}
              placeholder="Enter your contribution"
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            />
            <select
              value={selectedParentId || ""}
              onChange={(e) => setSelectedParentId(e.target.value || undefined)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            >
              <option value="">No parent (root contribution)</option>
              {nodes
                .filter((node) => node.type === "contribution")
                .map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label.substring(0, 30)}...
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddContribution}
              style={{
                padding: "8px 16px",
                backgroundColor: "#4299e1",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Add
            </button>
          </div>
        </Modal>

        {/* Delete Contribution Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Contribution"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select
              value={selectedContributionId || ""}
              onChange={(e) =>
                setSelectedContributionId(e.target.value || undefined)
              }
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            >
              <option value="">Select a contribution to delete</option>
              {nodes
                .filter((node) => node.type === "contribution")
                .map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label.substring(0, 30)}...
                  </option>
                ))}
            </select>
            <button
              onClick={handleDeleteContribution}
              style={{
                padding: "8px 16px",
                backgroundColor: "#e53e3e",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Delete
            </button>
          </div>
        </Modal>

        {/* Update Contribution Modal */}
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Contribution"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select
              value={selectedContributionId || ""}
              onChange={(e) => {
                setSelectedContributionId(e.target.value || undefined);
                const selectedNode = nodes.find(
                  (node) => node.id === e.target.value
                );
                setUpdatedContent(selectedNode?.data.label || "");
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            >
              <option value="">Select a contribution to update</option>
              {nodes
                .filter((node) => node.type === "contribution")
                .map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.data.label.substring(0, 30)}...
                  </option>
                ))}
            </select>
            <input
              type="text"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              placeholder="Enter updated content"
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            />
            <button
              onClick={handleUpdateContribution}
              style={{
                padding: "8px 16px",
                backgroundColor: "#38a169",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Update
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BoardDetail;
