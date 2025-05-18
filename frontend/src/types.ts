import { Node as ReactFlowNode } from "reactflow";

export interface CustomNodeData {
  createdBy?: string;
  [key: string]: any;
}

export interface CustomNode extends ReactFlowNode<CustomNodeData> {}
