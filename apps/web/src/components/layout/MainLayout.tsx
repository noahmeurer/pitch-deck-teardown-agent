import React from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export function MainLayout({ leftColumn, rightColumn }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col bg-white">
      <div className="fixed top-0 z-50 w-full">
        <Header />
      </div>
      <div className="relative flex flex-1 pt-14">
        {/* Left Column - PDF Viewer and Chat (Fixed) */}
        <div className="fixed top-14 flex w-[50%] flex-col space-y-4 p-4">
          {leftColumn}
        </div>
        
        {/* Right Column - Analysis (Scrollable) */}
        <div className="ml-[50%] w-[50%] overflow-y-auto px-8 py-4">
          {rightColumn}
        </div>
      </div>
    </div>
  );
} 