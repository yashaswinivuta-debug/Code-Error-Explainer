
import React from 'react';
import type { Explanation } from '../types';
import { LanguageIcon, MeaningIcon, CauseIcon, FixIcon, TipIcon } from './icons';

interface ExplanationCardProps {
  explanation: Explanation;
}

const ExplanationSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full mt-1">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
      <div className="mt-1 text-slate-400 prose prose-invert prose-p:text-slate-400 prose-pre:bg-slate-900/50 prose-pre:p-4 prose-pre:rounded-md">
        {children}
      </div>
    </div>
  </div>
);

const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation }) => {
  // Simple markdown to HTML for code blocks
  const renderFixSuggestion = (text: string) => {
    const parts = text.split(/(`{1,3}[^`]+`{1,3})/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.substring(3, part.length - 3).trim();
        return (
          <pre key={index} className="bg-slate-900/70 p-4 rounded-md overflow-x-auto">
            <code className="font-mono text-sm text-sky-300">{code}</code>
          </pre>
        );
      }
       if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded-md font-mono">{part.slice(1, -1)}</code>;
      }
      // Render newlines as <br>
      return part.split('\n').map((line, i) => (
        <React.Fragment key={`${index}-${i}`}>
          {line}
          {i < part.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    });
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-2xl animate-fade-in">
      <div className="space-y-6">
        <ExplanationSection icon={<LanguageIcon />} title="Language">
          <p>{explanation.language}</p>
        </ExplanationSection>
        <ExplanationSection icon={<MeaningIcon />} title="Error Meaning">
          <p>{explanation.meaning}</p>
        </ExplanationSection>
        <ExplanationSection icon={<CauseIcon />} title="Root Cause">
          <p>{explanation.cause}</p>
        </ExplanationSection>
        <ExplanationSection icon={<FixIcon />} title="Fix Suggestion">
          <div>{renderFixSuggestion(explanation.fix)}</div>
        </ExplanationSection>
        <ExplanationSection icon={<TipIcon />} title="Tip">
          <p>{explanation.tip}</p>
        </ExplanationSection>
      </div>
    </div>
  );
};

export default ExplanationCard;
