import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  type ReactNode,
} from 'react';
import * as providerService from '../services/providerService';
import type { Provider, RegisteredProvider, ProviderModel } from '../types/provider';
import { AuthContext } from './AuthContext';

const DEFAULT_MODELS_KEY = 'llmetry-default-models';

function loadDefaultModels(): Record<number, number> {
  try {
    const stored = localStorage.getItem(DEFAULT_MODELS_KEY);
    return stored ? (JSON.parse(stored) as Record<number, number>) : {};
  } catch {
    return {};
  }
}

function saveDefaultModels(defaults: Record<number, number>) {
  localStorage.setItem(DEFAULT_MODELS_KEY, JSON.stringify(defaults));
}

interface ProviderContextValue {
  providers: Provider[];
  registered: RegisteredProvider[];
  selectedProviderId: number | null;
  models: Record<number, ProviderModel[]>;
  defaultModels: Record<number, number>;
  loadingProviders: boolean;
  loadingRegistered: boolean;
  loadingModels: boolean;
  selectProvider: (id: number) => void;
  registerProvider: (providerId: number, apiKey: string) => Promise<void>;
  addModel: (providerId: number, model: string) => Promise<void>;
  setDefaultModel: (providerId: number, modelId: number) => void;
  isRegistered: (providerId: number) => boolean;
  getRegisteredInfo: (providerId: number) => RegisteredProvider | undefined;
  refreshRegistered: () => Promise<void>;
}

export const ProviderContext = createContext<ProviderContextValue | null>(null);

export function useProviders() {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error('useProviders must be used inside ProviderProvider');
  return ctx;
}

export function ProviderProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [registered, setRegistered] = useState<RegisteredProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [models, setModels] = useState<Record<number, ProviderModel[]>>({});
  const [defaultModels, setDefaultModels] = useState<Record<number, number>>(loadDefaultModels);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingRegistered, setLoadingRegistered] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const isRegistered = useCallback(
    (providerId: number): boolean => {
      const provider = providers.find((p) => p.id === providerId);
      if (!provider) return false;
      return registered.some((r) => r.displayName === provider.displayName);
    },
    [providers, registered],
  );

  const getRegisteredInfo = useCallback(
    (providerId: number): RegisteredProvider | undefined => {
      const provider = providers.find((p) => p.id === providerId);
      if (!provider) return undefined;
      return registered.find((r) => r.displayName === provider.displayName);
    },
    [providers, registered],
  );

  const loadModels = useCallback(async (providerId: number) => {
    setLoadingModels(true);
    try {
      const data = await providerService.getModels(providerId);
      setModels((prev) => ({ ...prev, [providerId]: data }));
    } catch {
      // provider not registered or other error — leave models unchanged
    } finally {
      setLoadingModels(false);
    }
  }, []);

  const refreshRegistered = useCallback(async () => {
    setLoadingRegistered(true);
    try {
      const data = await providerService.getRegisteredProviders();
      setRegistered(data);
    } finally {
      setLoadingRegistered(false);
    }
  }, []);

  // Load public provider catalog on mount
  useEffect(() => {
    setLoadingProviders(true);
    providerService
      .getProviders()
      .then(setProviders)
      .finally(() => setLoadingProviders(false));
  }, []);

  // Load registered providers when auth is ready
  useEffect(() => {
    if (!auth?.isLoading && auth?.isAuthenticated) {
      refreshRegistered();
    }
  }, [auth?.isAuthenticated, auth?.isLoading, refreshRegistered]);

  const selectProvider = useCallback((id: number) => {
    setSelectedProviderId(id);
  }, []);

  // Load models when a registered provider is selected
  useEffect(() => {
    if (selectedProviderId == null) return;
    const provider = providers.find((p) => p.id === selectedProviderId);
    if (!provider) return;
    const isReg = registered.some((r) => r.displayName === provider.displayName);
    if (isReg && !models[selectedProviderId]) {
      loadModels(selectedProviderId);
    }
  }, [selectedProviderId, providers, registered, models, loadModels]);

  const registerProvider = useCallback(
    async (providerId: number, apiKey: string) => {
      await providerService.registerProvider(providerId, apiKey);
      await refreshRegistered();
      await loadModels(providerId);
    },
    [refreshRegistered, loadModels],
  );

  const addModel = useCallback(async (providerId: number, model: string) => {
    await providerService.addModel(providerId, model);
    const data = await providerService.getModels(providerId);
    setModels((prev) => ({ ...prev, [providerId]: data }));
  }, []);

  const setDefaultModel = useCallback((providerId: number, modelId: number) => {
    setDefaultModels((prev) => {
      const next = { ...prev, [providerId]: modelId };
      saveDefaultModels(next);
      return next;
    });
  }, []);

  return (
    <ProviderContext.Provider
      value={{
        providers,
        registered,
        selectedProviderId,
        models,
        defaultModels,
        loadingProviders,
        loadingRegistered,
        loadingModels,
        selectProvider,
        registerProvider,
        addModel,
        setDefaultModel,
        isRegistered,
        getRegisteredInfo,
        refreshRegistered,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}
