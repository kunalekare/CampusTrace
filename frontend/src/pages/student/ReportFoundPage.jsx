import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '../../components/reports/ReportForm';
import { reportService } from '../../services/reportService';

export function ReportFoundPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      await reportService.createReport(data);
      navigate('/my-reports');
    } catch (err) {
      const detailed = err.response?.data?.errors?.length
        ? err.response.data.errors.join('; ')
        : (err.response?.data?.message || 'Error creating report');
      setServerError(detailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Report a Found Item</h1>
        <p className="text-xs text-slate-500 mt-1">
          Found something on campus? Register it to notify rightful owners while keeping private details secure.
        </p>
      </div>
      <ReportForm reportType="FOUND" onSubmit={handleSubmit} loading={loading} serverError={serverError} />
    </div>
  );
}