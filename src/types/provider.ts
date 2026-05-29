export interface Provider {
  id: number;
  displayName: string;
}

export interface RegisteredProvider {
  id: number;
  name: string;
  displayName: string;
  registeredAt: string;
}

export interface ProviderModel {
  id: number;
  model: string;
  createdAt: string;
}

export interface AddModelResponse {
  id: number;
  model: string;
  userProviderId: number;
  createdAt: string;
}

export interface RegisterProviderResponse {
  message: string;
}
