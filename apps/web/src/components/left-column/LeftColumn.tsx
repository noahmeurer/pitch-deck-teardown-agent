import React from 'react';
import { PitchDeck } from '@/components/document/Document';

export function LeftColumn() {
  return (
    <>
      {/* PDF Viewer */}
      <div className="h-[calc(95vh-16rem)] rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex h-full items-center justify-center">
            <PitchDeck />
          </div>
      </div>

      {/* Chat Interface */}
      <div className="h-[180px] rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto rounded-lg bg-gray-50 p-3">
            <p className="text-gray-500">Chat messages will appear here</p>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
              <input
                type="text"
                placeholder="Type to ask a question..."
                className="flex-1 bg-transparent px-2 text-sm outline-none"
                disabled
              />
              <button
                className="rounded bg-blue-500 px-3 py-1.5 text-sm text-white opacity-50"
                disabled
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 