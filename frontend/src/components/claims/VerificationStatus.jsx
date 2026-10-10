import React from 'react';

export function VerificationStatus({ status, handoverStatus }) {
  if (handoverStatus === 'CONFIRMED') {
    return (
      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        Handover Confirmed (Resolved)
      </span>
    );
  }

  switch (status) {
    case 'APPROVED':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Claim Approved (Ready for Handover)
        </span>
      );
    case 'REJECTED':
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">
          Claim Rejected
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Pending Admin Verification
        </span>
      );
  }
}