import { RequestHandler } from "express";
import { VerificationRequest, VerificationResponse, VerifyCodeRequest, VerifyCodeResponse, AuthStatus } from "../../shared/auth";
import { config } from "../../shared/config";
import { ApiResponse } from "../../shared/types";

// Mock user database - in production this would be a real database
const mockUsers = new Map();
const verificationCodes = new Map();

export const requestVerification: RequestHandler = (req, res) => {
  const { username }: VerificationRequest = req.body;
  
  if (!username || username.trim().length < 3) {
    const response: VerificationResponse = {
      success: false,
      code: "",
      message: "Username must be at least 3 characters long",
      expiresIn: 0
    };
    return res.status(400).json(response);
  }
  
  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + (config.auth.verificationCodeExpires * 1000);
  
  // Store verification code
  verificationCodes.set(username.toLowerCase(), {
    code,
    expiresAt,
    username: username.trim()
  });
  
  // In production, you would send this code to the Minecraft server
  console.log(`Verification code for ${username}: ${code}`);
  
  const response: VerificationResponse = {
    success: true,
    code: code, // In production, don't send the actual code
    message: "Verification code generated. Join the server and use /verify command.",
    expiresIn: config.auth.verificationCodeExpires
  };
  
  res.json(response);
};

export const verifyCode: RequestHandler = (req, res) => {
  const { username, code }: VerifyCodeRequest = req.body;
  
  const storedData = verificationCodes.get(username.toLowerCase());
  
  if (!storedData) {
    const response: VerifyCodeResponse = {
      success: false,
      message: "No verification code found for this username"
    };
    return res.status(404).json(response);
  }
  
  if (Date.now() > storedData.expiresAt) {
    verificationCodes.delete(username.toLowerCase());
    const response: VerifyCodeResponse = {
      success: false,
      message: "Verification code has expired"
    };
    return res.status(400).json(response);
  }
  
  if (storedData.code !== code) {
    const response: VerifyCodeResponse = {
      success: false,
      message: "Invalid verification code"
    };
    return res.status(400).json(response);
  }
  
  // Create user session
  const user = {
    id: Date.now().toString(),
    username: storedData.username,
    uuid: `uuid-${Date.now()}`,
    verified: true,
    rank: "default",
    joinDate: new Date().toISOString()
  };
  
  mockUsers.set(user.id, user);
  verificationCodes.delete(username.toLowerCase());
  
  // In production, generate a proper JWT token
  const token = `token_${user.id}_${Date.now()}`;
  
  const response: VerifyCodeResponse = {
    success: true,
    message: "Verification successful!",
    token,
    user
  };
  
  res.json(response);
};

export const getAuthStatus: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: ApiResponse<AuthStatus> = {
      success: true,
      data: { isAuthenticated: false }
    };
    return res.json(response);
  }
  
  const token = authHeader.substring(7);
  
  // In production, verify JWT token properly
  const userId = token.split('_')[1];
  const user = mockUsers.get(userId);
  
  if (!user) {
    const response: ApiResponse<AuthStatus> = {
      success: true,
      data: { isAuthenticated: false }
    };
    return res.json(response);
  }
  
  const response: ApiResponse<AuthStatus> = {
    success: true,
    data: {
      isAuthenticated: true,
      user
    }
  };
  
  res.json(response);
};

export const logout: RequestHandler = (req, res) => {
  // In production, invalidate the JWT token
  const response: ApiResponse = {
    success: true,
    message: "Logged out successfully"
  };
  
  res.json(response);
};
