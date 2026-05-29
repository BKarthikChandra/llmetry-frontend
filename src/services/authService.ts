import api from '../api/axios';

export interface AuthPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface User {
  id: number;
  email: string;
}

export interface CreateUserResponse {
  id: number;
  email: string;
  createdOn: string;
  updatedOn: string | null;
}

export const login = (payload: AuthPayload) =>
  api.post<LoginResponse>('/auth/login', payload).then((r) => r.data);

export const createUser = (payload: AuthPayload) =>
  api.post<CreateUserResponse>('/auth/users', payload).then((r) => r.data);

export const getCurrentUser = () =>
  api.get<User>('/auth/me').then((r) => r.data);
