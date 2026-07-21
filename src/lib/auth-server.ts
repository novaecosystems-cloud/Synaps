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
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return null;
  }
}

export async function verifySessionCookie(sessionCookie: string) {
  if (process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true' && sessionCookie.startsWith('TEST_TOKEN_')) {
    return { uid: sessionCookie.replace('TEST_TOKEN_', ''), email: 'test@example.com' } as any;
  }
  
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
