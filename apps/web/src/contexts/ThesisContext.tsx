import React, { createContext, useContext, useState } from 'react';

interface Thesis {
  stage: string;
  check: string;
  verticals: string[];
  criteria: string[];
}

const defaultThesis: Thesis = {
  stage: 'Pre-Seed / Seed',
  check: '$250K – $1.5M',
  verticals: [
    'Data Infrastructure & Warehousing',
    'Data Integration & Pipeline Orchestration',
    'Data Observability & Quality',
    'Data Analytics & Business Intelligence',
    'AI/ML Platforms & Tooling',
  ],
  criteria: [
    "Falls squarely within the firm's target verticals",
    'Deep technical founding team (research or dev pedigree)',
    'Live prototype or early enterprise pilot in market',
    'Primary go-to-market focus is the US',
  ]
};

interface ThesisContextType {
  thesis: Thesis;
  setThesis: (thesis: Thesis) => void;
}

const ThesisContext = createContext<ThesisContextType | undefined>(undefined);

export function ThesisProvider({ children }: { children: React.ReactNode }) {
  const [thesis, setThesis] = useState<Thesis>(defaultThesis);

  return (
    <ThesisContext.Provider value={{ thesis, setThesis }}>
      {children}
    </ThesisContext.Provider>
  );
}

export function useThesis() {
  const context = useContext(ThesisContext);
  if (context === undefined) {
    throw new Error('useThesis must be used within a ThesisProvider');
  }
  return context;
}

export type { Thesis }; 