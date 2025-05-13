import { getAuthHeaders, getDefaultHeaders } from "./config";
import {Board} from "../models/types";

export interface BoardRequest {
    label:string;
    title:string;
    content:string;
    createdBy?:any;
    description:string;
}

export interface BoardResponse {
    id:any;
    label:string;
    title:string;
    content:string;
    createdBy?:string;
    description:string;
    createdAt?:any;
    updatedAt?:any;

}

export const boardApi = {
    addBoard : async(data:BoardRequest) : Promise<BoardResponse> => {
        const headers = getAuthHeaders();
        console.log('Auth headers:', headers); // Debug log
        
        const response = await fetch(`/api/board/add`,{
            method:"POST",
            headers:headers,
            body:JSON.stringify(data),
            credentials:'include',
        })
        if(!response.ok) {
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
    getAllBoards : async() : Promise<BoardResponse[]> => {
        const response = await fetch(`/api/board/all`,{
            method:"GET",
            headers:getAuthHeaders(),
            credentials:'include',
        })
        if(!response.ok) {
            throw new Error("Failed to fetch boards");
        }
        console.log("Get all boards response:",response);
        return response.json();
    },
    getBoardByLabel: async(label:string) :Promise<BoardResponse> => {
        const response = await fetch(`/api/board/${label}`,{
            method:"GET",
            headers:getAuthHeaders(),
            credentials:'include',
        })
        if(!response.ok) {
            throw new Error("Failed to fetch board by label");
        }
        console.log("Get board by label response:",response);
        return response.json();
    },
    fetchBoardGraph:async(boardId:string) : Promise<any> => {
        const response = await fetch(`/api/board-flow/${boardId}`,{
            method:"GET",
            headers:getAuthHeaders(),
            credentials:'include',
        });
        console.log("Board flow response:",response);
        return response.json();
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
            throw new Error("Failed to add contribution");
        }
        console.log("Add contribution response:", response);
        return response.json();
    }
}