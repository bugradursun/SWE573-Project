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

interface NodeDetails {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
  createdBy?: string;
}

interface WikidataSearchResult {
  id: string;
  label: string;
  description: string;
  url: string;
}

const searchWikidata = async (
  query: string
): Promise<WikidataSearchResult | null> => {
  try {
    // Wikidata SPARQL endpoint
    const endpoint = "https://www.wikidata.org/w/api.php";
    const params = new URLSearchParams({
      action: "wbsearchentities",
      search: query,
      language: "en",
      format: "json",
      origin: "*",
    });

    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();

    if (data.search && data.search.length > 0) {
      const result = data.search[0];
      return {
        id: result.id,
        label: result.label,
        description: result.description,
        url: `https://www.wikidata.org/wiki/${result.id}`,
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching Wikidata:", error);
    return null;
  }
};

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
  const [createdBy, setCreatedBy] = useState("");
  const [wikiTitle, setWikiTitle] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isNodeDetailsModalOpen, setIsNodeDetailsModalOpen] = useState(false);
  const [selectedNodeDetails, setSelectedNodeDetails] =
    useState<NodeDetails | null>(null);

  // Form states
  const [newNodeContent, setNewNodeContent] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    undefined
  );
  const [updatedContent, setUpdatedContent] = useState("");

  // Edge creation states
  const [isEdgeCreationModalOpen, setIsEdgeCreationModalOpen] = useState(false);
  const [edgeTitle, setEdgeTitle] = useState("");
  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null
  );

  console.log("CURRENT USER DEBUG XXX:", currentUser);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch board data
        const boardData = await boardApi.getBoardById(id);
        setTitle(boardData.title);
        setDescription(boardData.description);
        setCreatedBy(boardData?.createdBy || "Passive User");

        console.log("board data debug:", boardData);
        setWikiTitle(boardData.label); // to show user Entity of Board
        // Fetch nodes
        const nodesData = await nodeApi.getNodesByBoard(id);
        console.log("nodes data xx :", nodesData);
        const flowNodes = nodesData.map((node: NodeDto) => ({
          id: node.id!,
          data: { label: node.label },
          createdBy: node.createdBy,
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          type: "default",
        }));
        setNodes(flowNodes);
        console.log("nodes data debug:", nodesData);
        console.log("flowNodes data debug:", flowNodes);

        // Fetch edges
        const edgesData = await edgeApi.getEdgesByBoard(id);
        const flowEdges: Edge[] = edgesData.map((edge: EdgeDto) => ({
          id: edge.id!,
          source: edge.sourceId,
          target: edge.targetId,
          type: "smoothstep",
          animated: true,
          label: edge.title,
        }));
        console.log("edges data debug:", edgesData);
        console.log("flowEdges data debug:", flowEdges);
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
    if (!newNodeContent.trim() || !id || !currentUser) {
      console.log("Validation failed:", {
        hasContent: !!newNodeContent.trim(),
        hasId: !!id,
        hasUsername: !!currentUser,
      });
      return;
    }

    setLoading(true);
    try {
      // Search Wikidata first
      const wikidataResult = await searchWikidata(newNodeContent);

      const nodeData: NodeDto = {
        label: newNodeContent,
        boardId: id,
        createdBy: currentUser,
        wikidataId: wikidataResult?.id,
        wikidataUrl: wikidataResult?.url,
        description: wikidataResult?.description,
      };

      console.log("Sending node creation request with data:", nodeData);

      const createdNode = await nodeApi.createNode(nodeData);

      console.log("Node created successfully:", createdNode);

      const newNode = {
        id: createdNode.id!,
        data: {
          label: createdNode.label,
          wikidataId: createdNode.wikidataId,
          wikidataUrl: createdNode.wikidataUrl,
          description: createdNode.description,
        },
        position: { x: Math.random() * 500, y: Math.random() * 500 },
        type: "default",
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
      setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
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
      const updatedNode = await nodeApi.updateNode(
        selectedNodeId,
        updatedContent
      );
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

  const handleEdgeCreation = async () => {
    if (!pendingConnection || !id || !currentUser || !edgeTitle.trim()) return;

    try {
      const edgeData: EdgeDto = {
        sourceId: pendingConnection.source!,
        targetId: pendingConnection.target!,
        boardId: id,
        createdBy: currentUser,
        title: edgeTitle.trim(),
      };

      const createdEdge = await edgeApi.createEdge(edgeData);

      const newEdge: Edge = {
        id: createdEdge.id!,
        source: pendingConnection.source!,
        target: pendingConnection.target!,
        type: "smoothstep",
        animated: true,
        label: edgeTitle.trim(),
      };

      setEdges((eds) => [...eds, newEdge]);
      setEdgeTitle("");
      setIsEdgeCreationModalOpen(false);
      setPendingConnection(null);
    } catch (error) {
      console.error("Failed to create edge:", error);
    }
  };

  const onConnect = async (connection: Connection) => {
    if (!id || !currentUser) {
      console.log("Missing reqs in onConnect");
      return;
    }

    console.log("On connect triggered");
    console.log("Connection:", connection);

    setPendingConnection(connection);
    setIsEdgeCreationModalOpen(true);
  };

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    console.log("Node clicked:", node);
    setSelectedNodeDetails({
      id: node?.id,
      data: node?.data,
      position: node?.position,
      createdBy: node?.createdBy,
    });
    setIsNodeDetailsModalOpen(true);
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
        <p style={{ textAlign: "center", color: "#4a5568" }}>
          Created By: {createdBy}
        </p>
        <p style={{ textAlign: "center", color: "#4a5568" }}>
          Related WikiData Entity:{" "}
          <a
            href={`https://www.wikidata.org/wiki/${wikiTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4f46e5",
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            {title}
          </a>
        </p>
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
            onNodeClick={onNodeClick}
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
              console.log("Add Node button clicked"); // Debug log
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

        {/* Node Details Modal}*/}

        <Modal
          isOpen={isNodeDetailsModalOpen}
          onClose={() => setIsNodeDetailsModalOpen(false)}
          title="Node Details"
        >
          {selectedNodeDetails && (
            <div className="node-details">
              <div className="node-detail-item">
                <strong>ID:</strong> {selectedNodeDetails.id}
              </div>
              <div className="node-detail-item">
                <strong>Label:</strong> {selectedNodeDetails.data.label}
              </div>
              <div className="node-detail-item">
                <strong>Position:</strong> X:{" "}
                {Math.round(selectedNodeDetails.position.x)}, Y:{" "}
                {Math.round(selectedNodeDetails.position.y)}
              </div>
              <div className="node-detail-item">
                <strong>Created By:</strong> {selectedNodeDetails.createdBy}
              </div>
            </div>
          )}
        </Modal>

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
                console.log("Input changed:", e.target.value); // Debug log
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
                console.log("Add button in modal clicked"); // Debug log
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

        {/* Edge Creation Modal */}
        <Modal
          isOpen={isEdgeCreationModalOpen}
          onClose={() => {
            setIsEdgeCreationModalOpen(false);
            setPendingConnection(null);
            setEdgeTitle("");
          }}
          title="Create Edge"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="text"
              value={edgeTitle}
              onChange={(e) => setEdgeTitle(e.target.value)}
              placeholder="Enter edge title"
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
                fontSize: 14,
              }}
            />
            <button
              onClick={handleEdgeCreation}
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
              Create Edge
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default BoardDetail;
