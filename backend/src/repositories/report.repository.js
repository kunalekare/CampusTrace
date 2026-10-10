import { memoryDb, getDbPool } from '../config/database.js';
import { mapRow, mapRows } from '../utils/dbMapper.js';

export class ReportRepository {
  async create(data) {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', data.userId)
        .input('reportType', data.reportType)
        .input('title', data.title)
        .input('category', data.category)
        .input('description', data.description)
        .input('brand', data.brand || null)
        .input('color', data.color || null)
        .input('location', data.location)
        .input('eventDate', data.eventDate)
        .input('imageBlobName', data.imageBlobName || null)
        .input('status', 'OPEN')
        .input('distinctiveCharacteristics', data.distinctiveCharacteristics || null)
        .input('privateVerificationDetails', data.privateVerificationDetails || null)
        .input('handoverNotes', data.handoverNotes || null)
        .input('storageLocation', data.storageLocation || null)
        .query(`
          INSERT INTO dbo.ItemReports 
          (UserId, ReportType, Title, Category, Description, Brand, Color, Location, EventDate, ImageBlobName, Status, DistinctiveCharacteristics, PrivateVerificationDetails, HandoverNotes, StorageLocation)
          OUTPUT INSERTED.*
          VALUES (@userId, @reportType, @title, @category, @description, @brand, @color, @location, @eventDate, @imageBlobName, @status, @distinctiveCharacteristics, @privateVerificationDetails, @handoverNotes, @storageLocation)
        `);
      return mapRow(res.recordset[0]);
    }
    const newReport = {
      reportId: memoryDb.itemReports.length + 1,
      userId: data.userId,
      reportType: data.reportType,
      title: data.title,
      category: data.category,
      description: data.description,
      brand: data.brand || null,
      color: data.color || null,
      location: data.location,
      eventDate: data.eventDate,
      imageBlobName: data.imageBlobName || null,
      status: 'OPEN',
      distinctiveCharacteristics: data.distinctiveCharacteristics || null,
      privateVerificationDetails: data.privateVerificationDetails || null,
      handoverNotes: data.handoverNotes || null,
      storageLocation: data.storageLocation || null,
      createdAt: new Date().toISOString()
    };
    memoryDb.itemReports.push(newReport);
    return mapRow(newReport);
  }

  async findById(reportId) {
    const id = parseInt(reportId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('reportId', id)
        .query('SELECT r.*, u.FullName as ReporterName FROM dbo.ItemReports r JOIN dbo.Users u ON r.UserId = u.UserId WHERE r.ReportId = @reportId');
      return mapRow(res.recordset[0]) || null;
    }
    const report = memoryDb.itemReports.find(r => r.reportId === id);
    if (!report) return null;
    const user = memoryDb.users.find(u => u.userId === report.userId);
    return mapRow({ ...report, reporterName: user ? user.fullName : 'Campus Member' });
  }

  async findMany({ type, category, location, status, search, limit = 20, offset = 0 }) {
    const pool = await getDbPool();
    if (pool) {
      const req = pool.request();
      let whereClauses = [];
      if (type) {
        req.input('type', type);
        whereClauses.push('r.ReportType = @type');
      }
      if (category) {
        req.input('category', category);
        whereClauses.push('r.Category = @category');
      }
      if (location) {
        req.input('location', `%${location}%`);
        whereClauses.push('r.Location LIKE @location');
      }
      if (status) {
        req.input('status', status);
        whereClauses.push('r.Status = @status');
      }
      if (search) {
        req.input('search', `%${search}%`);
        whereClauses.push('(r.Title LIKE @search OR r.Description LIKE @search OR r.Brand LIKE @search)');
      }
      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      
      const countRes = await req.query(`SELECT COUNT(*) AS total FROM dbo.ItemReports r ${whereSql}`);
      const total = countRes.recordset[0]?.total || 0;

      req.input('offset', offset);
      req.input('limit', limit);
      const itemsRes = await req.query(`
        SELECT r.*, u.FullName AS ReporterName
        FROM dbo.ItemReports r
        JOIN dbo.Users u ON r.UserId = u.UserId
        ${whereSql}
        ORDER BY r.CreatedAt DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
      return {
        total,
        reports: mapRows(itemsRes.recordset)
      };
    }

    let items = [...memoryDb.itemReports];
    if (type) items = items.filter(r => r.reportType.toUpperCase() === type.toUpperCase());
    if (category) items = items.filter(r => r.category.toLowerCase() === category.toLowerCase());
    if (location) items = items.filter(r => r.location.toLowerCase().includes(location.toLowerCase()));
    if (status) items = items.filter(r => r.status.toUpperCase() === status.toUpperCase());
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) || 
        (r.brand && r.brand.toLowerCase().includes(q))
      );
    }
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      total: items.length,
      reports: mapRows(items.slice(offset, offset + limit))
    };
  }

  async findByUserId(userId) {
    const id = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', id)
        .query('SELECT r.*, u.FullName AS ReporterName FROM dbo.ItemReports r JOIN dbo.Users u ON r.UserId = u.UserId WHERE r.UserId = @userId ORDER BY r.CreatedAt DESC');
      return mapRows(res.recordset);
    }
    return mapRows(memoryDb.itemReports.filter(r => r.userId === id));
  }

  async update(reportId, updates) {
    const id = parseInt(reportId, 10);
    const pool = await getDbPool();
    if (pool) {
      const req = pool.request().input('reportId', id);
      const setClauses = [];
      if (updates.status !== undefined) {
        req.input('status', updates.status);
        setClauses.push('Status = @status');
      }
      if (updates.handoverNotes !== undefined) {
        req.input('handoverNotes', updates.handoverNotes);
        setClauses.push('HandoverNotes = @handoverNotes');
      }
      if (updates.storageLocation !== undefined) {
        req.input('storageLocation', updates.storageLocation);
        setClauses.push('StorageLocation = @storageLocation');
      }
      setClauses.push('UpdatedAt = SYSUTCDATETIME()');
      const res = await req.query(`
        UPDATE dbo.ItemReports SET ${setClauses.join(', ')}
        OUTPUT INSERTED.*
        WHERE ReportId = @reportId
      `);
      return mapRow(res.recordset[0]) || null;
    }
    const report = await this.findById(id);
    if (!report) return null;
    Object.assign(report, updates, { updatedAt: new Date().toISOString() });
    return mapRow(report);
  }

  async findCompatibleReports(oppositeType, category) {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('oppositeType', oppositeType)
        .query(`
          SELECT r.*, u.FullName AS ReporterName 
          FROM dbo.ItemReports r 
          JOIN dbo.Users u ON r.UserId = u.UserId 
          WHERE r.ReportType = @oppositeType AND r.Status = 'OPEN'
        `);
      return mapRows(res.recordset);
    }
    return mapRows(memoryDb.itemReports.filter(r => 
      r.reportType === oppositeType && 
      r.status === 'OPEN'
    ));
  }
}

export const reportRepository = new ReportRepository();