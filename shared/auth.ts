export interface VerificationRequest {
  username: string;
}

export interface VerificationResponse {
  success: boolean;
  code: string;
  message: string;
  expiresIn: number;
}

export interface VerifyCodeRequest {
  username: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    uuid: string;
    verified: boolean;
    rank: string;
    joinDate: string;
  };
}

export interface AuthStatus {
  isAuthenticated: boolean;
  user?: {
    id: string;
    username: string;
    uuid: string;
    verified: boolean;
    rank: string;
    joinDate: string;
  };
}
