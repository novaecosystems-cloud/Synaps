'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, isSignInWithEmailLink, signInWithEmailLink, OAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { syncUserAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';

/** RFC 5322-compliant email validation — covers all real-world valid formats */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailLinkSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let savedEmail = window.localStorage.getItem('emailForSignIn');
        if (!savedEmail) {
          savedEmail = window.prompt('Please provide your email for confirmation');
        }
        
        if (savedEmail) {
          setLoading(true);
          try {
            const result = await signInWithEmailLink(auth, savedEmail, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            
            const token = await result.user.getIdToken();
            const syncResult = await syncUserAction(token);
            
            if (syncResult.success) {
              toast({ title: 'Success', description: 'Joined successfully.' });
              router.push('/dashboard');
            } else {
              toast({ title: 'Error', description: syncResult.error, variant: 'destructive' });
            }
          } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
          } finally {
            setLoading(false);
          }
        }
      }
    };
    
    handleEmailLinkSignIn();
  }, [router, toast]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Client-side email validation (runs before any network call) ──
    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address (e.g. you@company.com).');
      return;
    }
    setEmailError('');

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const token = await userCredential.user.getIdToken();
      
      const syncResult = await syncUserAction(token);
      if (syncResult.success) {
        toast({ title: 'Success', description: 'Logged in successfully.' });
        router.push('/dashboard');
      } else {
        toast({ title: 'Error', description: syncResult.error, variant: 'destructive' });
      }
    } catch (error: unknown) {
      const msg = (error as any)?.code === 'auth/invalid-credential'
        ? 'Incorrect email or password.'
        : (error as Error).message;
      toast({ title: 'Sign-in failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      const syncResult = await syncUserAction(token);
      if (syncResult.success) {
        toast({ title: 'Success', description: 'Logged in successfully.' });
        router.push('/dashboard');
      } else {
        toast({ title: 'Error', description: syncResult.error, variant: 'destructive' });
      }
    } catch (error: unknown) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const provider = new OAuthProvider('linkedin.com');
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      
      const syncResult = await syncUserAction(token);
      if (syncResult.success) {
        toast({ title: 'Success', description: 'Logged in successfully.' });
        router.push('/dashboard');
      } else {
        toast({ title: 'Error', description: syncResult.error, variant: 'destructive' });
      }
    } catch (error: unknown) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 rounded-3xl">
        <div className="card-body p-8 sm:p-10">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-xl mb-4 shadow-lg shadow-primary/30">
              S
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-base-content">Welcome back</h2>
            <p className="text-sm text-base-content/60 mt-1">Sign in to your Synaps workspace</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                className={`input input-bordered w-full rounded-xl bg-base-100 focus:bg-base-100 transition-colors ${emailError ? 'input-error' : 'focus:input-primary'}`}
                name="email" 
                required 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onBlur={() => {
                  if (email && !isValidEmail(email)) {
                    setEmailError('Please enter a valid email address.');
                  }
                }}
                disabled={loading}
              />
              {emailError && (
                <label className="label pb-0">
                  <span className="label-text-alt text-error font-medium">{emailError}</span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input input-bordered w-full rounded-xl bg-base-100 focus:bg-base-100 focus:input-primary transition-colors"
                name="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"}
            </button>
          </form>

          <div className="divider text-base-content/40 text-sm font-medium my-6">OR</div>

          <button 
            type="button" 
            className="btn btn-outline w-full rounded-xl hover:bg-base-200 hover:text-base-content border-base-300 font-medium" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              <path d="M1 1h22v22H1z" fill="none"></path>
            </svg>
            Continue with Google
          </button>

          <button 
            type="button" 
            className="btn btn-outline w-full rounded-xl hover:bg-base-200 hover:text-base-content border-base-300 font-medium mt-3" 
            onClick={handleLinkedInLogin} 
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>

          <p className="mt-8 text-center text-sm text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary-focus transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}