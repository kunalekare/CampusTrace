import React, { useState } from 'react';
import { CATEGORIES, LOCATIONS, COLORS } from '../../utils/constants';
import { ImageUploader } from './ImageUploader';
import { ErrorMessage } from '../common/ErrorMessage';

export function ReportForm({ reportType, onSubmit, loading, serverError }) {
  const isLost = reportType === 'LOST';

  const [formData, setFormData] = useState({
    reportType,
    title: '',
    category: CATEGORIES[0],
    description: '',
    brand: '',
    color: '',
    location: LOCATIONS[0],
    eventDate: new Date().toISOString().split('T')[0],
    imageBlobName: null,
    distinctiveCharacteristics: '',
    privateVerificationDetails: '',
    handoverNotes: '',
    storageLocation: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError('Title and description are required.');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
      <ErrorMessage message={error || serverError} />

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Item Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={isLost ? 'e.g. Space Grey MacBook Pro 14"' : 'e.g. Found TI-84 Scientific Calculator'}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Campus Location *
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Brand / Model
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Apple, Texas Instruments"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Color
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select color...</option>
            {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {isLost ? 'Approx. Date Lost *' : 'Date Found *'}
          </label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Item Description *
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide specific description including stickers, scratches, condition..."
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <ImageUploader onUploaded={(blobName) => setFormData(p => ({ ...p, imageBlobName: blobName }))} />

      {isLost ? (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 space-y-2">
          <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
            Private Ownership Verification Details (Protected)
          </label>
          <p className="text-xs text-amber-700">
            This private information is never shown publicly. Only campus security checks this during claim verification.
          </p>
          <input
            type="text"
            name="privateVerificationDetails"
            value={formData.privateVerificationDetails}
            onChange={handleChange}
            placeholder="e.g. Serial Number, engraving, password hint, lock screen photo"
            className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      ) : (
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              Handover Instructions
            </label>
            <input
              type="text"
              name="handoverNotes"
              value={formData.handoverNotes}
              onChange={handleChange}
              placeholder="e.g. Left with desk attendant at Library 1st Floor"
              className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              Physical Storage Location
            </label>
            <input
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              placeholder="e.g. Campus Security Desk Room 104"
              className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-sm"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold text-white shadow-sm transition ${
          isLost ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50`}
      >
        {loading ? 'Submitting Report...' : `Submit ${isLost ? 'Lost Item Report' : 'Found Item Report'}`}
      </button>
    </form>
  );
}