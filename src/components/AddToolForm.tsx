import { useState } from 'react';
import type { ToolCategory, ToolCondition } from '../lib/types';
import { CATEGORY_LABELS, CONDITION_LABELS } from '../lib/types';

interface AddToolFormProps {
  onSubmit: (data: AddToolFormData) => void;
  onCancel: () => void;
}

export interface AddToolFormData {
  name: string;
  description: string;
  category: ToolCategory;
  condition: ToolCondition;
  ownerName: string;
  location: string;
}

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [ToolCategory, string][];
const CONDITIONS = Object.entries(CONDITION_LABELS) as [ToolCondition, string][];

type FormErrors = Partial<Record<keyof AddToolFormData, string>>;

export function AddToolForm({ onSubmit, onCancel }: AddToolFormProps): JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ToolCategory>('hand-tools');
  const [condition, setCondition] = useState<ToolCondition>('good');
  const [ownerName, setOwnerName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = 'Tool name is required.';
    if (!description.trim()) errs.description = 'Please describe your tool.';
    if (!ownerName.trim()) errs.ownerName = 'Your name is required.';
    if (!location.trim()) errs.location = 'Location is required.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      condition,
      ownerName: ownerName.trim(),
      location: location.trim(),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Tool Listed!</h2>
        <p className="text-sm text-gray-500 mb-4">
          Your neighbors can now find and borrow your <strong>{name}</strong>.
        </p>
        <button onClick={onCancel} className="btn-primary">
          Back to Browse
        </button>
      </div>
    );
  }

  const inputClasses = (field: keyof AddToolFormData): string =>
    `w-full px-3 py-2.5 rounded-lg border text-sm placeholder:text-gray-400
     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors ${
       errors[field] ? 'border-brand-400 bg-brand-50/30' : 'border-gray-300'
     }`;

  return (
    <section aria-label="Add a tool listing">
      <div className="card p-6 max-w-lg mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Lend a Tool</h2>
          <p className="text-sm text-gray-500">Share a tool with your neighbors. Fill out the details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Tool Name */}
          <div>
            <label htmlFor="tool-name" className="block text-sm font-medium text-gray-700 mb-1">
              Tool Name <span className="text-brand-500">*</span>
            </label>
            <input
              id="tool-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g., DeWalt 20V Drill"
              className={inputClasses('name')}
              aria-required="true"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-xs text-brand-600 mt-1" role="alert">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="tool-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-brand-500">*</span>
            </label>
            <textarea
              id="tool-description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="What is it? Any accessories included?"
              rows={3}
              className={inputClasses('description') + ' resize-none'}
              aria-required="true"
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-xs text-brand-600 mt-1" role="alert">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="tool-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="tool-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ToolCategory)}
              className={inputClasses('category')}
            >
              {CATEGORIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="tool-condition" className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              id="tool-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as ToolCondition)}
              className={inputClasses('condition')}
            >
              {CONDITIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Owner Name */}
          <div>
            <label htmlFor="owner-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-brand-500">*</span>
            </label>
            <input
              id="owner-name"
              type="text"
              value={ownerName}
              onChange={(e) => {
                setOwnerName(e.target.value);
                if (errors.ownerName) setErrors((prev) => ({ ...prev, ownerName: undefined }));
              }}
              placeholder="e.g., Jane S."
              className={inputClasses('ownerName')}
              aria-required="true"
              aria-invalid={!!errors.ownerName}
            />
            {errors.ownerName && (
              <p className="text-xs text-brand-600 mt-1" role="alert">{errors.ownerName}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="tool-location" className="block text-sm font-medium text-gray-700 mb-1">
              Location / Street <span className="text-brand-500">*</span>
            </label>
            <input
              id="tool-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }));
              }}
              placeholder="e.g., Oak Street"
              className={inputClasses('location')}
              aria-required="true"
              aria-invalid={!!errors.location}
            />
            {errors.location && (
              <p className="text-xs text-brand-600 mt-1" role="alert">{errors.location}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              List My Tool
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
