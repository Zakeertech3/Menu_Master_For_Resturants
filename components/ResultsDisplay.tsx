import React from 'react';
import type { AnalysisResult, Dish, Recommendation, DietaryAlert } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import { DishIcon } from './icons/DishIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { AlertIcon } from './icons/AlertIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <button
        className="w-full p-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {icon}
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <svg className={`w-6 h-6 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};


const DishCard: React.FC<{ dish: Dish }> = ({ dish }) => (
  <div className="p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
    <h4 className="font-bold text-lg text-brand-dark">{dish.dishName}</h4>
    <p className="mt-1 text-gray-700 italic">"{dish.explanation}"</p>
    <div className="mt-2 text-sm">
      <p><strong className="text-gray-600">Taste:</strong> {dish.tasteProfile}</p>
      <p><strong className="text-gray-600">Ingredients:</strong> {dish.keyIngredients.join(', ')}</p>
      {dish.allergenAlerts && dish.allergenAlerts.length > 0 && (
        <p className="text-red-600"><strong className="text-red-700">Allergens:</strong> {dish.allergenAlerts.join(', ')}</p>
      )}
    </div>
  </div>
);

const RecommendationCard: React.FC<{ item: Recommendation }> = ({ item }) => (
  <div className="p-4 bg-green-50 rounded-xl mb-3 border border-green-200">
    <h4 className="font-bold text-lg text-green-800">{item.dishName}</h4>
    <p className="mt-1 text-green-700">{item.reason}</p>
  </div>
);

const AlertCard: React.FC<{ item: DietaryAlert }> = ({ item }) => (
  <div className="p-4 bg-red-50 rounded-xl mb-3 border border-red-200">
    <h4 className="font-bold text-lg text-red-800">{item.dishName}</h4>
    <p className="mt-1 text-red-700">{item.reason}</p>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Menu Scan Results */}
      <div className="bg-brand-light p-5 rounded-2xl shadow-md border border-brand-primary/20">
        <div className="flex items-center mb-3">
          <InfoIcon className="h-7 w-7 text-brand-primary mr-3" />
          <h2 className="text-2xl font-bold text-brand-dark">Menu Scan Results</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-lg"><span className="font-semibold">Cuisine:</span> {result.menuScanResults.cuisineType}</div>
            <div className="bg-white p-3 rounded-lg"><span className="font-semibold">Style:</span> {result.menuScanResults.restaurantStyle}</div>
            <div className="bg-white p-3 rounded-lg"><span className="font-semibold">Language:</span> {result.menuScanResults.language}</div>
        </div>
      </div>

      {/* Smart Recommendations */}
      {result.smartRecommendations && result.smartRecommendations.length > 0 && (
        <SectionCard title="Smart Recommendations" icon={<ThumbsUpIcon className="h-6 w-6 text-green-500 mr-3" />} defaultOpen={true}>
          <div className="space-y-3">
            {result.smartRecommendations.map((item, index) => <RecommendationCard key={index} item={item} />)}
          </div>
        </SectionCard>
      )}

      {/* Dietary Alerts */}
      {result.dietaryAlerts && result.dietaryAlerts.length > 0 && (
        <SectionCard title="Dietary Alerts" icon={<AlertIcon className="h-6 w-6 text-red-500 mr-3" />} defaultOpen={true}>
          <div className="space-y-3">
            {result.dietaryAlerts.map((item, index) => <AlertCard key={index} item={item} />)}
          </div>
        </SectionCard>
      )}

      {/* Dish Decoder */}
      {result.dishDecoder && result.dishDecoder.length > 0 && (
         <SectionCard title="Dish Decoder" icon={<DishIcon className="h-6 w-6 text-brand-primary mr-3" />} defaultOpen={false}>
            <div className="space-y-3">
              {result.dishDecoder.map((dish, index) => <DishCard key={index} dish={dish} />)}
            </div>
         </SectionCard>
      )}

      {/* Cultural Insights */}
      {result.culturalInsights && result.culturalInsights.content && (
        <SectionCard title={result.culturalInsights.title} icon={<GlobeIcon className="h-6 w-6 text-blue-500 mr-3" />}>
          <p className="text-gray-600 whitespace-pre-wrap">{result.culturalInsights.content}</p>
        </SectionCard>
      )}
      
      {/* Ordering Strategy */}
      {result.orderingStrategy && result.orderingStrategy.content && (
        <SectionCard title={result.orderingStrategy.title} icon={<LightbulbIcon className="h-6 w-6 text-yellow-500 mr-3" />}>
          <p className="text-gray-600 whitespace-pre-wrap">{result.orderingStrategy.content}</p>
        </SectionCard>
      )}

    </div>
  );
};

export default ResultsDisplay;