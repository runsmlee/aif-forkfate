import { useState } from 'react';
import type { Tool } from '../lib/types';
import { CATEGORY_LABELS, CONDITION_LABELS } from '../lib/types';

interface ToolDetailProps {
  tool: Tool;
  onClose: () => void;
  onBorrow: (toolId: string, borrowerName: string, message: string) => void;
}

export function ToolDetail({ tool, onClose, onBorrow }: ToolDetailProps): JSX.Element {
  const [borrowerName, setBorrowerName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!borrowerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    onBorrow(tool.id, borrowerName.trim(), message.trim());
    setSubmitted(true);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${tool.name} details`}
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900 truncate pr-4">{tool.name}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close details"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              {CATEGORY_LABELS[tool.category]}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
              {CONDITION_LABELS[tool.condition]}
            </span>
            {tool.available ? (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                Available
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                Borrowed by {tool.borrowedBy}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
          </div>

          {/* Owner info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
              {tool.owner.avatarInitials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{tool.owner.name}</p>
              <p className="text-xs text-gray-500">
                {tool.owner.distance} away · ★ {tool.owner.rating} · {tool.owner.toolCount} tools shared
              </p>
            </div>
          </div>

          {/* Borrow form */}
          {tool.available && !submitted && (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Request to Borrow</h3>

              <div>
                <label htmlFor="borrower-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-brand-500">*</span>
                </label>
                <input
                  id="borrower-name"
                  type="text"
                  value={borrowerName}
                  onChange={(e) => {
                    setBorrowerName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm
                    placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                    transition-colors"
                  aria-required="true"
                  aria-invalid={error !== ''}
                  aria-describedby={error ? 'name-error' : undefined}
                />
                {error && (
                  <p id="name-error" className="text-xs text-brand-600 mt-1" role="alert">
                    {error}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="borrow-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  id="borrow-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="When do you need it? Any details..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm
                    placeholder:text-gray-400 resize-none
                    focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                    transition-colors"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Request to Borrow
              </button>
            </form>
          )}

          {/* Success state */}
          {submitted && (
            <div className="text-center py-6 border-t border-gray-100">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3 text-xl">
                ✓
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Request Sent!</h3>
              <p className="text-sm text-gray-500">
                {tool.owner.name} will get back to you shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
