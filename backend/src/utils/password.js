import bcrypt from 'bcryptjs';

export async function hashPassword(plainText) {
  if (!plainText || typeof plainText !== 'string') {
    throw new Error('Valid password string is required for hashing');
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText, hash) {
  if (!plainText || !hash || typeof plainText !== 'string' || typeof hash !== 'string') {
    return false;
  }
  try {
    return await bcrypt.compare(plainText, hash);
  } catch (err) {
    return false;
  }
}