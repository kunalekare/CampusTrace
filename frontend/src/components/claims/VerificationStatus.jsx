import React from 'react';

export function VerificationStatus({ status, handoverStatus }) {
  if (handoverStatus === 'CONFIRMED') {
    return (
      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        Handover Confirmed (Resolved)
      </span>
    );
  }

  switch (status) {
    case 'APPROVED':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Claim Approved (Ready for Handover)
        </span>
      );
    case 'REJECTED':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
          Claim Rejected
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Pending Admin Verification
        </span>
      );
  }
}