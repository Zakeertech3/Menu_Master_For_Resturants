import React from 'react';
import { diningScenarios } from '../types';
import { PriceIcon } from './icons/PriceIcon';
import { LeafIcon } from './icons/LeafIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ClockIcon } from './icons/ClockIcon';
import { QuestionIcon } from './icons/QuestionIcon';

interface DiningScenarioSelectorProps {
  selectedScenario: string;
  onScenarioChange: (scenarioId: string) => void;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  PriceIcon,
  LeafIcon,
  UsersIcon,
  ClockIcon,
  QuestionIcon,
};

const DiningScenarioSelector: React.FC<DiningScenarioSelectorProps> = ({ selectedScenario, onScenarioChange }) => {

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">What's Your Goal Today?</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {diningScenarios.map((scenario) => {
          const IconComponent = iconMap[scenario.icon];
          const isSelected = selectedScenario === scenario.id;
          return (
            <button
              key={scenario.id}
              onClick={() => onScenarioChange(scenario.id)}
              className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-brand-primary bg-brand-light text-brand-dark font-semibold' 
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-primary/50 hover:bg-brand-light/50'
                }`}
            >
              <IconComponent className={`h-8 w-8 mb-1 ${isSelected ? 'text-brand-primary' : 'text-gray-400'}`} />
              <span className="text-sm">{scenario.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DiningScenarioSelector;