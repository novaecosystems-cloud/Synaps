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
