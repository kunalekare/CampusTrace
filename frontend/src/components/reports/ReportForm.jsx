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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm transition-colors">
      <ErrorMessage message={error || serverError} />

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Item Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={isLost ? 'e.g. Space Grey MacBook Pro 14"' : 'e.g. Found TI-84 Scientific Calculator'}
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Campus Location *
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {LOCATIONS.map(l => <option key={l} value={l} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Brand / Model
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Apple, Texas Instruments"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Color
          </label>
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Select color...</option>
            {COLORS.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            {isLost ? 'Approx. Date Lost *' : 'Date Found *'}
          </label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Item Description *
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide specific description including stickers, scratches, condition..."
          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
      </div>

      <ImageUploader onUploaded={(blobName) => setFormData(p => ({ ...p, imageBlobName: blobName }))} />

      {isLost ? (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl p-4 space-y-2 transition-colors">
          <label className="block text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Private Ownership Verification Details (Protected)
          </label>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            This private information is never shown publicly. Only campus security checks this during claim verification.
          </p>
          <input
            type="text"
            name="privateVerificationDetails"
            value={formData.privateVerificationDetails}
            onChange={handleChange}
            placeholder="e.g. Serial Number, engraving, password hint, lock screen photo"
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />
        </div>
      ) : (
        <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl p-4 space-y-3 transition-colors">
          <div>
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-1">
              Handover Instructions
            </label>
            <input
              type="text"
              name="handoverNotes"
              value={formData.handoverNotes}
              onChange={handleChange}
              placeholder="e.g. Left with desk attendant at Library 1st Floor"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-1">
              Physical Storage Location
            </label>
            <input
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              placeholder="e.g. Campus Security Desk Room 104"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition ${
          isLost ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
        } disabled:opacity-50`}
      >
        {loading ? 'Submitting Report...' : `Submit ${isLost ? 'Lost Item Report' : 'Found Item Report'}`}
      </button>
    </form>
  );
}