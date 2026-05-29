import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useChat } from '../../context/ChatContext';
import './MessageInput.css';

export function MessageInput() {
  const { send, isSending, selectedModelId, error, dismissError } = useChat();
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || isSending || !selectedModelId) return;
    setText('');
    await send(trimmed);
  }

  const canSend = !!selectedModelId && !isSending && text.trim().length > 0;

  return (
    <div className="msg-input-area">
      {error && (
        <div className="msg-input-error" role="alert">
          <span>{error}</span>
          <button className="msg-input-error-dismiss" onClick={dismissError} aria-label="Dismiss error">
            ✕
          </button>
        </div>
      )}
      <div className="msg-input-row">
        <textarea
          ref={textareaRef}
          className="msg-input-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedModelId
              ? 'Message… (Shift+Enter for new line)'
              : 'Select a provider and model to start chatting'
          }
          disabled={!selectedModelId || isSending}
          rows={1}
        />
        <button
          className="msg-input-send"
          onClick={handleSend}
          disabled={!canSend}
          title="Send message"
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={22} y1={2} x2={11} y2={13} />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
