import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// -----------------------------------------------------------------------------
// FIREBASE AUTHENTICATION (FAILSAFE INITIALIZATION)
// -----------------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAcRknk1UALIeqOnxwVVMHjEbuIsLWEjRM",
    authDomain: "synaps-3d138.firebaseapp.com",
    projectId: "synaps-3d138",
    storageBucket: "synaps-3d138.firebasestorage.app",
    messagingSenderId: "122307686567",
    appId: "1:122307686567:web:4af124889a9e8316426b82"
};

let app, auth;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (err) {
    console.error("Firebase initialization failed:", err);
}

// Toast Notification Helper
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.cssText = 'background:#1e1b4b;color:#a5b4fc;padding:14px 22px;border-radius:12px;border:1px solid #6366f1;font-size:13px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.5);';
    toast.textContent = message;
    container.appendChild(toast);

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(toast, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
    } else {
        toast.style.opacity = '1';
    }

    setTimeout(() => {
        if (typeof gsap !== 'undefined') {
            gsap.to(toast, { opacity: 0, y: 20, duration: 0.3, onComplete: () => toast.remove() });
        } else {
            toast.remove();
        }
    }, 4500);
}

function getFriendlyAuthErrorMessage(error) {
    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return 'Sign-in window was closed. Please try again.';
    }
    if (code === 'auth/popup-blocked') {
        return 'Sign-in popup was blocked by your browser. Please allow popups or use email sign in.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return 'Incorrect email or password.';
    }
    if (code === 'auth/email-already-in-use') {
        return 'An account with this email already exists. Please sign in instead.';
    }
    if (code === 'auth/unauthorized-domain') {
        return 'Domain unauthorized for Firebase login. Please check Firebase Auth settings.';
    }
    return error?.message || 'Authentication failed. Please try again.';
}

// Attach Event Listeners on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initAuthListeners();
    initAnimations();
});

// Run immediately if DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initAuthListeners();
    initAnimations();
}

function initAuthListeners() {
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeModal');
    const ctaButtons = document.querySelectorAll('.cta');

    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const nameGroup = document.getElementById('nameGroup');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('toggleText');
    const nameInput = document.getElementById('name');
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const googleBtn = document.querySelector('.google-btn');
    const linkedinBtn = document.querySelector('.linkedin-btn');

    let isLoginMode = true;

    // CTA Click Handlers
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) {
                modal.classList.add('active');
            } else {
                window.location.href = '/login';
            }
        });
    });

    // Close Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Toggle Login / Signup
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', function toggleMode() {
            isLoginMode = !isLoginMode;
            if (isLoginMode) {
                if (modalTitle) modalTitle.textContent = 'Welcome Back';
                if (modalSubtitle) modalSubtitle.textContent = 'Sign in to access your intelligence layer.';
                if (nameGroup) nameGroup.style.display = 'none';
                if (nameInput) nameInput.removeAttribute('required');
                if (authSubmitBtn) authSubmitBtn.textContent = 'Sign In';
                if (toggleText) toggleText.innerHTML = `Don't have an account? <span class="toggle-link" id="toggleAuthMode">Request Access</span>`;
            } else {
                if (modalTitle) modalTitle.textContent = 'Request Access';
                if (modalSubtitle) modalSubtitle.textContent = 'Join SYNAPS Early Access.';
                if (nameGroup) nameGroup.style.display = 'block';
                if (nameInput) nameInput.setAttribute('required', 'true');
                if (authSubmitBtn) authSubmitBtn.textContent = 'Create Account';
                if (toggleText) toggleText.innerHTML = `Already have an account? <span class="toggle-link" id="toggleAuthMode">Sign In</span>`;
            }
            const newToggle = document.getElementById('toggleAuthMode');
            if (newToggle) newToggle.addEventListener('click', toggleMode);
        });
    }

    // Form Submit Handler
    if (authForm) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput?.value?.trim();
            const password = passwordInput?.value;

            if (!email || !password) {
                showToast("Please enter your email and password.");
                return;
            }

            if (authSubmitBtn) {
                authSubmitBtn.disabled = true;
                authSubmitBtn.textContent = isLoginMode ? "Signing In..." : "Creating Account...";
            }

            try {
                let userCredential;
                if (isLoginMode) {
                    userCredential = await signInWithEmailAndPassword(auth, email, password);
                } else {
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                }

                const token = await userCredential.user.getIdToken();
                const res = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken: token })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    showToast("Authenticated! Loading dashboard...");
                    window.location.href = '/dashboard';
                } else {
                    showToast(data.error || 'Failed to initialize session.');
                    if (authSubmitBtn) {
                        authSubmitBtn.disabled = false;
                        authSubmitBtn.textContent = isLoginMode ? "Sign In" : "Create Account";
                    }
                }
            } catch (error) {
                console.error("Auth error:", error);
                const msg = getFriendlyAuthErrorMessage(error);
                showToast(msg);
                if (authSubmitBtn) {
                    authSubmitBtn.disabled = false;
                    authSubmitBtn.textContent = isLoginMode ? "Sign In" : "Create Account";
                }
            }
        });
    }

    // Google Sign-in Handler
    if (googleBtn) {
        googleBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = googleBtn.innerHTML;
            googleBtn.style.opacity = '0.7';
            googleBtn.style.pointerEvents = 'none';

            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const token = await result.user.getIdToken();

                const res = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken: token })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    showToast("Google sign-in verified! Redirecting...");
                    window.location.href = '/dashboard';
                } else {
                    showToast(data.error || 'Google sign-in failed.');
                    googleBtn.style.opacity = '1';
                    googleBtn.style.pointerEvents = 'auto';
                    googleBtn.innerHTML = originalText;
                }
            } catch (error) {
                console.error("Google sign-in error:", error);
                const msg = getFriendlyAuthErrorMessage(error);
                showToast(msg);
                googleBtn.style.opacity = '1';
                googleBtn.style.pointerEvents = 'auto';
                googleBtn.innerHTML = originalText;
            }
        });
    }

    // LinkedIn Sign-in Handler
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const originalText = linkedinBtn.innerHTML;
            linkedinBtn.style.opacity = '0.7';
            linkedinBtn.style.pointerEvents = 'none';

            const provider = new OAuthProvider('linkedin.com');
            try {
                const result = await signInWithPopup(auth, provider);
                const token = await result.user.getIdToken();

                const res = await fetch('/api/auth/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken: token })
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    showToast("LinkedIn sign-in verified! Redirecting...");
                    window.location.href = '/dashboard';
                } else {
                    showToast(data.error || 'LinkedIn sign-in failed.');
                    linkedinBtn.style.opacity = '1';
                    linkedinBtn.style.pointerEvents = 'auto';
                    linkedinBtn.innerHTML = originalText;
                }
            } catch (error) {
                console.error("LinkedIn sign-in error:", error);
                const msg = getFriendlyAuthErrorMessage(error);
                showToast(msg);
                linkedinBtn.style.opacity = '1';
                linkedinBtn.style.pointerEvents = 'auto';
                linkedinBtn.innerHTML = originalText;
            }
        });
    }
}

// Safely Initialize Animations
function initAnimations() {
    try {
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                smooth: true,
            });

            if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => { lenis.raf(time * 1000); });
                gsap.ticker.lagSmoothing(0);
            }
        }
    } catch (e) {
        console.warn("Smooth scroll initialization warning:", e);
    }

    try {
        if (typeof SplitType !== 'undefined') {
            document.querySelectorAll('.split-text-target').forEach((char) => {
                new SplitType(char, { types: 'lines, words' });
            });
        }
    } catch (e) {
        console.warn("SplitType initialization warning:", e);
    }
}
