/**
 * CampusTrace Asynchronous Matching Processor
 * Calculates fuzzy token overlap, category identity, and location similarity
 */
function calculateSimilarityScore(itemA, itemB) {
  let score = 0;

  // Category: 35%
  if (itemA.categoryId === itemB.categoryId) {
    score += 35;
  }

  // Location: 20%
  if (itemA.locationId === itemB.locationId) {
    score += 20;
  }

  // Date proximity (within 5 days): 15%
  if (itemA.itemDate && itemB.itemDate) {
    const diffDays = Math.abs(new Date(itemA.itemDate) - new Date(itemB.itemDate)) / (1000 * 60 * 60 * 24);
    if (diffDays <= 2) score += 15;
    else if (diffDays <= 5) score += 8;
  }

  // Title token match: 30%
  const tokensA = (itemA.title || '').toLowerCase().split(/\s+/).filter(Boolean);
  const tokensB = (itemB.title || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (tokensA.length && tokensB.length) {
    const common = tokensA.filter(t => tokensB.includes(t));
    const tokenScore = (common.length / Math.max(tokensA.length, tokensB.length)) * 30;
    score += Math.round(tokenScore);
  }

  return Math.min(100, score);
}

async function processMatchingJob(jobData) {
  console.log(`[MatchingProcessor] Processing matching job for Report #${jobData.reportId} (${jobData.reportType})`);
  const { newReport, candidateReports = [] } = jobData;

  const matchesFound = [];
  for (const candidate of candidateReports) {
    const confidence = calculateSimilarityScore(newReport, candidate);
    if (confidence >= 50) {
      matchesFound.push({
        lostReportId: newReport.reportType === 'LOST' ? newReport.reportId : candidate.reportId,
        foundReportId: newReport.reportType === 'FOUND' ? newReport.reportId : candidate.reportId,
        confidenceScore: confidence,
        timestamp: new Date().toISOString()
      });
    }
  }

  console.log(`[MatchingProcessor] Evaluation complete. Found ${matchesFound.length} match(es) above 50% confidence.`);
  return {
    reportId: jobData.reportId,
    matchesEvaluated: candidateReports.length,
    matchesFound
  };
}

module.exports = {
  calculateSimilarityScore,
  processMatchingJob
};