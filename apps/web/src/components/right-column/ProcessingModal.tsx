import React from 'react';

interface ProcessingModalProps {
  isVisible: boolean;
}

interface ProcessingErrorModalProps {
  isError: string | null;
}

export function ProcessingModal({ isVisible }: ProcessingModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-14 right-0 w-[50%] h-[calc(100vh-3.5rem)] flex items-center justify-center bg-white bg-opacity-80">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <h3 className="text-lg font-semibold text-gray-900">Processing Document</h3>
          <p className="text-gray-500">Please wait while we analyze your pitch deck...</p>
        </div>
      </div>
    </div>
  );
} 

export function ProcessingErrorModal({ isError }: ProcessingErrorModalProps) {
  if (isError === null) return null;

  return (
    <div className="fixed top-14 right-0 w-[50%] h-[calc(100vh-3.5rem)] flex items-center justify-center bg-white bg-opacity-80">
      <div className="rounded-lg bg-white p-8 shadow-xl border-3 border-red-500">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Error Processing Document</h3>
          <p className="text-gray-500">Please refresh the page and try again.</p>
        </div>
      </div>
    </div>
  );
} 