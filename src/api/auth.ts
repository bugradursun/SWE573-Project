import { getAuthHeaders, getDefaultHeaders } from "./config";
import { GetMeResponse, User } from '../models/types';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    message?: string;
    username?: User;
    email?: string;
}

export interface RegisterRequest {
    username?: string;
    email?: string;
    password?: string;
    age: string;
    profession: string;
}

export interface RegisterResponse {
    username?: string;
    email?: string;
    statusText?: string;
}

export interface UserProfile {
    username: string;
    email: string;
    age?: number;
    profession?: string;
    displayName?: string;
}

export const authApi = {
    login: async(data: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: getDefaultHeaders(),
            body: JSON.stringify(data),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error("Login failed");
        }
        
        const responseData = await response.json();
        console.log("Login response data:", responseData); // Debug log
        
        // Store the token and user data if they exist
        if (responseData.token) {
            localStorage.setItem('token', responseData.token);
        }

        // Create user object with email
        const userData = {
            username: responseData.username,
            email: responseData.email
        };
        console.log("Storing user data:", userData); // Debug log
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        return responseData;
    },
    register: async(data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: getDefaultHeaders(),
            body: JSON.stringify(data),
            credentials: 'include',
        });
        console.log("response", response);
        if (!response.ok) {
            throw new Error("Registration failed");
        }
        return response.json();
    },
    getMe:async() :Promise<GetMeResponse> => {
        const response = await fetch(`/api/user/me`,{
            method:"GET",
            headers:getAuthHeaders(),
            credentials:"include",
        });
        if(!response.ok){
            throw new Error("Failed to fetch user data");
        }
        console.log("Response of getMe endpoint",response);
        return response.json();
    },
    updateUser:async(data:UserProfile):Promise<UserProfile> => {
        const response = await fetch(`/api/user/update`, {
            method:"POST",
            headers:getAuthHeaders(),
            credentials:"include",
        });
        if(!response.ok) {
            throw new Error("Failed to update user!");
        }
        console.log("Response of update user endpoint",response);
        return response.json();
    }
};