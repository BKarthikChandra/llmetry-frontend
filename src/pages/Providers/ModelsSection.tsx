import { useState, type FormEvent } from 'react';
import { useProviders } from '../../context/ProviderContext';
import { getApiErrorMessage } from '../../utils/errorMessage';

interface Props {
  providerId: number;
}

export function ModelsSection({ providerId }: Props) {
  const { models, defaultModels, addModel, setDefaultModel, loadingModels } = useProviders();
  const [modelInput, setModelInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const providerModels = models[providerId] ?? [];
  const defaultModelId = defaultModels[providerId];

  async function handleAddModel(e: FormEvent) {
    e.preventDefault();
    const trimmed = modelInput.trim();
    if (!trimmed) return;
    setIsAdding(true);
    setAddError(null);
    try {
      await addModel(providerId, trimmed);
      setModelInput('');
    } catch (err) {
      setAddError(getApiErrorMessage(err, 'Failed to add model. Check the model identifier and try again.'));
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="models-section">
      <div className="models-section-header">
        <span className="detail-section-label">MODELS</span>
      </div>

      {loadingModels && providerModels.length === 0 ? (
        <div className="models-loading">
          {[0, 1].map((i) => <div key={i} className="model-skeleton" />)}
        </div>
      ) : providerModels.length === 0 ? (
        <p className="models-empty">No models configured. Add one below.</p>
      ) : (
        <ul className="models-list">
          {providerModels.map((m) => {
            const isDefault = m.id === defaultModelId;
            return (
              <li key={m.id} className="model-item">
                <span className="model-prefix" aria-hidden="true">+</span>
                <span className="model-name">{m.model}</span>
                <div className="model-actions">
                  {isDefault ? (
                    <span className="model-default-badge">Default</span>
                  ) : (
                    <button
                      className="model-set-default"
                      onClick={() => setDefaultModel(providerId, m.id)}
                      title="Set as default model"
                    >
                      Set default
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {addError && (
        <div className="models-add-error" role="alert">
          <AlertIcon />
          {addError}
        </div>
      )}

      <form className="models-add-form" onSubmit={handleAddModel}>
        <input
          type="text"
          className="models-add-input"
          placeholder="e.g. gpt-4o-mini"
          value={modelInput}
          onChange={(e) => setModelInput(e.target.value)}
          disabled={isAdding}
          aria-label="Model identifier"
        />
        <button type="submit" className="models-add-btn" disabled={isAdding || !modelInput.trim()}>
          {isAdding ? <span className="detail-spinner small" /> : <PlusIcon />}
          {isAdding ? '' : 'Add'}
        </button>
      </form>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <line x1={12} y1={5} x2={12} y2={19} />
      <line x1={5} y1={12} x2={19} y2={12} />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <circle cx={12} cy={12} r={10} />
      <line x1={12} y1={8} x2={12} y2={12} />
      <line x1={12} y1={16} x2={12.01} y2={16} />
    </svg>
  );
}
