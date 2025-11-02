
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400">Thinking...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
