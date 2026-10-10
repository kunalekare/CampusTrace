import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { ApiError } from '../utils/ApiError.js';
import { appConfig } from '../config/appConfig.js';
import { auditLogService } from './auditLog.service.js';

export class AuthService {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.badRequest('An account with this email address already exists.');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      fullName: data.fullName,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role || 'student',
      department: data.department,
      phoneNumber: data.phoneNumber,
      studentId: data.studentId
    });

    const userId = user.userId || user.UserId;
    await auditLogService.log(userId, 'USER_REGISTERED', 'User', userId, { email: user.email || user.Email });

    const token = this.generateToken(user);
    return {
      user: {
        userId,
        fullName: user.fullName || user.FullName,
        email: user.email || user.Email,
        role: user.role || user.Role,
        department: user.department || user.Department
      },
      token
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required.');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const accountStatus = user.accountStatus || user.AccountStatus || 'ACTIVE';
    if (accountStatus === 'SUSPENDED') {
      throw ApiError.forbidden('Your account is currently suspended. Please contact campus security.');
    }

    const storedHash = user.passwordHash || user.PasswordHash;
    if (!storedHash) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const validPassword = await comparePassword(password, storedHash);
    if (!validPassword) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const userId = user.userId || user.UserId;
    await auditLogService.log(userId, 'USER_LOGIN', 'User', userId);

    const token = this.generateToken(user);
    return {
      user: {
        userId,
        fullName: user.fullName || user.FullName,
        email: user.email || user.Email,
        role: user.role || user.Role,
        department: user.department || user.Department
      },
      token
    };
  }

  generateToken(user) {
    return jwt.sign(
      {
        userId: user.userId || user.UserId,
        email: user.email || user.Email,
        role: user.role || user.Role,
        fullName: user.fullName || user.FullName
      },
      appConfig.jwt.secret,
      { expiresIn: appConfig.jwt.expiresIn }
    );
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    const { passwordHash, PasswordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateProfile(userId, updates) {
    const updated = await userRepository.update(userId, updates);
    if (!updated) throw ApiError.notFound('User not found');
    const { passwordHash, PasswordHash, ...safeUser } = updated;
    return safeUser;
  }
}

export const authService = new AuthService();