export interface AdminUser {
  adminId: string;
  email: string;
  role: string;
  name: string;
}

export interface LoginResponse {
  accessToken: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface MeResponse {
  success: boolean;
  data: AdminUser;
}
