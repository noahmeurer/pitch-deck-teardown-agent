import React, { useState } from 'react';

export function RightColumn() {
  const [isExecSummaryExpanded, setIsExecSummaryExpanded] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState<number[]>([]);

  const toggleMetric = (metricId: number) => {
    setExpandedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
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
          <h2 className="text-xl font-semibold">Executive Summary</h2>
          <span className="text-gray-500">
            {isExecSummaryExpanded ? '−' : '+'}
          </span>
        </button>
        {isExecSummaryExpanded && (
          <div className="border-t border-gray-200 p-4">
            <p className="text-gray-500">Executive summary content will appear here</p>
          </div>
        )}
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