export interface User {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
    roles: string[];
}