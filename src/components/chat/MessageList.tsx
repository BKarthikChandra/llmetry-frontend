import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { MessageBubble } from './MessageBubble';
import './MessageList.css';

export function MessageList() {
  const { messages, isSending, isLoadingMessages, selectedModelId } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSending]);

  if (isLoadingMessages) {
    return (
      <div className="msg-list">
        <div className="msg-list-state">Loading messages...</div>
      </div>
    );
  }

  if (messages.length === 0 && !isSending) {
    return (
      <div className="msg-list">
        <div className="msg-list-state">
          <div className="msg-list-empty-icon">
            <BubbleIcon />
          </div>
          <p className="msg-list-empty-text">
            {selectedModelId
              ? 'Send a message to start the conversation'
              : 'Select a provider and model above to start chatting'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-list">
      <div className="msg-list-inner">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isSending && (
          <div className="msg-wrapper ai">
            <div className="msg-avatar" aria-hidden="true">AI</div>
            <div className="msg-bubble ai msg-thinking">
              <span className="thinking-dot" />
              <span className="thinking-dot" />
              <span className="thinking-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function BubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
