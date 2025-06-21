import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_DIGEST = 'sha512';

export function encrypt(data: string, masterKey: string): Buffer {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);

  const key = pbkdf2Sync(masterKey, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encryptedData = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  
  return Buffer.concat([salt, iv, encryptedData]);
}

export function decrypt(encryptedBuffer: Buffer, masterKey: string): string {
  if (encryptedBuffer.length < SALT_LENGTH + IV_LENGTH) {
    throw new Error("Invalid file: buffer is too short.");
  }
  const salt = encryptedBuffer.slice(0, SALT_LENGTH);
  const iv = encryptedBuffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const encryptedData = encryptedBuffer.slice(SALT_LENGTH + IV_LENGTH);

  const key = pbkdf2Sync(masterKey, salt, PBKDF2_ITERATIONS, KEY_LENGTH, PBKDF2_DIGEST);
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  return decryptedData.toString('utf8');
}
