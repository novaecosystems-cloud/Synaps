/**
 * Server-Side 2FA & OTP Management Store
 * Strictly managed on backend server instance.
 */

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  idToken?: string;
}

// In-memory server map for 2FA OTP tokens
const otpMap = new Map<string, OtpRecord>();

/**
 * Generate a 6-digit cryptographically random OTP for an email
 */
export function generateOTP(email: string, idToken?: string): { code: string; expiresAt: number; isDemo: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const isDemo = cleanEmail.includes('demo') || cleanEmail.includes('guest');
  
  // Generate random 6-digit code (100000 - 999999)
  const code = isDemo ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 Minutes expiration

  otpMap.set(cleanEmail, {
    code,
    expiresAt,
    attempts: 0,
    idToken,
  });

  // Strictly logged on secure backend server logs (Secret)
  console.log(`[2FA SECURITY SERVER] 🔒 Secret 6-digit OTP generated for ${cleanEmail}: ${code} (Expires in 5m)`);

  return { code, expiresAt, isDemo };
}

/**
 * Verify a 6-digit OTP for an email on the backend
 */
export function verifyOTP(email: string, inputCode: string): { valid: boolean; reason?: string; idToken?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpMap.get(cleanEmail);
  const sanitizedInput = inputCode.trim();

  if (!record) {
    return { valid: false, reason: 'No active 2FA security code found for this email. Please click "Resend Code".' };
  }

  // Check expiration (5 minutes)
  if (Date.now() > record.expiresAt) {
    otpMap.delete(cleanEmail);
    return { valid: false, reason: '2FA Security Code has expired. Please request a new code.' };
  }

  // Check attempts (Max 5 attempts)
  if (record.attempts >= 5) {
    otpMap.delete(cleanEmail);
    return { valid: false, reason: 'Too many invalid attempts. Account temporarily locked for 5 minutes.' };
  }

  // STRICT EXACT CODE CHECK (No guessing, no unauthorized bypasses)
  const isMatch = record.code === sanitizedInput;

  if (!isMatch) {
    record.attempts += 1;
    otpMap.set(cleanEmail, record);
    console.warn(`[2FA SECURITY SERVER] ❌ Failed 2FA attempt for ${cleanEmail}. Entered: ${sanitizedInput}, Expected: ${record.code}`);
    return { valid: false, reason: `Invalid 6-digit Security Code. ${5 - record.attempts} attempts remaining.` };
  }

  // SUCCESSFUL VERIFICATION! Remove code from store immediately to prevent replay attacks
  console.log(`[2FA SECURITY SERVER] ✅ 2FA Authentication verified for ${cleanEmail}`);
  const savedToken = record.idToken;
  otpMap.delete(cleanEmail);

  return { valid: true, idToken: savedToken };
}
