import type { ChatMessage } from '../../types/chat';
import { MarkdownMessage } from './MarkdownMessage';
import './MessageBubble.css';

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.sender === 'user';
  return (
    <div className={`msg-wrapper${isUser ? ' user' : ' ai'}`}>
      <div className={`msg-avatar${isUser ? ' user' : ''}`} aria-hidden="true">
        {isUser ? 'U' : 'AI'}
      </div>
      <div className={`msg-bubble${isUser ? ' user' : ' ai'}`}>
        {isUser ? (
          message.content ?? ''
        ) : (
          <MarkdownMessage content={message.content ?? ''} />
        )}
      </div>
    </div>
  );
}
