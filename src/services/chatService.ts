import api from '../api/axios';
import type { ChatSummary, ChatMessage, SendMessageResponse } from '../types/chat';

export const getChats = () =>
  api.get<ChatSummary[]>('/user/chats').then((r) => r.data);

export const getChatMessages = (chatId: number) =>
  api.get<ChatMessage[]>(`/chat/${chatId}/messages`).then((r) => r.data);

export const sendMessage = (modelId: number, message: string, chatId?: number) =>
  api
    .post<SendMessageResponse>(
      `/chat/${modelId}/send`,
      { message },
      chatId != null ? { params: { chatId } } : undefined,
    )
    .then((r) => r.data);

export const deleteChat = (chatId: number) =>
  api.delete(`/chat/${chatId}`).then((r) => r.data);
