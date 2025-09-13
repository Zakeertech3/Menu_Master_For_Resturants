import React, { useState, useCallback } from 'react';
// FIX: Import `AnalysisResult` type to resolve error on line 19.
import type { UserPreferences, AnalysisResult } from './types';
import { analyzeMenu } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import PreferencesForm from './components/PreferencesForm';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import { ForkKnifeIcon } from './components/icons/ForkKnifeIcon';
import DiningScenarioSelector from './components/DiningScenarioSelector';

const App: React.FC = () => {
  const [menuImage, setMenuImage] = useState<File | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    likes: 'chicken or seafood, mild to medium spicy',
    dislikes: 'very spicy, raw fish, organ meats',
    spiceLevel: 'medium',
    diningScenario: 'none',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeClick = useCallback(async () => {
    if (!menuImage) {
      setError('Please upload a menu image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeMenu(menuImage, preferences);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while analyzing the menu. The image might be too blurry or an API error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [menuImage, preferences]);

  const handleReset = () => {
    setMenuImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handlePreferencesChange = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
          <ForkKnifeIcon className="h-8 w-8 text-brand-primary" />
          <h1 className="ml-3 text-3xl font-bold text-gray-900 tracking-tight">MenuMaster</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {!analysisResult && !isLoading && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Confused by a menu?</h2>
                <p className="mt-2 text-lg text-gray-500">Let me help you find the perfect dish. Just upload a photo of the menu to get started.</p>
              </div>
              <ImageUploader onImageSelect={setMenuImage} />
              <DiningScenarioSelector 
                selectedScenario={preferences.diningScenario || 'none'}
                onScenarioChange={(scenarioId) => handlePreferencesChange({ diningScenario: scenarioId })}
              />
              <PreferencesForm 
                preferences={preferences} 
                onPreferencesChange={(prefs) => handlePreferencesChange(prefs)} 
              />
              {error && <div className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</div>}
              <div className="text-center pt-4">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={!menuImage || isLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Menu'}
                </button>
              </div>
            </div>
          )}

          {isLoading && <Loader />}

          {analysisResult && (
            <div>
              <ResultsDisplay result={analysisResult} />
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                >
                  Scan Another Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center py-6 text-sm text-gray-500">
          <p>Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;