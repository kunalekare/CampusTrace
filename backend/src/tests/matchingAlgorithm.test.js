import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchScore } from '../services/matchingAlgorithm.service.js';

test('MatchingAlgorithm: strong match for identical calculator in library', () => {
  const lost = {
    reportType: 'LOST',
    category: 'Electronics',
    title: 'Texas Instruments TI-84 Plus Graphing Calculator',
    description: 'Black scientific calculator lost on library study desk',
    brand: 'Texas Instruments',
    color: 'Black',
    location: 'Central Library',
    eventDate: '2026-10-10'
  };
  const found = {
    reportType: 'FOUND',
    category: 'Electronics',
    title: 'Found TI-84 Scientific Calculator in Library',
    description: 'Black Texas Instruments calculator left on table',
    brand: 'Texas Instruments',
    color: 'Black',
    location: 'Central Library',
    eventDate: '2026-10-10'
  };

  const result = calculateMatchScore(lost, found);
  assert.ok(result.score >= 80, `Expected high score >= 80, got ${result.score}`);
  assert.ok(result.reasons.some(r => r.includes('Exact Category Match')));
  assert.ok(result.reasons.some(r => r.includes('Matching Brand')));
});

test('MatchingAlgorithm: zero score for incompatible categories', () => {
  const lost = {
    reportType: 'LOST',
    category: 'Electronics',
    title: 'iPhone 15 Pro',
    description: 'Black phone'
  };
  const found = {
    reportType: 'FOUND',
    category: 'Clothing & Accessories',
    title: 'Wool Beanie Hat',
    description: 'Black beanie'
  };

  const result = calculateMatchScore(lost, found);
  assert.equal(result.score, 0);
  assert.ok(result.reasons.includes('Incompatible categories'));
});

test('MatchingAlgorithm: handles missing attributes gracefully', () => {
  const lost = {
    reportType: 'LOST',
    category: 'Keys',
    title: 'Room keys',
    description: 'Dorm keys'
  };
  const found = {
    reportType: 'FOUND',
    category: 'Keys',
    title: 'Found metal keys',
    description: 'Keys found'
  };

  const result = calculateMatchScore(lost, found);
  assert.ok(result.score > 0);
});