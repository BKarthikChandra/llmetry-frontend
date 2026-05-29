import api from '../api/axios';
import type {
  Provider,
  RegisteredProvider,
  ProviderModel,
  AddModelResponse,
  RegisterProviderResponse,
} from '../types/provider';

export const getProviders = () =>
  api.get<Provider[]>('/user/providers').then((r) => r.data);

export const getRegisteredProviders = () =>
  api.get<RegisteredProvider[]>('/user/providers/registered').then((r) => r.data);

export const registerProvider = (providerId: number, apiKey: string) =>
  api
    .post<RegisterProviderResponse>(`/user/providers/${providerId}/register`, { apiKey })
    .then((r) => r.data);

export const getModels = (providerId: number) =>
  api.get<ProviderModel[]>(`/user/providers/${providerId}/models`).then((r) => r.data);

export const addModel = (providerId: number, model: string) =>
  api
    .post<AddModelResponse>(`/user/providers/${providerId}/models`, { model })
    .then((r) => r.data);
