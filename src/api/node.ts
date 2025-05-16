import { getAuthHeaders } from "./config";

export interface NodeDto {
    id?: string;
    label: string;
    boardId: string;
    wikidataId?: string;
    wikidataUrl?: string;
    description?: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
}

interface NodeData {
    label: string;
}

export const nodeApi = {
    createNode: async (data: NodeDto): Promise<NodeDto> => {
        const response = await fetch(`/api/nodes/create`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to create node");
        }

        return response.json();
    },

    getNodesByBoard: async (boardId: string): Promise<NodeDto[]> => {
        const response = await fetch(`/api/nodes/board/${boardId}`, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Failed to fetch nodes");
        }

        return response.json();
    },

    deleteNode: async (nodeId: string): Promise<void> => {
        const response = await fetch(`/api/nodes/delete/${nodeId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Failed to delete node");
        }
    },

    updateNode: async (nodeId: string, label: string): Promise<NodeDto> => {
        const response = await fetch(`/api/nodes/update/${nodeId}`, {
            method: "PUT",
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ label })
        });

        if (!response.ok) {
            throw new Error("Failed to update node");
        }

        return response.json();
    }
}; 