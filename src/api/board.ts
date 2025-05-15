import { User } from "../models/types";
import { getAuthHeaders } from "./config";

export interface BoardRequest {
    label: string;
    title: string;
    content: string;
    createdBy?: any;
    description: string;
}

export interface BoardResponse {
    id: string;
    label: string;
    title: string;
    content: string;
    createdBy?: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    nodes?: any[];
}

export const boardApi = {
    addBoard: async (data: BoardRequest): Promise<BoardResponse> => {
        const headers = getAuthHeaders();
        console.log('Auth headers:', headers);
        
        const response = await fetch(`/api/board/add`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
            credentials: 'include',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Board creation failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Failed to add board: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log("Add board response:", responseData);
        return responseData;
    },

    getAllBoards: async (): Promise<BoardResponse[]> => {
        const response = await fetch(`/api/board/all`, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch boards");
        }
        
        return response.json();
    },

    getBoardByLabel: async (label: string): Promise<BoardResponse> => {
        const response = await fetch(`/api/board/label/${label}`, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch board by label");
        }
        
        return response.json();
    },

    getBoardById: async (id: string): Promise<BoardResponse> => {
        const response = await fetch(`/api/board/id/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch board by id");
        }
        
        return response.json();
    },

    fetchBoardGraph:async(boardId:string) : Promise<any> => {
        const response = await fetch(`/api/board-flow/${boardId}`,{
            method:"GET",
            headers:getAuthHeaders(),
            credentials:'include',
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Board flow fetch failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Failed to fetch board flow: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Board flow response:", data);
        return data;
    },
    addContribution: async(boardId: string, content: string, parentId?: string, createdBy?: string): Promise<any> => {
        const response = await fetch(`/api/contributions/add`, {
            method: "POST",
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                boardId,
                content,
                parentId,
                createdBy
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Contribution creation failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Failed to add contribution: ${response.statusText}`);
        }
        
        // Since the response is just a success message, we don't need to parse it as JSON
        const responseText = await response.text();
        console.log("Add contribution response:", responseText);
        return responseText;
    },
    deleteContribution: async(contributionId:string):Promise<any> => {
        const response = await fetch(`/api/contributions/delete`,{
            method:"DELETE",
            headers:{
                ...getAuthHeaders(),
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({contributionId})
        })
        if(!response.ok) {
            const errorText =await response.text();
            console.error('Contribution deletion failed!',{
                status:response.status,
                statusText:response.statusText,
                error:errorText
            });
            throw new Error(`Failed to delete contribution: ${response.statusText}`);
        }
        const responseText = await response.text();
        console.log("Contribution deleted successfully:",responseText);
        return responseText;
    },
    updateContribution:async(contributionId:string,content:string) : Promise<any> => {
        const response = await fetch(`/api/contributions/update`,{
            method:"PUT",
            headers:{
                ...getAuthHeaders(),
                'Content-Type':'application/json'
            },
            credentials:'include',
            body:JSON.stringify({contributionId,content})
        })
        if(!response.ok) {
            const errorText = await response.text();
            console.error('Contribution update failed',{
                status:response.status,
                statusText:response.statusText,
                error:errorText
            });
            throw new Error(`Failed to update contribution: ${response.statusText}`);
        }
        const responseText = await response.text();
        console.log("Contribution updated successfully:",responseText);
        return responseText;
    },
    searchWikidata: async(query: string): Promise<any> => {
        const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`);
        
        if (!response.ok) {
            throw new Error("Failed to search Wikidata");
        }
        
        const data = await response.json();
        return data.search;
    }
}