import React, { useState, useEffect } from 'react';
import { useDocumentContext } from '@/contexts/DocumentContext';
import { config } from '@/config/env';
import { ProcessingModal, ProcessingErrorModal } from './ProcessingModal';

export function RightColumn() {
  const [isExecSummaryExpanded, setIsExecSummaryExpanded] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([]);
  const [multiHeadingSummary, setMultiHeadingSummary] = useState<string | null>(null);
  const [isParsingDocument, setIsParsingDocument] = useState(false);
  const [multiHeadingSummaryError, setMultiHeadingSummaryError] = useState<string | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);
  const [isLoadingExecSummary, setIsLoadingExecSummary] = useState(false);
  const [execSummaryError, setExecSummaryError] = useState<string | null>(null);
  
  const { documentStorage } = useDocumentContext();

  // Parse and summarize the pitch deck when the document is uploaded
  useEffect(() => {
    const generateExecutiveSummary = async () => {
      if (!documentStorage.documentUrl || !documentStorage.bucketPath) {
        return;
      }

      // Don't regenerate if we already have a summary
      if (multiHeadingSummary || isParsingDocument) {
        return;
      }

      setIsParsingDocument(true);
      setMultiHeadingSummaryError(null);

      try {
        console.log('Parsing and summarizing document from', `${config.summaryServiceUrl}/parse`);
        const response = await fetch(`${config.summaryServiceUrl}/parse`, {
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
          throw new Error(errorData.error || `Multi-heading summary generation failed with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setMultiHeadingSummary(data.data);
          console.log('Multi-heading summary sucessfully generated:', data.data);
        } else {
          throw new Error(data.error || 'Multi-heading summary generation failed');
        }

      } catch (err) {
        setMultiHeadingSummaryError(err instanceof Error ? err.message : 'Failed to generate multi-heading summary');
        console.error('Multi-heading summary generation error:', err);
      } finally {
        setIsParsingDocument(false);
      }
    };

    generateExecutiveSummary();
  }, [documentStorage.documentUrl, documentStorage.bucketPath, documentStorage.bucketName, multiHeadingSummary, isParsingDocument]);

  useEffect(() => {
    const generateExecSummary = async () => {
      if (!multiHeadingSummary || isParsingDocument) {
        return;
      }

      if (executiveSummary || isLoadingExecSummary) {
        return;
      }

      setIsLoadingExecSummary(true);
      setExecSummaryError(null);

      try {
        const response = await fetch(`${config.summaryServiceUrl}/summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            multiHeadingSummary: multiHeadingSummary
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Executive summary generation failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setExecutiveSummary(data.data);
          // Auto-expand when summary is loaded
          setIsExecSummaryExpanded(true);
        } else {
          throw new Error(data.error || 'Executive summary generation failed');
        }

      } catch (error) {
        setExecSummaryError(error instanceof Error ? error.message : 'Failed to generate executive summary');
        console.error('Executive summary generation error:', error);
      } finally {
        setIsLoadingExecSummary(false);
      }
    };

    generateExecSummary();
  }, [multiHeadingSummary, isParsingDocument]);

  const toggleMetric = (metricId: number) => {
    setExpandedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const renderExecutiveSummaryContent = () => {
    if (isLoadingExecSummary) {
      return (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Generating executive summary...</p>
          </div>
        </div>
      );
    }

    if (execSummaryError) {
      return (
        <div className="border-t border-gray-200 p-4">
          <div className="text-red-600">
            <p className="font-medium">Error generating summary:</p>
            <p className="text-sm mt-1">{execSummaryError}</p>
            <button
              onClick={() => {
                setExecSummaryError(null);
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
    <div className="relative min-h-screen">
      <ProcessingModal isVisible={isParsingDocument} />
      <ProcessingErrorModal isError={multiHeadingSummaryError} />
      <div className="space-y-6">
        {/* Executive Summary */}
        <div className="rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setIsExecSummaryExpanded(!isExecSummaryExpanded)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold">Executive Summary</h2>
              {isLoadingExecSummary && (
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
    </div>
  );
} 