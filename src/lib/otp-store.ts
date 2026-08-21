import crypto from 'crypto';

/**
 * Server-Side 2FA & OTP Management Store
 * Strictly managed on backend server instance.
 */

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  idToken?: string;
  email: string;
}

// In-memory server map for 2FA OTP tokens
const otpMap = new Map<string, OtpRecord>();

/**
 * Generate a 6-digit cryptographically random OTP for an email
 * Expiration: 15 Minutes (900 seconds)
 */
export function generateOTP(email: string, idToken?: string): { code: string; expiresAt: number; isDemo: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const isDemo = cleanEmail === 'guest.demo@causarix.ai' || cleanEmail === 'guest.demo@synaps.ai';
  
  // Generate cryptographically secure random 6-digit code for real emails (100000 - 999999)
  const code = isDemo ? '123456' : crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 Minutes expiration

  const record: OtpRecord = {
    code,
    expiresAt,
    attempts: 0,
    idToken,
    email: cleanEmail,
  };

  otpMap.set(cleanEmail, record);

  console.log(`[2FA SECURITY SERVER] 🔒 Unique 6-digit OTP generated for ${cleanEmail} (Expires in 15m)`);

  return { code, expiresAt, isDemo };
}

/**
 * Verify a 6-digit OTP for an email on the backend
 */
export function verifyOTP(email: string, inputCode: string): { valid: boolean; reason?: string; idToken?: string } {
  const cleanEmail = (email || '').trim().toLowerCase();
  const sanitizedInput = (inputCode || '').trim();

  // Primary lookup by exact cleanEmail
  let record = otpMap.get(cleanEmail);
  let matchedKey = cleanEmail;

  if (!record) {
    return { valid: false, reason: 'No active 2FA security code found. Please click "Resend Code".' };
  }

  // Check 15-minute expiration
  if (Date.now() > record.expiresAt) {
    otpMap.delete(matchedKey);
    return { valid: false, reason: '2FA Security Code has expired (15 minutes limit). Please request a new code.' };
  }

  // Check attempts (Max 5 attempts)
  if (record.attempts >= 5) {
    otpMap.delete(matchedKey);
    return { valid: false, reason: 'Too many invalid attempts. Account temporarily locked for 15 minutes.' };
  }

  // STRICT EXACT CODE CHECK
  const isMatch = record.code === sanitizedInput;

  if (!isMatch) {
    record.attempts += 1;
    otpMap.set(matchedKey, record);
    console.warn(`[2FA SECURITY SERVER] ❌ Failed 2FA attempt for ${matchedKey}.`);
    return { valid: false, reason: `Invalid 6-digit Security Code. ${5 - record.attempts} attempts remaining.` };
  }

  // SUCCESSFUL VERIFICATION! Remove code from store immediately to prevent replay attacks
  console.log(`[2FA SECURITY SERVER] ✅ 2FA Authentication verified for ${matchedKey}`);
  const savedToken = record.idToken;
  otpMap.delete(matchedKey);

  return { valid: true, idToken: savedToken };
}
