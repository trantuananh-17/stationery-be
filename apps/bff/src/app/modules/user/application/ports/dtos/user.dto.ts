export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface UserResponse {
  userId: string;
}

export interface UserAuthResponse {
  userId: string;
  role: string;
  permissions: string[];
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}
