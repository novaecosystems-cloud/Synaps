'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, QrCode, Smartphone } from 'lucide-react';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [showQrStep, setShowQrStep] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qrCode: string; secret: string; otpauthUrl: string } | null>(null);
  const [pendingToken, setPendingToken] = useState<string>('');
  const [otpHint, setOtpHint] = useState<string>('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        if (auth) {
          const result = await getRedirectResult(auth);
          if (result && result.user) {
            setLoading(true);
            const token = await result.user.getIdToken();
            await send2FACode(result.user.email || 'user@synaps.ai', token);
          }
        }
      } catch (err: any) {
        console.error('[AUTH] Redirect result check error:', err);
      }
    };
    checkRedirectResult();
  }, []);

  // Request 2FA QR Code & Secret for Google Authenticator App
  const handleSetupGoogleAuthenticator = async (targetEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/totp?email=${encodeURIComponent(targetEmail)}`);
      const data = await res.json();
      if (data.success) {
        setQrCodeData({
          qrCode: data.qrCode,
          secret: data.secret,
          otpauthUrl: data.otpauthUrl,
        });
        setShowQrStep(true);
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to generate Authenticator QR code.' });
    } finally {
      setLoading(false);
    }
  };

  // Send 2FA Security Code (OTP) via Backend API
  const send2FACode = async (targetEmail: string, idToken: string) => {
    setPendingToken(idToken);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, idToken }),
      });
      const data = await res.json();
      setOtpHint(data.otpCodeHint || '');
      setShowOtpStep(true);
      toast({
        title: '🛡️ 2FA Security Code Sent',
        description: data.message || `Enter 6-digit code sent to ${targetEmail}`,
      });
    } catch (e) {
      setShowOtpStep(true);
    }
  };

  // Verify TOTP Code (Google Authenticator App) OR Email OTP Code
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;
    setLoading(true);

    try {
      // First try TOTP Google Authenticator check
      const totpRes = await fetch('/api/auth/totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'user@synaps.ai',
          token: otpCode.trim(),
        }),
      });
      const totpData = await totpRes.json();

      if (totpData.success) {
        toast({ title: '📱 Authenticator Verified!', description: 'Google Authenticator code verified. Launching workspace...' });
        window.location.href = '/dashboard';
        return;
      }

      // Fallback to Email 2FA verification
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'demo@synaps.ai',
          otpCode: otpCode.trim(),
          idToken: pendingToken,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast({ title: '✅ 2FA Verified', description: 'Session established securely on server. Opening workspace...' });
        window.location.href = data.redirect || '/dashboard';
        return;
      } else {
        toast({ title: '❌ Verification Failed', description: data.error || totpData.error || 'Invalid 6-digit code.' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to verify 2FA code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    let token = `TEST_TOKEN_${cleanEmail.split('@')[0]}_synaps`;

    try {
      if (auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password || 'synapsPass2026!');
          token = await userCredential.user.getIdToken();
        } catch (signInErr: any) {
          if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential') {
            try {
              const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password || 'synapsPass2026!');
              token = await newCredential.user.getIdToken(true);
            } catch (createErr: any) {}
          }
        }
      }
    } catch (err: any) {}

    setLoading(false);
    await send2FACode(cleanEmail, token);
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    let token = 'TEST_TOKEN_google_user_synaps';
    let targetEmail = email;

    try {
      if (auth) {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        token = await userCredential.user.getIdToken();
        if (userCredential.user.email) {
          targetEmail = userCredential.user.email;
          setEmail(targetEmail);
        }
      }
    } catch (err: any) {
      console.error('[GOOGLE AUTH ERROR]', err);
    }

    setLoading(false);
    await send2FACode(targetEmail || 'google.user@synaps.ai', token);
  };

  const handleInstantDemo = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('synaps_demo_usage_count', '0');
    await send2FACode('guest.demo@synaps.ai', 'TEST_TOKEN_enterprise_guest_demo');
  };

  return (
    <div className="min-h-screen bg-[#000209] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Modak&family=Mouse+Memoirs&display=swap');

        @keyframes crav-pop-in {
          0% {
            transform: scale(0.85) translateY(30px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .crav-popup-form {
          --background: #F91914;
          --input-focus: #F91914;
          --font-color: #4C0016;
          --font-color-sub: #F5E3CD;
          --bg-color: #F5E3CD;
          --main-color: #4C0016;
          padding: 32px 28px;
          background: #F91914;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          border-radius: 28px;
          border: 3px solid #4C0016;
          box-shadow: 8px 8px 0px #4C0016;
          width: 100%;
          max-width: 440px;
          position: relative;
          animation: crav-pop-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .crav-popup-form > p {
          color: #F5E3CD;
          font-family: 'Modak', cursive, sans-serif;
          font-size: 36px;
          line-height: 1;
          margin-bottom: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          letter-spacing: 0.5px;
        }

        .crav-popup-form > p > span {
          color: #FFD750;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: 18px;
          margin-top: 4px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .uiverse-popup-separator {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 4px 0;
        }

        .uiverse-popup-separator > div {
          flex: 1;
          height: 2px;
          border-radius: 5px;
          background-color: #4C0016;
        }

        .uiverse-popup-separator > span {
          color: #FFD750;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: 16px;
          letter-spacing: 1.5px;
        }

        .uiverse-popup-oauthButton {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          width: 100%;
          min-height: 48px;
          border-radius: 9999px;
          border: 2px solid #4C0016;
          background-color: #F5E3CD;
          box-shadow: 4px 4px 0px #4C0016;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #4C0016;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease;
        }

        .uiverse-popup-oauthButton:hover {
          transform: scale(1.04);
          background-color: #ffffff;
          border-color: #4C0016;
          box-shadow: 5px 5px 0px #4C0016;
        }

        .uiverse-popup-demoButton {
          background-color: #FFD750;
          color: #4C0016;
          border: 2px solid #4C0016;
          box-shadow: 4px 4px 0px #4C0016;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: 22px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .uiverse-popup-demoButton:hover {
          background-color: #ffffff;
          color: #F91914;
          transform: scale(1.04);
        }

        .uiverse-popup-input {
          width: 100%;
          min-height: 48px;
          background-color: #F5E3CD;
          border-radius: 16px;
          border: 2px solid #4C0016;
          padding: 0 16px;
          outline: none;
          color: #4C0016;
          font-family: 'Mouse Memoirs', sans-serif;
          font-size: 18px;
          transition: all 200ms ease;
        }

        .uiverse-popup-input:focus {
          border-color: #4C0016;
          box-shadow: 4px 4px 0px #4C0016;
          background-color: #ffffff;
        }

        .uiverse-popup-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
      `}</style>

      {/* Back to Home Link */}
      <Link href="/" className="absolute top-6 left-6 text-[#F5E3CD] hover:text-white flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-[#4C0016]/60 px-4 py-2 rounded-full border border-[#FFD750]/30 hover:bg-[#4C0016] transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="crav-popup-form">
        {showQrStep && qrCodeData ? (
          /* ── STEP 2B: GOOGLE AUTHENTICATOR QR CODE SCAN ── */
          <div className="w-full flex flex-col items-center gap-3 py-1 text-center">
            <p>
              Scan QR Code
              <span>Open Google Authenticator App & Scan</span>
            </p>

            <div className="p-3 bg-[#F5E3CD] border-2 border-[#4C0016] rounded-2xl shadow-[4px_4px_0px_#4C0016]">
              <img src={qrCodeData.qrCode} alt="Google Authenticator QR Code" className="w-48 h-48 mx-auto" />
            </div>

            <div className="text-xs font-mono text-[#F5E3CD] bg-[#4C0016] px-3 py-1.5 rounded-lg border border-[#FFD750]/40 w-full break-all">
              Key: <strong className="text-[#FFD750]">{qrCodeData.secret}</strong>
            </div>

            <form onSubmit={handleVerify2FA} className="w-full flex flex-col gap-2.5 mt-1">
              <input
                type="text"
                placeholder="Enter 6-digit Authenticator Code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="uiverse-popup-input text-center text-lg font-mono tracking-widest font-bold"
                maxLength={6}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="uiverse-popup-oauthButton uiverse-popup-demoButton"
              >
                {loading ? 'Verifying...' : 'Verify App Code & Launch →'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowQrStep(false)}
              className="text-xs text-[#F5E3CD] hover:text-white underline font-sans"
            >
              ← Back to options
            </button>
          </div>
        ) : showOtpStep ? (
          /* ── STEP 2A: EMAIL / SERVER 2FA OTP VERIFICATION ── */
          <form onSubmit={handleVerify2FA} className="w-full flex flex-col items-center gap-4 py-2">
            <div className="w-12 h-12 rounded-full bg-[#4C0016] border border-[#FFD750] flex items-center justify-center text-[#FFD750] mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p>
              2-Factor Authentication
              <span>Enter 6-digit Security Code sent to server</span>
            </p>

            {otpHint && (
              <div className="w-full text-center px-3 py-1.5 rounded-lg bg-[#4C0016] border border-[#FFD750] text-xs font-mono text-[#FFD750]">
                2FA OTP Code: <strong className="tracking-widest text-white">{otpHint}</strong>
              </div>
            )}

            <div className="w-full relative">
              <input
                type="text"
                placeholder="Enter 6-digit code (e.g. 123456)"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="uiverse-popup-input text-center text-lg font-mono tracking-widest font-bold"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="uiverse-popup-oauthButton uiverse-popup-demoButton mt-2"
            >
              {loading ? 'Verifying 2FA...' : 'Verify Code & Launch Workspace →'}
            </button>

            <button
              type="button"
              onClick={() => handleSetupGoogleAuthenticator(email || 'user@synaps.ai')}
              className="text-xs text-[#FFD750] hover:text-white underline font-mono flex items-center gap-1 mt-1"
            >
              <QrCode className="w-3.5 h-3.5" /> Use Google Authenticator App QR Code instead
            </button>

            <button
              type="button"
              onClick={() => setShowOtpStep(false)}
              className="text-xs text-[#F5E3CD] hover:text-white underline font-sans"
            >
              ← Back to Sign In options
            </button>
          </form>
        ) : (
          /* ── STEP 1: INITIAL CREDENTIAL / DEMO SELECTION ── */
          <>
            <p>
              Welcome to SYNAPS
              <span>Sign in to access your Enterprise Memory OS</span>
            </p>

            {/* INSTANT DEMO BUTTON */}
            <button
              onClick={handleInstantDemo}
              disabled={loading}
              className="uiverse-popup-oauthButton uiverse-popup-demoButton"
            >
              ⚡ Instant Guest Workspace Demo
            </button>

            <div className="uiverse-popup-separator">
              <div></div>
              <span>OR AUTHENTICATE</span>
              <div></div>
            </div>

            {/* GOOGLE SIGN IN */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="uiverse-popup-oauthButton"
            >
              <svg className="uiverse-popup-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>

            {/* GOOGLE AUTHENTICATOR APP BUTTON */}
            <button
              type="button"
              onClick={() => handleSetupGoogleAuthenticator(email || 'user@synaps.ai')}
              disabled={loading}
              className="uiverse-popup-oauthButton bg-[#4C0016] text-[#FFD750] border-[#FFD750]"
            >
              <Smartphone className="w-5 h-5" />
              Google Authenticator QR Code
            </button>

            {/* EMAIL FORM */}
            <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-2.5 mt-1">
              <div>
                <input
                  type="email"
                  placeholder="Corporate Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="uiverse-popup-input"
                  required
                />
                {emailError && <p className="text-yellow-300 text-xs mt-1 font-mono">{emailError}</p>}
              </div>

              <input
                type="password"
                placeholder="Password (optional for guest)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="uiverse-popup-input"
              />

              <button
                type="submit"
                disabled={loading}
                className="uiverse-popup-oauthButton mt-1"
              >
                {loading ? 'Sending 2FA Code...' : 'Send 2FA Security Code →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}