import { memoryDb, getDbPool } from '../config/database.js';
import { mapRow, mapRows } from '../utils/dbMapper.js';

export class MatchRepository {
  async create(matchData) {
    const pool = await getDbPool();
    if (pool) {
      // Check existing pair
      const checkRes = await pool.request()
        .input('lostId', matchData.lostReportId)
        .input('foundId', matchData.foundReportId)
        .query('SELECT * FROM dbo.PotentialMatches WHERE LostReportId = @lostId AND FoundReportId = @foundId');
      if (checkRes.recordset[0]) {
        return mapRow(checkRes.recordset[0]);
      }

      const res = await pool.request()
        .input('lostId', matchData.lostReportId)
        .input('foundId', matchData.foundReportId)
        .input('score', matchData.score)
        .input('reasons', JSON.stringify(matchData.matchReasons || []))
        .input('status', 'PENDING')
        .query(`
          INSERT INTO dbo.PotentialMatches (LostReportId, FoundReportId, Score, MatchReasons, Status)
          OUTPUT INSERTED.*
          VALUES (@lostId, @foundId, @score, @reasons, @status)
        `);
      return mapRow(res.recordset[0]);
    }

    const existing = memoryDb.potentialMatches.find(m => 
      m.lostReportId === matchData.lostReportId && 
      m.foundReportId === matchData.foundReportId
    );
    if (existing) return mapRow(existing);

    const newMatch = {
      matchId: memoryDb.potentialMatches.length + 1,
      lostReportId: matchData.lostReportId,
      foundReportId: matchData.foundReportId,
      score: matchData.score,
      matchReasons: matchData.matchReasons,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    memoryDb.potentialMatches.push(newMatch);
    return mapRow(newMatch);
  }

  async findById(matchId) {
    const id = parseInt(matchId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('matchId', id)
        .query(`
          SELECT m.*, 
                 lr.Title as LostTitle, lr.Category as LostCategory, lr.Location as LostLocation, lr.UserId as LostUserId,
                 fr.Title as FoundTitle, fr.Category as FoundCategory, fr.Location as FoundLocation, fr.UserId as FoundUserId, fr.StorageLocation as FoundStorageLocation
          FROM dbo.PotentialMatches m
          JOIN dbo.ItemReports lr ON m.LostReportId = lr.ReportId
          JOIN dbo.ItemReports fr ON m.FoundReportId = fr.ReportId
          WHERE m.MatchId = @matchId
        `);
      if (!res.recordset[0]) return null;
      const row = mapRow(res.recordset[0]);
      let reasons = row.matchReasons;
      if (typeof reasons === 'string') {
        try { reasons = JSON.parse(reasons); } catch (e) { reasons = [reasons]; }
      }
      return {
        ...row,
        matchReasons: reasons,
        lostReport: { reportId: row.lostReportId, title: row.lostTitle, category: row.lostCategory, location: row.lostLocation, userId: row.lostUserId },
        foundReport: { reportId: row.foundReportId, title: row.foundTitle, category: row.foundCategory, location: row.foundLocation, userId: row.foundUserId, storageLocation: row.foundStorageLocation }
      };
    }
    const match = memoryDb.potentialMatches.find(m => m.matchId === id);
    if (!match) return null;
    const lostReport = memoryDb.itemReports.find(r => r.reportId === match.lostReportId);
    const foundReport = memoryDb.itemReports.find(r => r.reportId === match.foundReportId);
    return { ...mapRow(match), lostReport: mapRow(lostReport), foundReport: mapRow(foundReport) };
  }

  async findByUserId(userId) {
    const uid = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', uid)
        .query(`
          SELECT m.*, 
                 lr.Title as LostTitle, lr.Category as LostCategory, lr.Location as LostLocation, lr.UserId as LostUserId,
                 fr.Title as FoundTitle, fr.Category as FoundCategory, fr.Location as FoundLocation, fr.UserId as FoundUserId
          FROM dbo.PotentialMatches m
          JOIN dbo.ItemReports lr ON m.LostReportId = lr.ReportId
          JOIN dbo.ItemReports fr ON m.FoundReportId = fr.ReportId
          WHERE (lr.UserId = @userId OR fr.UserId = @userId) AND m.Status != 'DISMISSED'
          ORDER BY m.CreatedAt DESC
        `);
      return res.recordset.map(r => {
        const row = mapRow(r);
        let reasons = row.matchReasons;
        if (typeof reasons === 'string') {
          try { reasons = JSON.parse(reasons); } catch (e) { reasons = [reasons]; }
        }
        return {
          ...row,
          matchReasons: reasons,
          lostReport: { reportId: row.lostReportId, title: row.lostTitle, category: row.lostCategory, location: row.lostLocation },
          foundReport: { reportId: row.foundReportId, title: row.foundTitle, category: row.foundCategory, location: row.foundLocation }
        };
      });
    }

    const userReports = memoryDb.itemReports.filter(r => r.userId === uid).map(r => r.reportId);
    const matches = memoryDb.potentialMatches.filter(m => 
      (userReports.includes(m.lostReportId) || userReports.includes(m.foundReportId)) &&
      m.status !== 'DISMISSED'
    );
    return matches.map(m => {
      const lostReport = memoryDb.itemReports.find(r => r.reportId === m.lostReportId);
      const foundReport = memoryDb.itemReports.find(r => r.reportId === m.foundReportId);
      return { ...mapRow(m), lostReport: mapRow(lostReport), foundReport: mapRow(foundReport) };
    });
  }

  async updateStatus(matchId, status) {
    const id = parseInt(matchId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('matchId', id)
        .input('status', status)
        .query(`
          UPDATE dbo.PotentialMatches 
          SET Status = @status, UpdatedAt = SYSUTCDATETIME()
          OUTPUT INSERTED.*
          WHERE MatchId = @matchId
        `);
      return mapRow(res.recordset[0]) || null;
    }
    const match = memoryDb.potentialMatches.find(m => m.matchId === id);
    if (!match) return null;
    match.status = status;
    match.updatedAt = new Date().toISOString();
    return mapRow(match);
  }

  async getAll() {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request().query(`
        SELECT m.*, 
               lr.Title as LostTitle, lr.Category as LostCategory,
               fr.Title as FoundTitle, fr.Category as FoundCategory
        FROM dbo.PotentialMatches m
        JOIN dbo.ItemReports lr ON m.LostReportId = lr.ReportId
        JOIN dbo.ItemReports fr ON m.FoundReportId = fr.ReportId
        ORDER BY m.CreatedAt DESC
      `);
      return res.recordset.map(r => {
        const row = mapRow(r);
        return {
          ...row,
          lostReport: { reportId: row.lostReportId, title: row.lostTitle, category: row.lostCategory },
          foundReport: { reportId: row.foundReportId, title: row.foundTitle, category: row.foundCategory }
        };
      });
    }

    return memoryDb.potentialMatches.map(m => {
      const lostReport = memoryDb.itemReports.find(r => r.reportId === m.lostReportId);
      const foundReport = memoryDb.itemReports.find(r => r.reportId === m.foundReportId);
      return { ...mapRow(m), lostReport: mapRow(lostReport), foundReport: mapRow(foundReport) };
    });
  }
}

export const matchRepository = new MatchRepository();