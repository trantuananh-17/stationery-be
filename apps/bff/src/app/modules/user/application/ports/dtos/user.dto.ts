export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface UserResponse {
  id: string;
}
