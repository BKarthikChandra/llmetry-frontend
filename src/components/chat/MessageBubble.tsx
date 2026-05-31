import type { ChatMessage } from '../../types/chat';
import { MarkdownMessage } from './MarkdownMessage';
import './MessageBubble.css';

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
}

function StreamingMessage({ content }: { content: string }) {
  return (
    <div className="streaming-content">
      <MarkdownMessage content={content} />
    </div>
  );
}

export function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.sender === 'user';
  const content = message.content ?? '';
  const isThinking = !isUser && isStreaming && content.length === 0;

  return (
    <div className={`msg-wrapper${isUser ? ' user' : ' ai'}`}>
      <div className={`msg-avatar${isUser ? ' user' : ''}`} aria-hidden="true">
        {isUser ? 'U' : 'AI'}
      </div>
      {isThinking ? (
        <span className="msg-thinking-dot" aria-label="AI is thinking" />
      ) : (
        <div className={`msg-bubble${isUser ? ' user' : ' ai'}${isStreaming ? ' msg-streaming' : ''}`}>
          {isUser ? (
            content
          ) : isStreaming ? (
            <StreamingMessage content={content} />
          ) : (
            <MarkdownMessage content={content} />
          )}
        </div>
      )}
    </div>
  );
}
