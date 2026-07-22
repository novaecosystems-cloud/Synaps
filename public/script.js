import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 1. Initialize Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// 2. Initialize SplitType for all split-text headings
const splitTypes = document.querySelectorAll('.split-text-target');
splitTypes.forEach((char,i) => {
    const text = new SplitType(char, { types: 'lines, words' })
})

// Function to create text reveal animations
function animateTextReveal(triggerElement) {
    const words = triggerElement.querySelectorAll('.word');
    const fades = triggerElement.querySelectorAll('.fade-text');
    const lists = triggerElement.querySelectorAll('.feature-list');
    const bubbles = triggerElement.querySelectorAll('.comic-bubble');
    
    gsap.to(words, {
        y: 0,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: triggerElement,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.to(fades, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: triggerElement,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });

    if(lists.length) {
        gsap.to(lists, {
            opacity: 1,
            duration: 1,
            delay: 0.4,
            scrollTrigger: { trigger: triggerElement, start: 'top 75%', toggleActions: 'play none none reverse' }
        })
    }

    if(bubbles.length) {
        gsap.to(bubbles, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'elastic.out(1, 0.6)',
            delay: 0.6,
            scrollTrigger: { trigger: triggerElement, start: 'top 75%', toggleActions: 'play none none reverse' }
        })
    }
}

// Apply text reveals to all sections
document.querySelectorAll('.split-section').forEach(section => {
    animateTextReveal(section);
});

// Frame 5: Screen Overlay Activation
gsap.to(".screen-overlay", {
    opacity: 1,
    duration: 0.5,
    scrollTrigger: {
        trigger: "#frame5",
        start: "top center",
        toggleClass: "active"
    }
});

// Frame 8: Color Grade Shift (Night to Morning)
// Fade in the morning image over the night image smoothly as they scroll
gsap.to("#frame8 .morning-bg", {
    opacity: 1, 
    ease: "power1.inOut",
    scrollTrigger: { 
        trigger: "#frame8", 
        start: "top center", 
        end: "bottom center", 
        scrub: true 
    }
});

// Authentication Modal Logic
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

let isLoginMode = true;

// Open Modal
ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if(modal) modal.classList.add('active');
        // Disable Lenis scroll while modal is open
        if(typeof lenis !== 'undefined') lenis.stop();
    });
});

// Close Modal
const closeModalFunc = () => {
    if(modal) modal.classList.remove('active');
    // Re-enable Lenis scroll
    if(typeof lenis !== 'undefined') lenis.start();
};
if (closeBtn) closeBtn.addEventListener('click', closeModalFunc);
if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
});

// Toggle Login / Signup
if (toggleAuthMode) {
    toggleAuthMode.addEventListener('click', function toggleMode() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            modalTitle.textContent = 'Welcome Back';
            modalSubtitle.textContent = 'Sign in to access your intelligence layer.';
            nameGroup.style.display = 'none';
            nameInput.removeAttribute('required');
            authSubmitBtn.textContent = 'Sign In';
            toggleText.innerHTML = `Don't have an account? <span class="toggle-link" id="toggleAuthMode">Request Access</span>`;
        } else {
            modalTitle.textContent = 'Request Access';
            modalSubtitle.textContent = 'Join the waitlist for SYNAPS Early Access.';
            nameGroup.style.display = 'block';
            nameInput.setAttribute('required', 'true');
            authSubmitBtn.textContent = 'Submit Request';
            toggleText.innerHTML = `Already have an account? <span class="toggle-link" id="toggleAuthMode">Sign In</span>`;
        }
        
        // Re-bind the event listener to the newly created span
        document.getElementById('toggleAuthMode').addEventListener('click', toggleMode);
    });
}

// -----------------------------------------------------------------------------
// FLOATING INTERACTIVE ELEMENTS
// -----------------------------------------------------------------------------
const floatingElements = [
    '<div class="float-pill bg-primary">SQL Synced</div>',
    '<div class="float-pill bg-secondary">CRM Connected</div>',
    '<div class="float-pill bg-accent">Anomaly Detected</div>',
    '<div class="float-pill bg-info">+45% Efficiency</div>',
    '<div class="float-pill bg-success">AI Mapping...</div>'
];

document.addEventListener("click", function (event) {
    // Don't spawn if clicking a button or link or inside modal
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
    
    gsap.set(wrapper, {
        scale: 0,
        rotation: randomRotation,
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "center",
    });

    const tl = gsap.timeline();
    const randomScale = Math.random() * 0.4 + 0.8;
    
    tl.to(wrapper, {
        scale: randomScale,
        duration: 0.5,
        ease: "back.out(1.7)"
    });

    tl.to(wrapper, {
        y: () => `-=${Math.random() * 200 + 200}`,
        x: () => `+=${Math.random() * 100 - 50}`,
        opacity: 0,
        duration: 3,
        ease: "power1.out",
        onComplete: () => {
            if(wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
        }
    }, "-=0.2");
});

// -----------------------------------------------------------------------------
// FIREBASE AUTHENTICATION
// -----------------------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyAcRknk1UALIeqOnxwVVMHjEbuIsLWEjRM",
    authDomain: "synaps-3d138.firebaseapp.com",
    projectId: "synaps-3d138",
    storageBucket: "synaps-3d138.firebasestorage.app",
    messagingSenderId: "122307686567",
    appId: "1:122307686567:web:4af124889a9e8316426b82"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleBtn = document.querySelector('.google-btn');
const linkedinBtn = document.querySelector('.linkedin-btn');

// Toast Notification Logic
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    container.appendChild(toast);

    gsap.to(toast, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
    });

    setTimeout(() => {
        gsap.to(toast, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                if(toast.parentNode) toast.parentNode.removeChild(toast);
            }
        });
    }, 4000);
}

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google sign-in successful:", result.user);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Google sign-in error:", error);
            showToast(error.message);
        }
    });
}

if (linkedinBtn) {
    linkedinBtn.addEventListener('click', async () => {
        const provider = new OAuthProvider('linkedin.com');
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("LinkedIn sign-in successful:", result.user);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("LinkedIn sign-in error:", error);
            showToast(error.message);
        }
    });
}


// -----------------------------------------------------------------------------
// STACK SCROLL LOGIC
// -----------------------------------------------------------------------------
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


// -----------------------------------------------------------------------------
// DEEP MOUSE PARALLAX (Mohitvirli Style)
// -----------------------------------------------------------------------------
const parallaxTargets = document.querySelectorAll(".ambient-particles, .data-rain, .comic-bubble, .alert-ui, .card");
document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    gsap.to(parallaxTargets, {
        x: x,
        y: y,
        duration: 1,
        ease: "power2.out",
        stagger: 0.05
    });
});

