import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Handle,
    Position,
    ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams } from 'react-router-dom';
import { boardApi, BoardResponse } from '../api/board';
import { nodeApi, NodeDto } from '../api/node';
import { edgeApi, EdgeDto } from '../api/edge';
import { useAuth } from '../context/AuthContext';
import './BoardView.css';

// Custom node component
const CustomNode = ({ data }: { data: { label: string } }) => {
    return (
        <div className="custom-node">
            <Handle type="target" position={Position.Top} />
            <div className="node-content">{data.label}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

const BoardViewContent: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useAuth();
    const [board, setBoard] = useState<BoardResponse | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newNodeContent, setNewNodeContent] = useState('');
    const [isAddingNode, setIsAddingNode] = useState(false);

    const fetchBoardData = useCallback(async () => {
        if (!id) return;
        
        try {
            setIsLoading(true);
            const boardData = await boardApi.getBoardById(id);
            setBoard(boardData);
            
            // Fetch nodes
            const nodesData = await nodeApi.getNodesByBoard(id);
            const flowNodes: Node[] = nodesData.map((node: NodeDto) => ({
                id: node.id!,
                data: { label: node.label },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
                type: 'custom'
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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load board data');
        } finally {
            setIsLoading(false);
        }
    }, [id, setNodes, setEdges]);

    useEffect(() => {
        fetchBoardData();
    }, [fetchBoardData]);

    const onConnect = useCallback(async (connection: Connection) => {
        if (!id || !currentUser?.username) return;

        try {
            const edgeData: EdgeDto = {
                sourceId: connection.source!,
                targetId: connection.target!,
                boardId: id,
                createdBy: currentUser.username,
                title: ''
            };

            console.log('Creating edge with data:', edgeData);
            const createdEdge = await edgeApi.createEdge(edgeData);
            console.log('Edge created:', createdEdge);

            const newEdge: Edge = {
                id: createdEdge.id!,
                source: connection.source!,
                target: connection.target!,
                type: 'smoothstep',
                animated: true
            };
            setEdges((eds: Edge[]) => [...eds, newEdge]);
        } catch (err) {
            console.error('Failed to create edge:', err);
            setError('Failed to create edge. Please try again.');
        }
    }, [id, currentUser, setEdges]);

    const handleCreateNode = async () => {
        if (!id || !currentUser?.username || !newNodeContent.trim()) return;

        try {
            setIsAddingNode(true);
            const nodeData: NodeDto = {
                label: newNodeContent,
                boardId: id,
                createdBy: currentUser.username
            };

            console.log('Creating node with data:', nodeData);
            const createdNode = await nodeApi.createNode(nodeData);
            console.log('Node created:', createdNode);
            
            const newNode: Node = {
                id: createdNode.id!,
                data: { label: createdNode.label },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
                type: 'custom'
            };

            setNodes((nds: Node[]) => [...nds, newNode]);
            setNewNodeContent('');
        } catch (err) {
            console.error('Failed to create node:', err);
            setError('Failed to create node. Please try again.');
        } finally {
            setIsAddingNode(false);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading board...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!board) {
        return <div className="error">Board not found</div>;
    }

    return (
        <div className="board-view">
            <div className="board-header">
                <h1>{board.title}</h1>
                <p>{board.description}</p>
            </div>
            
            <div className="board-content">
                <div className="node-creation">
                    <input
                        type="text"
                        value={newNodeContent}
                        onChange={(e) => setNewNodeContent(e.target.value)}
                        placeholder="Enter node content"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleCreateNode();
                            }
                        }}
                    />
                    <button 
                        onClick={handleCreateNode}
                        disabled={isAddingNode || !newNodeContent.trim()}
                    >
                        {isAddingNode ? 'Adding...' : 'Add Node'}
                    </button>
                </div>
                
                <div className="flow-container">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <div className="instructions-panel">
                            <div className="instructions">
                                <h3>Instructions</h3>
                                <p>1. Enter content and click "Add Node" to create a node</p>
                                <p>2. Create another node the same way</p>
                                <p>3. Drag from one node's handle to another to connect them</p>
                            </div>
                        </div>
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

// Wrap the component with ReactFlowProvider
const BoardView: React.FC = () => {
    return (
        <ReactFlowProvider>
            <BoardViewContent />
        </ReactFlowProvider>
    );
};

export default BoardView; 