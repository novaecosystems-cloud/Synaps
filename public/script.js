import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// -----------------------------------------------------------------------------
// FIREBASE INITIALIZATION
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
    console.warn("Firebase initialization warning:", err);
}

// -----------------------------------------------------------------------------
// TOAST & AUTH HELPERS
// -----------------------------------------------------------------------------
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
        return null;
    }
    if (code === 'auth/popup-blocked') {
        return 'Sign-in popup was blocked by browser. Please allow popups or use email sign-in.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return 'Incorrect email or password.';
    }
    if (code === 'auth/email-already-in-use') {
        return 'An account with this email already exists. Please sign in instead.';
    }
    return error?.message || 'Authentication failed. Please try again.';
}

// -----------------------------------------------------------------------------
// INITIALIZE ANIMATIONS & GSAP CARD STACK
// -----------------------------------------------------------------------------
function initAnimations() {
    // 1. Lenis Smooth Scrolling
    let lenis;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => { lenis.raf(time * 1000); });
                gsap.ticker.lagSmoothing(0);
            }
        }
    } catch (e) {
        console.warn("Lenis init warning:", e);
    }

    // 2. SplitType Target Headings
    try {
        if (typeof SplitType !== 'undefined') {
            document.querySelectorAll('.split-text-target').forEach((char) => {
                new SplitType(char, { types: 'lines, words' });
            });
        }
    } catch (e) {
        console.warn("SplitType init warning:", e);
    }

    // 3. Text Reveal Animations
    try {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            document.querySelectorAll('.split-section').forEach(triggerElement => {
                const words = triggerElement.querySelectorAll('.word');
                const fades = triggerElement.querySelectorAll('.fade-text');
                const lists = triggerElement.querySelectorAll('.feature-list');
                const bubbles = triggerElement.querySelectorAll('.comic-bubble');
                
                if (words.length) {
                    gsap.to(words, {
                        y: 0, stagger: 0.03, duration: 0.8, ease: 'power3.out',
                        scrollTrigger: { trigger: triggerElement, start: 'top 75%', toggleActions: 'play none none reverse' }
                    });
                }
                if (fades.length) {
                    gsap.to(fades, {
                        opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out',
                        scrollTrigger: { trigger: triggerElement, start: 'top 75%', toggleActions: 'play none none reverse' }
                    });
                }
                if (lists.length) {
                    gsap.to(lists, {
                        opacity: 1, duration: 1, delay: 0.4,
                        scrollTrigger: { trigger: triggerElement, start: 'top 75%', toggleActions: 'play none none reverse' }
                    });
                }
                if (bubbles.length) {
                    gsap.to(bubbles, {
                        scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.6)', delay: 0.6,
                        scrollTrigger: { trigger: triggerElement, start: 'top 75%', toggleActions: 'play none none reverse' }
                    });
                }
            });

            // Frame 5 Screen Overlay
            gsap.to(".screen-overlay", {
                opacity: 1, duration: 0.5,
                scrollTrigger: { trigger: "#frame5", start: "top center", toggleClass: "active" }
            });

            // Frame 8 Morning BG Shift
            gsap.to("#frame8 .morning-bg", {
                opacity: 1, ease: "power1.inOut",
                scrollTrigger: { trigger: "#frame8", start: "top center", end: "bottom center", scrub: true }
            });
        }
    } catch (e) {
        console.warn("GSAP text reveal warning:", e);
    }

    // 4. GSAP CARD STACK SCROLL ANIMATION (Pinning & Flying Cards)
    try {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const stackCards = gsap.utils.toArray(".card");
            if (stackCards.length) {
                const PEEK = 42;
                const SCALE_STEP = 0.045;

                function stackPose(index) {
                    return {
                        y: index * PEEK,
                        scale: 1 - index * SCALE_STEP,
                    };
                }

                stackCards.forEach((card, i) => {
                    gsap.set(card, {
                        zIndex: stackCards.length - i,
                        y: window.innerHeight * 0.72 + i * PEEK,
                        scale: stackPose(i).scale * 0.9,
                        rotate: 0,
                        transformOrigin: "50% 0%",
                    });
                });

                const stackTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#stack",
                        start: "top top",
                        end: () => `+=${stackCards.length * window.innerHeight}`,
                        pin: true,
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                });

                stackCards.forEach((card, i) => {
                    stackTl.to(card, { ...stackPose(i), ease: "power3.out", duration: 1.35 }, i * 0.06);
                });

                stackTl.to({}, { duration: 0.35 });

                const flyAt = stackTl.duration();
                const flying = stackCards.slice(0, -1);

                flying.forEach((card, i) => {
                    const time = flyAt + i;
                    const behind = stackCards.slice(i + 1);

                    stackTl.to(card, {
                        y: () => -window.innerHeight * 1.15,
                        rotate: -15,
                        scale: 0.94,
                        ease: "none",
                        duration: 1,
                    }, time);

                    stackTl.to(behind, {
                        y: (index) => stackPose(index).y,
                        scale: (index) => stackPose(index).scale,
                        ease: "none",
                        duration: 1,
                    }, time);
                });

                stackTl.to({}, { duration: 0.4 });
            }
        }
    } catch (e) {
        console.warn("GSAP card stack animation warning:", e);
    }

    // 5. Deep Mouse Parallax
    try {
        if (typeof gsap !== 'undefined') {
            const parallaxTargets = document.querySelectorAll(".ambient-particles, .data-rain, .comic-bubble, .alert-ui, .card");
            document.addEventListener("mousemove", (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                
                gsap.to(parallaxTargets, {
                    x: x, y: y, duration: 1, ease: "power2.out", stagger: 0.05
                });
            });
        }
    } catch (e) {
        console.warn("Mouse parallax warning:", e);
    }

    // 6. Floating Interactive Elements on click
    try {
        const floatingElements = [
            '<div class="float-pill bg-primary">SQL Synced</div>',
            '<div class="float-pill bg-secondary">CRM Connected</div>',
            '<div class="float-pill bg-accent">Anomaly Detected</div>',
            '<div class="float-pill bg-info">+45% Efficiency</div>',
            '<div class="float-pill bg-success">AI Mapping...</div>'
        ];

        document.addEventListener("click", function (event) {
            if (event.target.closest('button, a, .auth-modal-content, .auth-modal-overlay')) return;
            
            const itemHTML = floatingElements[Math.floor(Math.random() * floatingElements.length)];
            let container = document.createElement("div");
            container.innerHTML = itemHTML;
            const appendedElement = container.firstChild;
            
            const wrapper = document.createElement("div");
            wrapper.style.position = "fixed";
            wrapper.style.left = `${event.clientX}px`;
            wrapper.style.top = `${event.clientY}px`;
            wrapper.style.pointerEvents = "none";
            wrapper.style.zIndex = "999";
            wrapper.appendChild(appendedElement);
            
            document.body.appendChild(wrapper);

            const randomRotation = Math.random() * 20 - 10;
            
            if (typeof gsap !== 'undefined') {
                gsap.set(wrapper, {
                    scale: 0, rotation: randomRotation, xPercent: -50, yPercent: -50, transformOrigin: "center"
                });

                const tl = gsap.timeline();
                const randomScale = Math.random() * 0.4 + 0.8;
                
                tl.to(wrapper, { scale: randomScale, duration: 0.5, ease: "back.out(1.7)" });
                tl.to(wrapper, {
                    y: () => `-=${Math.random() * 200 + 200}`, x: () => `+=${Math.random() * 100 - 50}`,
                    opacity: 0, duration: 3, ease: "power1.out",
                    onComplete: () => { if(wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); }
                }, "-=0.2");
            }
        });
    } catch (e) {
        console.warn("Floating elements warning:", e);
    }
}

// -----------------------------------------------------------------------------
// AUTH MODAL & BUTTON LISTENERS
// -----------------------------------------------------------------------------
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

    // CTA Button Click (Opens Modal or Redirects)
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

    // Email/Password Submit Handler
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
                if (msg) showToast(msg);
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
                if (msg) showToast(msg);
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
                if (msg) showToast(msg);
                linkedinBtn.style.opacity = '1';
                linkedinBtn.style.pointerEvents = 'auto';
                linkedinBtn.innerHTML = originalText;
            }
        });
    }
}

// Run setup on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAuthListeners();
        initAnimations();
    });
} else {
    initAuthListeners();
    initAnimations();
}
