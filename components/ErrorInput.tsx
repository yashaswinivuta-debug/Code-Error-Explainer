
import React from 'react';

interface ErrorInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ErrorInput: React.FC<ErrorInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g., Traceback (most recent call last): File 'main.py', line 1, in <module> print(x) NameError: name 'x' is not defined"
        rows={8}
        className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 resize-none font-mono text-sm"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full sm:w-auto self-center sm:self-end px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze Error'
        )}
      </button>
    </div>
  );
};

export default ErrorInput;
