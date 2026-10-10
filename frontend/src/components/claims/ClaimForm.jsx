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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-2 text-slate-900 font-bold">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <h3>Submit Ownership Verification Evidence</h3>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        To prevent fraudulent claims, describe details known only to the true owner (serial numbers, password hints, screen wallpapers, secret stickers, purchase receipt details).
      </p>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Verification Evidence *
          </label>
          <textarea
            rows={4}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="e.g. Serial Number on casing, engraved initials, specific lock screen wallpaper photo..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Submit Claim for Review
          </button>
        </div>
      </form>
    </div>
  );
}