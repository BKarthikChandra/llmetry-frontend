import type { ChangeEvent } from 'react';
import { useChat } from '../../context/ChatContext';

export function ModelSelector() {
  const { availableModels, isLoadingModels, selectedProviderId, selectedModelId, setSelectedModel } =
    useChat();

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedModel(val ? Number(val) : null);
  }

  return (
    <select
      className="chat-select"
      value={selectedModelId ?? ''}
      onChange={handleChange}
      disabled={!selectedProviderId || isLoadingModels}
    >
      <option value="">
        {isLoadingModels ? 'Loading models...' : 'Model'}
      </option>
      {availableModels.map((m) => (
        <option key={m.id} value={m.id}>
          {m.model}
        </option>
      ))}
    </select>
  );
}
