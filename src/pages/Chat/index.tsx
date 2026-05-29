import { ChatSidebar } from '../../components/chat/ChatSidebar';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { MessageList } from '../../components/chat/MessageList';
import { MessageInput } from '../../components/chat/MessageInput';
import './Chat.css';

export function ChatPage() {
  return (
    <div className="chat-page">
      <ChatSidebar />
      <div className="chat-main">
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}
