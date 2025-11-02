
import React, { useState, useCallback } from 'react';
import type { Explanation } from './types';
import { explainError } from './services/geminiService';
import ErrorInput from './components/ErrorInput';
import ExplanationCard from './components/ExplanationCard';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!errorMessage.trim()) {
      setApiError('Please paste an error message first.');
      return;
    }
    setIsLoading(true);
    setApiError(null);
    setExplanation(null);

    try {
      const result = await explainError(errorMessage);
      setExplanation(result);
    } catch (error) {
      console.error(error);
      setApiError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">
            Code Error Explainer 🤖
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Paste your error message below, and I'll help you understand it.
          </p>
        </header>
        
        <ErrorInput
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />
        
        <div className="w-full">
          {isLoading && <LoadingSpinner />}
          {apiError && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{apiError}</span>
            </div>
          )}
          {explanation && <ExplanationCard explanation={explanation} />}
        </div>
      </main>
    </div>
  );
};

export default App;
