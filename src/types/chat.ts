export interface ChatSummary {
  chatId: number;
  createdOn: string;
  title: string | null;
  lastActivityAt: string;
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

export interface StreamDeltaPayload {
  chunk: string;
}

export interface StreamDonePayload {
  chatId: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
}

export interface StreamErrorPayload {
  message: string;
}
