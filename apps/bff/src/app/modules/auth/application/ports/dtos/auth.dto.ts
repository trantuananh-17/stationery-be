export interface RegisterUserBodyDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserResponse {
  userId: string;
}

export interface LoginUserBodyDto {
  email: string;
  password: string;
}

export interface RefreshTokenBodyDto {
  refreshToken: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}
