import { memoryDb, getDbPool } from '../config/database.js';
import { mapRow, mapRows } from '../utils/dbMapper.js';

export class UserRepository {
  async findByEmail(email) {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('email', normalized)
        .query('SELECT * FROM dbo.Users WHERE LOWER(Email) = @email');
      return mapRow(res.recordset[0]) || null;
    }
    const memUser = memoryDb.users.find(u => u.email.toLowerCase() === normalized);
    return mapRow(memUser) || null;
  }

  async findById(userId) {
    if (!userId) return null;
    const id = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', id)
        .query('SELECT * FROM dbo.Users WHERE UserId = @userId');
      return mapRow(res.recordset[0]) || null;
    }
    const memUser = memoryDb.users.find(u => u.userId === id);
    return mapRow(memUser) || null;
  }

  async create(user) {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('fullName', user.fullName)
        .input('email', user.email.toLowerCase().trim())
        .input('passwordHash', user.passwordHash)
        .input('role', user.role || 'student')
        .input('accountStatus', user.accountStatus || 'ACTIVE')
        .input('department', user.department || null)
        .input('phoneNumber', user.phoneNumber || null)
        .input('studentId', user.studentId || null)
        .query(`
          INSERT INTO dbo.Users (FullName, Email, PasswordHash, Role, AccountStatus, Department, PhoneNumber, StudentId)
          OUTPUT INSERTED.*
          VALUES (@fullName, @email, @passwordHash, @role, @accountStatus, @department, @phoneNumber, @studentId)
        `);
      return mapRow(res.recordset[0]);
    }
    const newUser = {
      userId: memoryDb.users.length + 1,
      fullName: user.fullName,
      email: user.email.toLowerCase().trim(),
      passwordHash: user.passwordHash,
      role: user.role || 'student',
      accountStatus: user.accountStatus || 'ACTIVE',
      department: user.department || null,
      phoneNumber: user.phoneNumber || null,
      studentId: user.studentId || null,
      createdAt: new Date().toISOString()
    };
    memoryDb.users.push(newUser);
    return mapRow(newUser);
  }

  async update(userId, updates) {
    const id = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const req = pool.request().input('userId', id);
      const setClauses = [];
      if (updates.fullName !== undefined) {
        req.input('fullName', updates.fullName);
        setClauses.push('FullName = @fullName');
      }
      if (updates.department !== undefined) {
        req.input('department', updates.department);
        setClauses.push('Department = @department');
      }
      if (updates.phoneNumber !== undefined) {
        req.input('phoneNumber', updates.phoneNumber);
        setClauses.push('PhoneNumber = @phoneNumber');
      }
      if (updates.accountStatus !== undefined) {
        req.input('accountStatus', updates.accountStatus);
        setClauses.push('AccountStatus = @accountStatus');
      }
      if (updates.passwordHash !== undefined) {
        req.input('passwordHash', updates.passwordHash);
        setClauses.push('PasswordHash = @passwordHash');
      }
      setClauses.push('UpdatedAt = SYSUTCDATETIME()');
      const res = await req.query(`
        UPDATE dbo.Users SET ${setClauses.join(', ')}
        OUTPUT INSERTED.*
        WHERE UserId = @userId
      `);
      return mapRow(res.recordset[0]) || null;
    }
    const user = await this.findById(id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return mapRow(user);
  }

  async getAll() {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request().query('SELECT UserId, FullName, Email, Role, AccountStatus, Department, CreatedAt FROM dbo.Users');
      return mapRows(res.recordset);
    }
    return mapRows(memoryDb.users.map(({ passwordHash, ...rest }) => rest));
  }
}

export const userRepository = new UserRepository();