import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  type ReactNode,
} from 'react';
import { AuthContext } from './AuthContext';
import * as chatService from '../services/chatService';
import { sendMessageStream } from '../services/chatService';
import * as providerService from '../services/providerService';
import { getApiErrorMessage } from '../utils/errorMessage';
import { nowUtcIso } from '../utils/dateTime';
import type { ChatSummary, ChatMessage } from '../types/chat';
import type { ProviderModel } from '../types/provider';

const STREAMING_MSG_ID = -1;

interface ChatContextValue {
  chatList: ChatSummary[];
  activeChatId: number | null;
  messages: ChatMessage[];
  selectedProviderId: number | null;
  selectedModelId: number | null;
  availableModels: ProviderModel[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  isLoadingModels: boolean;
  isSending: boolean;
  isStreaming: boolean;
  error: string | null;
  refreshChats: () => Promise<void>;
  selectChat: (chatId: number) => Promise<void>;
  startNewChat: () => void;
  setSelectedProvider: (id: number | null) => void;
  setSelectedModel: (id: number | null) => void;
  send: (text: string) => Promise<void>;
  sendStream: (text: string) => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  dismissError: () => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);

  const [chatList, setChatList] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [availableModels, setAvailableModels] = useState<ProviderModel[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const data = await chatService.getChats();
      setChatList(data);
    } catch {
      // silently fail — chats are secondary to the active session
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    if (!auth?.isLoading && auth?.isAuthenticated) {
      refreshChats();
    }
  }, [auth?.isAuthenticated, auth?.isLoading, refreshChats]);

  const selectChat = useCallback(async (chatId: number) => {
    setActiveChatId(chatId);
    setMessages([]);
    setIsLoadingMessages(true);
    setError(null);
    try {
      const msgs = await chatService.getChatMessages(chatId);
      setMessages(msgs);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load messages.'));
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const startNewChat = useCallback(() => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
  }, []);

  const setSelectedProvider = useCallback((id: number | null) => {
    setSelectedProviderId(id);
    setSelectedModelId(null);
    setAvailableModels([]);
    if (id == null) return;
    setIsLoadingModels(true);
    providerService
      .getModels(id)
      .then(setAvailableModels)
      .catch(() => setAvailableModels([]))
      .finally(() => setIsLoadingModels(false));
  }, []);

  const setSelectedModel = useCallback((id: number | null) => {
    setSelectedModelId(id);
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!selectedModelId || isSending) return;

      const tempId = -Date.now();
      const optimisticMsg: ChatMessage = {
        id: tempId,
        chatId: activeChatId ?? 0,
        sender: 'user',
        content: text,
        createdAt: nowUtcIso(),
        providerModelId: selectedModelId,
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setIsSending(true);
      setError(null);

      try {
        const data = await chatService.sendMessage(
          selectedModelId,
          text,
          activeChatId ?? undefined,
        );

        const aiMsg: ChatMessage = {
          id: Date.now(),
          chatId: data.chatId,
          sender: 'ai',
          content: data.response,
          createdAt: nowUtcIso(),
          providerModelId: selectedModelId,
        };

        setMessages((prev) => [...prev, aiMsg]);

        if (activeChatId == null) {
          setActiveChatId(data.chatId);
          await refreshChats();
        }
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(getApiErrorMessage(err, 'Failed to send message.'));
      } finally {
        setIsSending(false);
      }
    },
    [selectedModelId, activeChatId, isSending, refreshChats],
  );

  const sendStream = useCallback(async (text: string) => {
    if (!selectedModelId || isSending || isStreaming) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    const tempUserId = -Date.now();
    const tempUserMsg: ChatMessage = {
      id: tempUserId,
      chatId: activeChatId ?? -1,
      sender: 'user',
      content: trimmed,
      createdAt: nowUtcIso(),
      providerModelId: selectedModelId,
    };
    const tempAiMsg: ChatMessage = {
      id: STREAMING_MSG_ID,
      chatId: activeChatId ?? -1,
      sender: 'ai',
      content: '',
      createdAt: nowUtcIso(),
      providerModelId: selectedModelId,
    };

    setMessages((prev) => [...prev, tempUserMsg, tempAiMsg]);
    setIsStreaming(true);
    setError(null);

    try {
      await sendMessageStream(
        selectedModelId,
        trimmed,
        {
          onChunk: (chunk) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === STREAMING_MSG_ID
                  ? { ...m, content: (m.content ?? '') + chunk }
                  : m,
              ),
            );
          },
          onDone: (payload) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === STREAMING_MSG_ID
                  ? { ...m, id: Date.now(), chatId: payload.chatId }
                  : m,
              ),
            );
            setIsStreaming(false);
            if (activeChatId == null) {
              setActiveChatId(payload.chatId);
              void refreshChats();
            }
          },
          onError: (payload) => {
            setError(payload.message);
            setIsStreaming(false);
            setMessages((prev) =>
              prev.filter((m) => m.id !== STREAMING_MSG_ID && m.id !== tempUserId),
            );
          },
        },
        activeChatId ?? undefined,
      );
    } catch (err) {
      setError((err as Error).message);
      setIsStreaming(false);
      setMessages((prev) =>
        prev.filter((m) => m.id !== STREAMING_MSG_ID && m.id !== tempUserId),
      );
    }
  }, [selectedModelId, activeChatId, isSending, isStreaming, refreshChats]);

  const deleteChat = useCallback(async (chatId: number) => {
    try {
      await chatService.deleteChat(chatId);
      setChatList((prev) => prev.filter((c) => c.chatId !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
        setError(null);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete chat.'));
    }
  }, [activeChatId]);

  const dismissError = useCallback(() => setError(null), []);

  return (
    <ChatContext.Provider
      value={{
        chatList,
        activeChatId,
        messages,
        selectedProviderId,
        selectedModelId,
        availableModels,
        isLoadingChats,
        isLoadingMessages,
        isLoadingModels,
        isSending,
        isStreaming,
        error,
        refreshChats,
        selectChat,
        startNewChat,
        setSelectedProvider,
        setSelectedModel,
        send,
        sendStream,
        deleteChat,
        dismissError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
