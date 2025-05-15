import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
} from "react-flow-renderer";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateBoard.css";
import { boardApi } from "../api/board";
import { nodeApi, NodeDto } from "../api/node";
import { edgeApi, EdgeDto } from "../api/edge";
import { useAuth } from "../context/AuthContext";

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
  label: string;
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
  const { currentUser } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Form states
  const [newNodeContent, setNewNodeContent] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch board data
        const boardData = await boardApi.getBoardById(id);
        setTitle(boardData.title);
        setDescription(boardData.description);

        // Fetch nodes
        const nodesData = await nodeApi.getNodesByBoard(id);
        const flowNodes = nodesData.map((node: NodeDto) => ({
          id: node.id!,
          data: { label: node.label },
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          type: 'default'
        }));
        setNodes(flowNodes);

        // Fetch edges
        const edgesData = await edgeApi.getEdgesByBoard(id);
        const flowEdges: Edge[] = edgesData.map((edge: EdgeDto) => ({
          id: edge.id!,
          source: edge.sourceId,
          target: edge.targetId,
          type: 'smoothstep',
          animated: true
        }));
        setEdges(flowEdges);
      } catch (error) {
        console.error("Error loading board data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddNode = async () => {
    console.log('handleAddNode called');  // Debug log
    console.log('newNodeContent:', newNodeContent);  // Debug log
    console.log('id:', id);  // Debug log
    console.log('currentUser:', currentUser);  // Debug log

    if (!newNodeContent.trim() || !id || !currentUser?.username) {
      console.log('Validation failed:', { 
        hasContent: !!newNodeContent.trim(), 
        hasId: !!id, 
        hasUsername: !!currentUser?.username 
      });
      return;
    }

    setLoading(true);
    try {
      const nodeData: NodeDto = {
        label: newNodeContent,
        boardId: id,
        createdBy: currentUser.username
      };

      console.log('Sending node creation request with data:', nodeData);  // Debug log

      const createdNode = await nodeApi.createNode(nodeData);
      
      console.log('Node created successfully:', createdNode);  // Debug log
      
      const newNode = {
        id: createdNode.id!,
        data: { label: createdNode.label },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        type: 'default'
      };

      setNodes((nds) => [...nds, newNode]);
      setNewNodeContent("");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add node:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNode = async () => {
    if (!selectedNodeId || !id) return;

    setLoading(true);
    try {
      await nodeApi.deleteNode(selectedNodeId);
      setNodes((nds) => nds.filter(node => node.id !== selectedNodeId));
      setSelectedNodeId(undefined);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete node:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNode = async () => {
    if (!selectedNodeId || !updatedContent.trim() || !id) return;

    setLoading(true);
    try {
      const updatedNode = await nodeApi.updateNode(selectedNodeId, updatedContent);
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, label: updatedContent } }
            : node
        )
      );
      setSelectedNodeId(undefined);
      setUpdatedContent("");
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Failed to update node:", error);
    } finally {
      setLoading(false);
    }
  };

  const onConnect = async (connection: Connection) => {
    if (!id || !currentUser?.username) return;

    try {
      const edgeData: EdgeDto = {
        sourceId: connection.source!,
        targetId: connection.target!,
        boardId: id,
        createdBy: currentUser.username
      };

      const createdEdge = await edgeApi.createEdge(edgeData);
      
      const newEdge: Edge = {
        id: createdEdge.id!,
        source: connection.source!,
        target: connection.target!,
        type: 'smoothstep',
        animated: true
      };

      setEdges((eds) => [...eds, newEdge]);
    } catch (error) {
      console.error("Failed to create edge:", error);
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
          <ReactFlow 
            nodes={nodes} 
            edges={edges} 
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
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
            onClick={() => {
              console.log('Add Node button clicked');  // Debug log
              setIsAddModalOpen(true);
            }}
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
            Add Node
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
            Delete Node
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
            Update Node
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

        {/* Add Node Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Node"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="text"
              value={newNodeContent}
              onChange={(e) => {
                console.log('Input changed:', e.target.value);  // Debug log
                setNewNodeContent(e.target.value);
              }}
              placeholder="Enter node content"
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            />
            <button
              onClick={() => {
                console.log('Add button in modal clicked');  // Debug log
                handleAddNode();
              }}
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

        {/* Delete Node Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Node"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select
              value={selectedNodeId || ""}
              onChange={(e) => setSelectedNodeId(e.target.value || undefined)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            >
              <option value="">Select a node to delete</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.data.label.substring(0, 30)}...
                </option>
              ))}
            </select>
            <button
              onClick={handleDeleteNode}
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

        {/* Update Node Modal */}
        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          title="Update Node"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <select
              value={selectedNodeId || ""}
              onChange={(e) => {
                setSelectedNodeId(e.target.value || undefined);
                const selectedNode = nodes.find(
                  (node) => node.id === e.target.value
                );
                if (selectedNode) {
                  setUpdatedContent(selectedNode.data.label);
                }
              }}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            >
              <option value="">Select a node to update</option>
              {nodes.map((node) => (
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
              onClick={handleUpdateNode}
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
