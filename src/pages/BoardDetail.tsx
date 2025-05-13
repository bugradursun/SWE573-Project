import React,{useState,useEffect} from "react";
import ReactFlow, { Background, Controls, Node, Edge } from "react-flow-renderer";
import { useParams } from "react-router-dom";
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

const BoardDetail: React.FC = () => {
  const { id } = useParams();
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [loading,setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newContribution, setNewContribution] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
  const board = boards.find((b) => b.id === id) || boards[0];

  useEffect(() => {
    if(!id) return;

    const loadData = async() => {
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
    }
    loadData();
  }, [id]);

  const handleAddContribution = async () => {
    console.log("New contribution:", newContribution);
    if (!newContribution.trim() || !id) return;
    
    const user = localStorage.getItem('user');
    if (!user) {
      console.error("User not found in localStorage");
      return;
    }

    setLoading(true);
    try {
      const contributionResponse = await boardApi.addContribution(id, newContribution, selectedParentId, user);
      console.log("Contribution added successfully:", contributionResponse);
      
      // After successful API call, refresh the board data
      const updatedData = await boardApi.fetchBoardGraph(id);
      console.log("Updated board data:", updatedData);
      
      if (updatedData && updatedData.nodes && updatedData.edges) {
        setNodes(updatedData.nodes);
        setEdges(updatedData.edges);
        setNewContribution("");
        setSelectedParentId(undefined);
      } else {
        console.error("Invalid board data received:", updatedData);
      }
    } catch (error) {
      console.error("Failed to add contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-board-container">
      <div className="create-board-form" style={{ maxWidth: 900 }}>
        <h1 style={{ textAlign: "center" }}>{title}</h1>
        {loading && <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>}
        <p style={{ textAlign: "center", color: "#4a5568" }}>{description}</p>
        <div style={{ height: 400, background: "#f8fafc", borderRadius: 12, marginTop: 32 }}>
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              value={newContribution}
              onChange={(e) => setNewContribution(e.target.value)}
              placeholder="Enter your contribution"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                fontSize: 14
              }}
            />
            <select
              value={selectedParentId || ''}
              onChange={(e) => setSelectedParentId(e.target.value || undefined)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #e2e8f0',
                fontSize: 14,
                minWidth: 150
              }}
            >
              <option value="">No parent (root contribution)</option>
              {nodes.filter(node => node.type === 'contribution').map(node => (
                <option key={node.id} value={node.id}>
                  {node.data.label.substring(0, 30)}...
                </option>
              ))}
            </select>
            <button
              onClick={handleAddContribution}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500
              }}
            >
              Add Contribution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail; 