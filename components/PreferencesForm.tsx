import React from 'react';
import type { UserPreferences } from '../types';
import { SpiceIcon } from './icons/SpiceIcon';
import { LikeIcon } from './icons/LikeIcon';
import { DislikeIcon } from './icons/DislikeIcon';

interface PreferencesFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (newPreferences: UserPreferences) => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ preferences, onPreferencesChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onPreferencesChange({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const commonInputClasses = "mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm";
  const commonLabelClasses = "flex items-center text-md font-medium text-gray-700";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-6">
      <h3 className="text-xl font-semibold text-center text-gray-800">Fine-tune Your Tastes</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="likes" className={commonLabelClasses}>
            <LikeIcon className="h-5 w-5 mr-2 text-green-500" />
            Likes
          </label>
          <textarea
            id="likes"
            name="likes"
            rows={2}
            value={preferences.likes}
            onChange={handleChange}
            className={commonInputClasses}
            placeholder="e.g., chicken, seafood, vegetables"
          />
        </div>

        <div>
          <label htmlFor="dislikes" className={commonLabelClasses}>
            <DislikeIcon className="h-5 w-5 mr-2 text-red-500" />
            Dislikes & Allergies
          </label>
          <textarea
            id="dislikes"
            name="dislikes"
            rows={2}
            value={preferences.dislikes}
            onChange={handleChange}
            className={commonInputClasses}
            placeholder="e.g., gluten-free, no raw fish, peanuts"
          />
        </div>

        <div>
          <label htmlFor="spiceLevel" className={commonLabelClasses}>
            <SpiceIcon className="h-5 w-5 mr-2 text-orange-500" />
            Spice Level
          </label>
          <select
            id="spiceLevel"
            name="spiceLevel"
            value={preferences.spiceLevel}
            onChange={handleChange}
            className={commonInputClasses}
          >
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="spicy">Spicy</option>
            <option value="very_spicy">Very Spicy</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;