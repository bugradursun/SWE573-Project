import React,{useState,useEffect} from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
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
  id:string;
  data: {
    label:string;
  };
  position : {x:number,y:number};
}

interface EdgeData {
  id:string;
  source:string;
  target:string;
  animated?:boolean;
}


const BoardDetail: React.FC = () => {
  const { id } = useParams();
  const [nodes,setNodes] = useState<NodeData[]>([]);
  const [edges,setEdges] = useState<EdgeData[]>([]);
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const board = boards.find((b) => b.id === id) || boards[0];

  useEffect(() => {
    if(!id) return;

    const loadData = async() => {
      try {
        const data = await boardApi.fetchBoardGraph(id);
        console.log("Board data:",data);
        setNodes(data.nodes);
        setEdges(data.edges);
        setTitle(data.title || "");
        setDescription(data.description || "");
      } catch (error) {
        console.error("Error loading board data:",error);
      }
    }
    loadData();
  },[id]);
  return (
    <div className="create-board-container">
      <div className="create-board-form" style={{ maxWidth: 900 }}>
        <h1 style={{ textAlign: "center" }}>{title}</h1>
        <p style={{ textAlign: "center", color: "#4a5568" }}>{description}</p>
        <div style={{ height: 400, background: "#f8fafc", borderRadius: 12, marginTop: 32 }}>
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default BoardDetail; 