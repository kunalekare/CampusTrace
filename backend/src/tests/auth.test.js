import test from 'node:test';
import assert from 'node:assert/strict';
import { authService } from '../services/auth.service.js';

test('AuthService: registers new student and logs in successfully', async () => {
  const reg = await authService.register({
    fullName: 'Test User',
    email: `test_${Date.now()}@campus.edu`,
    password: 'Password@123',
    role: 'student'
  });
  assert.ok(reg.token);
  assert.equal(reg.user.role, 'student');

  const log = await authService.login(reg.user.email, 'Password@123');
  assert.ok(log.token);
});

test('AuthService: rejects incorrect password', async () => {
  await assert.rejects(async () => {
    await authService.login('student@campus.edu', 'WrongPassword!123');
  }, /Invalid email or password/);
});