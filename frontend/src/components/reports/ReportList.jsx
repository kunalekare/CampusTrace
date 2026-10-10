import React from 'react';
import { ReportCard } from './ReportCard';
import { EmptyState } from '../common/EmptyState';

export function ReportList({ reports = [], onSelect }) {
  if (reports.length === 0) {
    return <EmptyState title="No items match your criteria" description="Try broadening your search keywords or resetting filters." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {reports.map(report => (
        <ReportCard key={report.reportId} report={report} onSelect={onSelect} />
      ))}
    </div>
  );
}