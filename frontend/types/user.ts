export interface User {
    _id: string;
    fullname: string;
    email: string;
    profilePic?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthUser extends User {
    isAuthenticated?: boolean;
}
