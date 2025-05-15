import { getAuthHeaders } from "./config";

export interface EdgeDto {
    id?: string;
    sourceId: string;
    targetId: string;
    boardId: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
}

export const edgeApi = {
    createEdge: async (data: EdgeDto): Promise<EdgeDto> => {
        const response = await fetch(`/api/edges/create`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to create edge");
        }

        return response.json();
    },

    getEdgesByBoard: async (boardId: string): Promise<EdgeDto[]> => {
        const response = await fetch(`/api/edges/edge/${boardId}`, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch edges");
        }

        return response.json();
    }
}; 