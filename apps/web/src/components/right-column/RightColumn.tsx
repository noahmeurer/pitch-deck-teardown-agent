import React, { useState, useEffect } from 'react';
import { useDocumentContext } from '@/context/DocumentContext';
import { config } from '@/config/env';

export function RightColumn() {
  const [isExecSummaryExpanded, setIsExecSummaryExpanded] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  const { documentStorage } = useDocumentContext();

  // Generate executive summary when PDF is uploaded
  useEffect(() => {
    const generateExecutiveSummary = async () => {
      if (!documentStorage.documentUrl || !documentStorage.bucketPath) {
        return;
      }

      // Don't regenerate if we already have a summary
      if (executiveSummary || isLoadingSummary) {
        return;
      }

      setIsLoadingSummary(true);
      setSummaryError(null);

      try {
        console.log('Requesting summary from', `${config.summaryServiceUrl}/summary`);
        const response = await fetch(`${config.summaryServiceUrl}/summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentUrl: documentStorage.documentUrl
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Summary generation failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setExecutiveSummary(data.data);
          // Auto-expand when summary is loaded
          setIsExecSummaryExpanded(true);
        } else {
          throw new Error(data.error || 'Summary generation failed');
        }

      } catch (err) {
        setSummaryError(err instanceof Error ? err.message : 'Failed to generate executive summary');
        console.error('Summary generation error:', err);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    generateExecutiveSummary();
  }, [documentStorage.documentUrl, documentStorage.bucketPath, documentStorage.bucketName, executiveSummary]);

  const toggleMetric = (metricId: number) => {
    setExpandedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const renderExecutiveSummaryContent = () => {
    if (isLoadingSummary) {
      return (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Generating executive summary...</p>
          </div>
        </div>
      );
    }

    if (summaryError) {
      return (
        <div className="border-t border-gray-200 p-4">
          <div className="text-red-600">
            <p className="font-medium">Error generating summary:</p>
            <p className="text-sm mt-1">{summaryError}</p>
            <button
              onClick={() => {
                setSummaryError(null);
                setExecutiveSummary(null);
                // This will trigger the useEffect to retry
              }}
              className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (executiveSummary) {
      return (
        <div className="border-t border-gray-200 p-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{executiveSummary}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-gray-200 p-4">
        <p className="text-gray-500">Upload a pitch deck to generate an executive summary</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <button
          onClick={() => setIsExecSummaryExpanded(!isExecSummaryExpanded)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Executive Summary</h2>
            {isLoadingSummary && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          <span className="text-gray-500">
            {isExecSummaryExpanded ? '−' : '+'}
          </span>
        </button>
        {isExecSummaryExpanded && renderExecutiveSummaryContent()}
      </div>

      {/* Proposition Fit */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-xl font-semibold">Proposition Fit</h2>
        <p className="mt-2 text-gray-500">Proposition fit analysis will appear here</p>
      </div>

      {/* Hexagon Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="h-[240px] flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <p className="text-gray-500">Hexagon chart will be implemented here</p>
        </div>
      </div>

      {/* Deep Dive */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-4 text-xl font-semibold">Deep Dive</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((metric) => (
            <div
              key={metric}
              className="rounded-lg border border-gray-200 bg-white"
            >
              <button
                onClick={() => toggleMetric(metric)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <h3 className="font-medium">Metric {metric}</h3>
                <span className="text-gray-500">
                  {expandedMetrics.includes(metric) ? '−' : '+'}
                </span>
              </button>
              {expandedMetrics.includes(metric) && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <p className="text-gray-500">Metric details will appear here</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 