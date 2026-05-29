import { ProviderSelector } from './ProviderSelector';
import { ModelSelector } from './ModelSelector';
import './ChatHeader.css';

export function ChatHeader() {
  return (
    <div className="chat-header">
      <div className="chat-header-selectors">
        <ProviderSelector />
        <ModelSelector />
      </div>
    </div>
  );
}
