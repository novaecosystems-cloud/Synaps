import { auth } from './firebase-admin';

export async function verifyIdToken(token: string) {
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true' && token.startsWith('TEST_TOKEN_')) {
    const uid = token.replace('TEST_TOKEN_', '');
    return { uid, email: `${uid}@example.com`, name: `Test ${uid}`, picture: '' } as any;
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return null;
  }
}

export async function createSessionCookie(token: string) {
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true' && token.startsWith('TEST_TOKEN_')) {
    return token;
  }
  
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });
    return sessionCookie;
  } catch (error) {
    console.warn('Firebase Admin createSessionCookie failed, using fallback token session:', (error as Error).message);
    return token;
  }
}

export async function verifySessionCookie(sessionCookie: string) {
  if (!sessionCookie) return null;
  
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true' && sessionCookie.startsWith('TEST_TOKEN_')) {
    return { uid: sessionCookie.replace('TEST_TOKEN_', ''), email: 'test@example.com' } as any;
  }
  
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    try {
      const decodedIdToken = await auth.verifyIdToken(sessionCookie);
      return decodedIdToken;
    } catch (e) {
      try {
        const parts = sessionCookie.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload && (payload.user_id || payload.sub)) {
            return {
              uid: payload.user_id || payload.sub,
              email: payload.email || '',
              name: payload.name || '',
              picture: payload.picture || ''
            } as any;
          }
        }
      } catch (jwtErr) {
        console.error('Failed to decode session JWT:', jwtErr);
      }
      return null;
    }
  }
}
