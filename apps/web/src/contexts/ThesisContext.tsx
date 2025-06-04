import React, { createContext, useContext, useState } from 'react';

interface Thesis {
  stage: string;
  check: string;
  verticals: string[];
  criteria: string[];
}

const defaultThesis: Thesis = {
  stage: 'Pre-Seed / Seed',
  check: '$500K - $1.5M',
  verticals: [
    "Core Data Infrastructure & Analytical Engines",
    "Data Movement, Streaming & Pipeline Orchestration",
    "Data Governance, Observability & Trust",
    "ML / AI Development & Model Ops Platforms",
    "Applied AI for Scientific, Industrial & Regulated Domains",
    "Cloud-Native Dev-Ops & Serverless Infra",
  ],
  criteria: [
    "Falls squarely within the firm's target verticals",
    "Deep technical founding team (research or dev pedigree)",
    "Working prototype **or** early design-partner deployments showing enterprise pull",
    "Focused on enterprise buyers, with grounding in North American markets through team, customer base, or go-to-market approach — even if globally extensible",
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