import React, { useState } from 'react';
import { claimService } from '../../services/claimService';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { ErrorMessage } from '../common/ErrorMessage';

export function ClaimForm({ reportId, matchId, onSuccess, onCancel }) {
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!evidence || evidence.length < 10) {
      setError('Please provide at least 10 characters of detailed proof of ownership.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await claimService.submitClaim({
        reportId,
        matchId,
        verificationEvidence: evidence
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ownership claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-4 shadow-2xl transition-colors">
      <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-black tracking-tight">Submit Ownership Verification Evidence</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        To prevent fraudulent claims, describe details known only to the true owner (serial numbers, password hints, screen wallpapers, secret stickers, purchase receipt details).
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Verification Evidence *
          </label>
          <textarea
            rows={4}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="e.g. Serial Number on casing, engraved initials, specific lock screen wallpaper photo..."
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="flex justify-end items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Submit Claim for Review
          </button>
        </div>
      </form>
    </div>
  );
}