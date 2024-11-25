export default class User {
    id: number;
    customUsername?: string;
    email?: string;
    isAdmin?: boolean;
    roles?: string[];

    constructor (id: number, username?: string, email?: string, isAdmin?: boolean, roles?: string[]) {
        this.id = id;
        this.customUsername = username;
        this.email = email;
        this.isAdmin = isAdmin;
        this.roles = roles;
    }
}