import test from 'node:test';
import assert from 'node:assert/strict';
import { reportService } from '../services/report.service.js';

test('ReportService: creates and retrieves lost and found reports', async () => {
  const report = await reportService.createReport({
    reportType: 'LOST',
    title: 'Lost Backpack in Quad',
    category: 'Bags & Backpacks',
    description: 'Black Herschel backpack lost near the dining hall bench.',
    location: 'North Quad',
    eventDate: '2026-10-10'
  }, 2);

  assert.ok(report.reportId);
  assert.equal(report.title, 'Lost Backpack in Quad');

  const fetched = await reportService.getReportById(report.reportId, 'student', 2);
  assert.equal(fetched.reportId, report.reportId);
});