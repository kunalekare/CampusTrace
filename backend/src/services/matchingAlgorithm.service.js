/**
 * CampusTrace Rule-Based Weighted Matching Engine
 *
 * Scoring Model:
 *  - Category Similarity: 25%
 *  - Description & Keywords: 25%
 *  - Brand / Model: 20%
 *  - Color Similarity: 10%
 *  - Location Proximity: 10%
 *  - Date/Time Proximity: 10%
 *
 * Normalized Total Score: 0 - 100
 */
export function calculateMatchScore(lostReport, foundReport) {
  // Guard: Incompatible report types
  if (lostReport.reportType !== 'LOST' || foundReport.reportType !== 'FOUND') {
    return { score: 0, reasons: [] };
  }

  let totalScore = 0;
  const reasons = [];

  // 1. Category Matching (25%)
  if (lostReport.category && foundReport.category) {
    if (lostReport.category.toLowerCase() === foundReport.category.toLowerCase()) {
      totalScore += 25;
      reasons.push(`Exact Category Match: ${foundReport.category}`);
    } else {
      // Incompatible categories strictly penalize match
      return { score: 0, reasons: ['Incompatible categories'] };
    }
  }

  // 2. Description & Keywords (25%)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'with', 'my', 'of', 'for', 'it', 'was', 'i']);
  const extractTokens = (text) => (text || '').toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  const lostTokens = new Set(extractTokens(`${lostReport.title} ${lostReport.description}`));
  const foundTokens = new Set(extractTokens(`${foundReport.title} ${foundReport.description}`));

  let sharedTokenCount = 0;
  for (const token of lostTokens) {
    if (foundTokens.has(token)) sharedTokenCount++;
  }

  if (lostTokens.size > 0 && foundTokens.size > 0) {
    const overlapRatio = sharedTokenCount / Math.min(lostTokens.size, foundTokens.size);
    const descScore = Math.min(25, Math.round(overlapRatio * 25));
    if (descScore > 0) {
      totalScore += descScore;
      reasons.push(`Keyword Overlap (${sharedTokenCount} matching keywords)`);
    }
  }

  // 3. Brand / Model (20%)
  if (lostReport.brand && foundReport.brand) {
    if (lostReport.brand.toLowerCase() === foundReport.brand.toLowerCase()) {
      totalScore += 20;
      reasons.push(`Matching Brand: ${foundReport.brand}`);
    } else if (
      lostReport.brand.toLowerCase().includes(foundReport.brand.toLowerCase()) ||
      foundReport.brand.toLowerCase().includes(lostReport.brand.toLowerCase())
    ) {
      totalScore += 12;
      reasons.push(`Partial Brand Match: ${foundReport.brand}`);
    }
  } else if (!lostReport.brand && !foundReport.brand) {
    // Neutral when neither provided
    totalScore += 5;
  }

  // 4. Color Matching (10%)
  if (lostReport.color && foundReport.color) {
    if (lostReport.color.toLowerCase() === foundReport.color.toLowerCase()) {
      totalScore += 10;
      reasons.push(`Matching Color: ${foundReport.color}`);
    }
  }

  // 5. Location Proximity (10%)
  if (lostReport.location && foundReport.location) {
    if (lostReport.location.toLowerCase() === foundReport.location.toLowerCase()) {
      totalScore += 10;
      reasons.push(`Exact Location Match: ${foundReport.location}`);
    } else if (
      lostReport.location.toLowerCase().includes(foundReport.location.toLowerCase()) ||
      foundReport.location.toLowerCase().includes(lostReport.location.toLowerCase())
    ) {
      totalScore += 7;
      reasons.push(`Nearby Location: ${foundReport.location}`);
    }
  }

  // 6. Date / Time Proximity (10%)
  if (lostReport.eventDate && foundReport.eventDate) {
    const lostDate = new Date(lostReport.eventDate);
    const foundDate = new Date(foundReport.eventDate);
    const diffDays = Math.abs((foundDate - lostDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      totalScore += 10;
      reasons.push('Reported within 24 hours of each other');
    } else if (diffDays <= 3) {
      totalScore += 7;
      reasons.push('Reported within 3 days');
    } else if (diffDays <= 7) {
      totalScore += 4;
      reasons.push('Reported within 1 week');
    }
  }

  const normalizedScore = Math.min(100, Math.max(0, totalScore));
  return {
    score: normalizedScore,
    reasons
  };
}