import api from '../api/axios';
import type { ChatSummary, ChatMessage, SendMessageResponse, StreamDeltaPayload, StreamDonePayload, StreamErrorPayload } from '../types/chat';

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onDone: (payload: StreamDonePayload) => void;
  onError: (payload: StreamErrorPayload) => void;
}

export const sendMessageStream = async (
  modelId: number,
  message: string,
  callbacks: StreamCallbacks,
  chatId?: number,
): Promise<void> => {
  const base = import.meta.env.VITE_API_BASE_URL ?? '';
  const url = new URL(`${base}/chat/${modelId}/send/stream`);
  if (chatId != null) url.searchParams.set('chatId', String(chatId));

  const token = localStorage.getItem('access_token');
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop()!;

    let eventType = '';
    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        const payload = JSON.parse(line.slice(5).trim());
        if (eventType === 'delta') callbacks.onChunk((payload as StreamDeltaPayload).chunk);
        else if (eventType === 'done') callbacks.onDone(payload as StreamDonePayload);
        else if (eventType === 'error') callbacks.onError(payload as StreamErrorPayload);
      }
    }
  }
};

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
