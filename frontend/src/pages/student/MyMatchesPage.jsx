import React, { useState, useEffect } from 'react';
import { matchService } from '../../services/matchService';
import { MatchCard } from '../../components/matches/MatchCard';
import { ClaimForm } from '../../components/claims/ClaimForm';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';

export function MyMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimTarget, setClaimTarget] = useState(null); // { reportId, matchId }

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await matchService.getMyMatches();
      setMatches(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleDismiss = async (matchId) => {
    await matchService.dismissMatch(matchId);
    setMatches(prev => prev.filter(m => m.matchId !== matchId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Smart Algorithmic Matches</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automated pairings detected by comparing category, keywords, brand, location, and dates.
        </p>
      </div>

      {loading ? (
        <Loader label="Evaluating matches..." />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No active matches detected"
          description="As soon as a compatible lost or found item is reported, the system will evaluate similarity and notify you here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {matches.map(m => (
            <MatchCard
              key={m.matchId}
              match={m}
              onDismiss={handleDismiss}
              onClaim={(reportId, matchId) => setClaimTarget({ reportId, matchId })}
            />
          ))}
        </div>
      )}

      {claimTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="max-w-md w-full">
            <ClaimForm
              reportId={claimTarget.reportId}
              matchId={claimTarget.matchId}
              onSuccess={() => {
                setClaimTarget(null);
                alert('Claim submitted! Campus security will review your ownership details.');
              }}
              onCancel={() => setClaimTarget(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}