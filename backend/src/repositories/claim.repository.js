import { memoryDb, getDbPool } from '../config/database.js';
import { mapRow, mapRows } from '../utils/dbMapper.js';

export class ClaimRepository {
  async create(claimData) {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('reportId', claimData.reportId)
        .input('matchId', claimData.matchId || null)
        .input('claimantId', claimData.claimantId)
        .input('verificationEvidence', claimData.verificationEvidence)
        .input('evidenceBlobName', claimData.evidenceBlobName || null)
        .input('verificationStatus', 'PENDING')
        .input('handoverStatus', 'PENDING')
        .query(`
          INSERT INTO dbo.Claims (ReportId, MatchId, ClaimantId, VerificationEvidence, EvidenceBlobName, VerificationStatus, HandoverStatus)
          OUTPUT INSERTED.*
          VALUES (@reportId, @matchId, @claimantId, @verificationEvidence, @evidenceBlobName, @verificationStatus, @handoverStatus)
        `);
      return mapRow(res.recordset[0]);
    }
    const newClaim = {
      claimId: memoryDb.claims.length + 1,
      reportId: claimData.reportId,
      matchId: claimData.matchId || null,
      claimantId: claimData.claimantId,
      verificationEvidence: claimData.verificationEvidence,
      evidenceBlobName: claimData.evidenceBlobName || null,
      verificationStatus: 'PENDING',
      handoverStatus: 'PENDING',
      adminNotes: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: new Date().toISOString()
    };
    memoryDb.claims.push(newClaim);
    return mapRow(newClaim);
  }

  async findById(claimId) {
    const id = parseInt(claimId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('claimId', id)
        .query(`
          SELECT c.*, 
                 r.Title as ReportTitle, r.Category as ReportCategory, r.Location as ReportLocation, r.ImageBlobName as ReportImageBlobName,
                 u.FullName as ClaimantName, u.Email as ClaimantEmail, u.StudentId as ClaimantStudentId
          FROM dbo.Claims c
          JOIN dbo.ItemReports r ON c.ReportId = r.ReportId
          JOIN dbo.Users u ON c.ClaimantId = u.UserId
          WHERE c.ClaimId = @claimId
        `);
      if (!res.recordset[0]) return null;
      const row = mapRow(res.recordset[0]);
      return {
        ...row,
        report: { 
          reportId: row.reportId, 
          title: row.reportTitle, 
          category: row.reportCategory, 
          location: row.reportLocation,
          imageBlobName: row.reportImageBlobName 
        },
        claimant: { fullName: row.claimantName, email: row.claimantEmail, studentId: row.claimantStudentId }
      };
    }
    const claim = memoryDb.claims.find(c => c.claimId === id);
    if (!claim) return null;
    const report = memoryDb.itemReports.find(r => r.reportId === claim.reportId);
    const claimant = memoryDb.users.find(u => u.userId === claim.claimantId);
    return {
      ...mapRow(claim),
      report: mapRow(report),
      claimant: claimant ? { fullName: claimant.fullName, email: claimant.email, studentId: claimant.studentId } : null
    };
  }

  async findByUserId(userId) {
    const uid = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', uid)
        .query(`
          SELECT c.*, 
                 r.Title as ReportTitle, r.Category as ReportCategory, r.Status as ReportStatus,
                 r.ImageBlobName as ReportImageBlobName, r.Location as ReportLocation
          FROM dbo.Claims c
          JOIN dbo.ItemReports r ON c.ReportId = r.ReportId
          WHERE c.ClaimantId = @userId
          ORDER BY c.CreatedAt DESC
        `);
      return res.recordset.map(r => {
        const row = mapRow(r);
        return {
          ...row,
          report: { 
            reportId: row.reportId, 
            title: row.reportTitle, 
            category: row.reportCategory, 
            status: row.reportStatus,
            location: row.reportLocation,
            imageBlobName: row.reportImageBlobName
          }
        };
      });
    }
    return memoryDb.claims
      .filter(c => c.claimantId === uid)
      .map(c => {
        const report = memoryDb.itemReports.find(r => r.reportId === c.reportId);
        return { ...mapRow(c), report: mapRow(report) };
      });
  }

  async getAll() {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request().query(`
        SELECT c.*, 
               r.Title as ReportTitle, r.Category as ReportCategory, r.Location as ReportLocation, r.ImageBlobName as ReportImageBlobName,
               u.FullName as ClaimantName, u.Email as ClaimantEmail
        FROM dbo.Claims c
        JOIN dbo.ItemReports r ON c.ReportId = r.ReportId
        JOIN dbo.Users u ON c.ClaimantId = u.UserId
        ORDER BY c.CreatedAt DESC
      `);
      return res.recordset.map(r => {
        const row = mapRow(r);
        return {
          ...row,
          report: { 
            reportId: row.reportId, 
            title: row.reportTitle, 
            category: row.reportCategory,
            location: row.reportLocation,
            imageBlobName: row.reportImageBlobName
          },
          claimant: { fullName: row.claimantName, email: row.claimantEmail }
        };
      });
    }
    return memoryDb.claims.map(c => {
      const report = memoryDb.itemReports.find(r => r.reportId === c.reportId);
      const claimant = memoryDb.users.find(u => u.userId === c.claimantId);
      return { ...mapRow(c), report: mapRow(report), claimant: mapRow(claimant) };
    });
  }

  async update(claimId, updates) {
    const id = parseInt(claimId, 10);
    const pool = await getDbPool();
    if (pool) {
      const req = pool.request().input('claimId', id);
      const setClauses = [];
      if (updates.verificationStatus !== undefined) {
        req.input('verificationStatus', updates.verificationStatus);
        setClauses.push('VerificationStatus = @verificationStatus');
      }
      if (updates.handoverStatus !== undefined) {
        req.input('handoverStatus', updates.handoverStatus);
        setClauses.push('HandoverStatus = @handoverStatus');
      }
      if (updates.adminNotes !== undefined) {
        req.input('adminNotes', updates.adminNotes);
        setClauses.push('AdminNotes = @adminNotes');
      }
      if (updates.reviewedBy !== undefined) {
        req.input('reviewedBy', updates.reviewedBy);
        setClauses.push('ReviewedBy = @reviewedBy');
        setClauses.push('ReviewedAt = SYSUTCDATETIME()');
      }
      if (updates.handoverConfirmedAt !== undefined) {
        setClauses.push('HandoverConfirmedAt = SYSUTCDATETIME()');
      }
      setClauses.push('UpdatedAt = SYSUTCDATETIME()');
      const res = await req.query(`
        UPDATE dbo.Claims SET ${setClauses.join(', ')}
        OUTPUT INSERTED.*
        WHERE ClaimId = @claimId
      `);
      return mapRow(res.recordset[0]) || null;
    }
    const claim = memoryDb.claims.find(c => c.claimId === id);
    if (!claim) return null;
    Object.assign(claim, updates, { updatedAt: new Date().toISOString() });
    return mapRow(claim);
  }
}

export const claimRepository = new ClaimRepository();