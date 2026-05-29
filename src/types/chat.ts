export interface ChatSummary {
  chatId: number;
  createdAt: string;
  title: string | null;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  sender: 'user' | 'ai';
  content: string | null;
  createdAt: string;
  providerModelId: number | null;
}

export interface SendMessageResponse {
  response: string;
  chatId: number;
}
