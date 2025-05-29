import crypto from 'crypto';

/**
 * Verifies a plain password against a stored hashed password
 * @param {string} plainPassword - The password to verify
 * @param {string} storedPassword - The stored password in format "salt:hash"
 * @returns {boolean} True if the password matches, false otherwise
 */
export function verifyPassword(plainPassword: string, storedPassword: string): boolean {
  try {
    const [saltHex, hashHex] = storedPassword.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const storedHash = Buffer.from(hashHex, 'hex');
    
    const newHash = crypto.pbkdf2Sync(
      plainPassword,
      salt,
      100000, // iterations
      32, // key length (sha256 outputs 32 bytes)
      'sha256'
    );
    
    return crypto.timingSafeEqual(newHash, storedHash);
  } catch (error) {
    console.error(`Password verification failed: ${error}`);
    return false;
  }
}

/**
 * Hashes a password with PBKDF2
 * @param {string} password - The plain password to hash
 * @returns {string} The hashed password in format "salt:hash"
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = crypto.randomBytes(16);
  
  // Hash the password
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    100000, // iterations
    32, // key length (sha256 outputs 32 bytes)
    'sha256'
  );
  
  // Return the salt and hash as a hex string
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}