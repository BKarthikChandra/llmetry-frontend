import { useChat } from '../../context/ChatContext';
import './ChatSidebar.css';

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ChatSidebar() {
  const { chatList, activeChatId, isLoadingChats, selectChat, startNewChat } = useChat();

  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">
        <span className="chat-sidebar-title">Chats</span>
        <button className="chat-sidebar-new-btn" onClick={startNewChat} title="New chat">
          <PlusIcon />
        </button>
      </div>

      <div className="chat-sidebar-list">
        {isLoadingChats && (
          <div className="chat-sidebar-placeholder">Loading...</div>
        )}
        {!isLoadingChats && chatList.length === 0 && (
          <div className="chat-sidebar-placeholder">No conversations yet</div>
        )}
        {chatList.map((chat) => (
          <button
            key={chat.chatId}
            className={`chat-sidebar-item${activeChatId === chat.chatId ? ' active' : ''}`}
            onClick={() => selectChat(chat.chatId)}
          >
            <span className="chat-sidebar-item-title">
              {chat.title ?? 'New conversation'}
            </span>
            <span className="chat-sidebar-item-date">
              {formatRelativeDate(chat.createdAt)}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </svg>
  );
}
