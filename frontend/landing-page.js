// Detective SQL - Landing Page JavaScript
// Handles navigation, login/signup, and smooth scrolling

// ============================================
// AUTHENTICATION STATE MANAGEMENT
// ============================================
const AUTH_STORAGE_KEY = 'mm_auth_state';

// Load auth state from localStorage
function loadAuthState() {
    try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to load auth state:', e);
    }
    return { isLoggedIn: false, username: null, email: null };
}

// Save auth state to localStorage
function saveAuthState(authState) {
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    } catch (e) {
        console.warn('Failed to save auth state:', e);
    }
}

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// ============================================
// AUTH TABS SWITCHING
// ============================================
function initAuthTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    console.log('Auth tabs found:', authTabs.length);
    console.log('Auth forms found:', authForms.length);
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            console.log('Tab clicked:', targetTab);
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetTab}Form`) {
                    form.classList.add('active');
                    console.log('Showing form:', form.id);
                }
            });
            
            // Clear messages
            clearAuthMessages();
        });
    });
}

// ============================================
// LOGIN FUNCTIONALITY
// ============================================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    
    console.log('Login form found:', !!loginForm);
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const messageEl = document.getElementById('loginMessage');
            
            console.log('Email:', email, 'Password:', password ? '***' : '');
            
            // Simple validation
            if (!email || !password) {
                showAuthMessage('loginMessage', 'Please fill in all fields', 'error');
                return;
            }
            
            // Simulate login (localStorage-based)
            const authState = {
                isLoggedIn: true,
                username: email.split('@')[0],
                email: email
            };
            
            saveAuthState(authState);
            showAuthMessage('loginMessage', 'Login successful! Redirecting...', 'success');
            
            // Redirect to game page after successful login
            setTimeout(() => {
                window.location.href = 'game-pro.html';
            }, 1500);
        });
    }
}

// ============================================
// SIGNUP FUNCTIONALITY
// ============================================
function initSignup() {
    const signupForm = document.getElementById('signupForm');
    
    console.log('Signup form found:', !!signupForm);
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Signup form submitted');
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const messageEl = document.getElementById('signupMessage');
            
            console.log('Name:', name, 'Email:', email, 'Password:', password ? '***' : '');
            
            // Simple validation
            if (!name || !email || !password) {
                showAuthMessage('signupMessage', 'Please fill in all fields', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAuthMessage('signupMessage', 'Password must be at least 6 characters', 'error');
                return;
            }
            
            // Simulate signup (localStorage-based)
            const authState = {
                isLoggedIn: true,
                username: name,
                email: email
            };
            
            saveAuthState(authState);
            showAuthMessage('signupMessage', 'Account created! Redirecting...', 'success');
            
            // Redirect to game page after successful signup
            setTimeout(() => {
                window.location.href = 'game-pro.html';
            }, 1500);
        });
    }
}

// ============================================
// AUTH MESSAGE DISPLAY
// ============================================
function showAuthMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
    }
}

function clearAuthMessages() {
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');
    
    if (loginMessage) {
        loginMessage.textContent = '';
        loginMessage.className = 'auth-message';
    }
    
    if (signupMessage) {
        signupMessage.textContent = '';
        signupMessage.className = 'auth-message';
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// ============================================
// INITIALIZE LANDING PAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing landing page');
    
    // Initialize all functionality
    initSmoothScroll();
    initMobileNav();
    initAuthTabs();
    initLogin();
    initSignup();
    initNavbarScroll();
    
    // Check if user is already logged in
    const authState = loadAuthState();
    if (authState.isLoggedIn) {
        // User is logged in - could update UI to show logged-in state
        // But for landing page, we keep it as is to allow new users to see the page
        console.log('User is logged in:', authState.username);
    }
    
    console.log('Landing page initialization complete');
});
