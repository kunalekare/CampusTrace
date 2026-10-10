import { memoryDb, getDbPool } from '../config/database.js';
import { mapRow, mapRows } from '../utils/dbMapper.js';

export class AuditLogService {
  async log(actorUserId, action, entityType, entityId, metadata = {}) {
    const metaString = typeof metadata === 'string' ? metadata : JSON.stringify(metadata || {});
    const pool = await getDbPool();
    if (pool) {
      try {
        const res = await pool.request()
          .input('actorUserId', actorUserId || null)
          .input('action', action)
          .input('entityType', entityType)
          .input('entityId', entityId || null)
          .input('metadata', metaString)
          .query(`
            INSERT INTO dbo.AuditLogs (ActorUserId, Action, EntityType, EntityId, Metadata)
            OUTPUT INSERTED.*
            VALUES (@actorUserId, @action, @entityType, @entityId, @metadata)
          `);
        return mapRow(res.recordset[0]);
      } catch (err) {
        // Safe fallback so audit log failure does not break primary user transaction
      }
    }

    const entry = {
      auditLogId: memoryDb.auditLogs.length + 1,
      actorUserId: actorUserId || null,
      action,
      entityType,
      entityId: entityId || null,
      timestamp: new Date().toISOString(),
      metadata: metaString
    };
    memoryDb.auditLogs.push(entry);
    return mapRow(entry);
  }

  async getLogs(limit = 50) {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('limit', limit)
        .query('SELECT TOP (@limit) * FROM dbo.AuditLogs ORDER BY Timestamp DESC');
      return res.recordset.map(row => {
        const mapped = mapRow(row);
        let parsedMeta = mapped.metadata;
        if (typeof parsedMeta === 'string') {
          try { parsedMeta = JSON.parse(parsedMeta); } catch (e) { parsedMeta = {}; }
        }
        return { ...mapped, metadata: parsedMeta };
      });
    }

    return memoryDb.auditLogs
      .slice(-limit)
      .reverse()
      .map(l => ({
        ...mapRow(l),
        metadata: typeof l.metadata === 'string' ? JSON.parse(l.metadata) : l.metadata
      }));
  }
}

export const auditLogService = new AuditLogService();