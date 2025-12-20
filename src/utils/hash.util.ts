import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text password using bcrypt.
 * @param plainTextPassword The password to hash.
 * @returns Hashed password as a promise.
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10; // Recommended bcrypt salt rounds
  return await bcrypt.hash(plainTextPassword, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param plainTextPassword The password entered by the user.
 * @param hashedPassword The stored hashed password.
 * @returns True if passwords match, otherwise false.
 */
export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}
