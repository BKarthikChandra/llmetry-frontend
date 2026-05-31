import { useChat } from '../../context/ChatContext';
import { formatUtcDateTimeToLocal, formatUtcRelativeDate, sortUtcDesc } from '../../utils/dateTime';
import './ChatSidebar.css';

export function ChatSidebar() {
  const { chatList, activeChatId, isLoadingChats, selectChat, startNewChat, deleteChat } = useChat();

  const sortedChats = [...chatList].sort(
    (a, b) => sortUtcDesc(a.lastActivityAt, b.lastActivityAt),
  );

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
        {!isLoadingChats && sortedChats.length === 0 && (
          <div className="chat-sidebar-placeholder">No conversations yet</div>
        )}
        {sortedChats.map((chat) => (
          <div
            key={chat.chatId}
            className={`chat-sidebar-item${activeChatId === chat.chatId ? ' active' : ''}`}
          >
            <button
              className="chat-sidebar-item-select"
              onClick={() => selectChat(chat.chatId)}
            >
              <span className="chat-sidebar-item-title">
                {chat.title ?? 'New conversation'}
              </span>
              <span
                className="chat-sidebar-item-date"
                title={formatUtcDateTimeToLocal(chat.lastActivityAt)}
              >
                {formatUtcRelativeDate(chat.lastActivityAt)}
              </span>
            </button>
            <button
              className="chat-sidebar-item-delete"
              onClick={() => deleteChat(chat.chatId)}
              title="Delete chat"
            >
              <TrashIcon />
            </button>
          </div>
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}
