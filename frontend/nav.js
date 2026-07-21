/* ============================================
   PROJECT VRITRA - GLOBAL NAVIGATION
   ============================================ */

(function() {
    // Navigation HTML template
    const navHTML = `
        <nav class="navbar">
            <div class="nav-container">
                <a href="index.html" class="nav-logo">
                    <i class="fas fa-user-secret"></i>
                    <span>PROJECT VRITRA</span>
                </a>
                <ul class="nav-menu">
                    <li><a href="index.html">HOME</a></li>
                    <li><a href="dossier.html" class="nav-dossier">DOSSIER</a></li>
                    <li><a href="cases.html">CASES</a></li>
                    <li><a href="story.html">STORY</a></li>
                    <li><a href="characters.html">TEAM</a></li>
                    <li><a href="about.html">ABOUT</a></li>
                    <li><a href="leaderboard.html">LEADERBOARD</a></li>
                    <li><a href="cases.html" class="nav-cta">INVESTIGATE</a></li>
                </ul>
                <div class="nav-actions">
                    <a href="dossier.html" class="nav-action-btn" title="Task Force Dossier">
                        <i class="fas fa-folder-open"></i>
                    </a>
                    <a href="#" class="nav-action-btn nav-notifications" title="Notifications">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge">0</span>
                    </a>
                    <a href="#" class="nav-action-btn nav-messages" title="Team Communications">
                        <i class="fas fa-comments"></i>
                        <span class="message-badge">0</span>
                    </a>
                </div>
                <div class="nav-toggle">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </nav>
    `;

    // Inject navigation
    function injectNavigation() {
        const navContainer = document.createElement('div');
        navContainer.innerHTML = navHTML;
        document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);
    }

    // Set active link based on current page
    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Mobile menu toggle
    function setupMobileToggle() {
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
            
            // Close menu when clicking a link
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                });
            });
        }
    }

    // Smooth scroll for anchor links
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const navHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = target.offsetTop - navHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Add padding to body for fixed navbar
    function addBodyPadding() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const navHeight = navbar.offsetHeight;
            document.body.style.paddingTop = navHeight + 'px';
        }
    }

    // Update notification badge
    function updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            const unreadCount = notificationSystem ? notificationSystem.getUnreadCount() : 0;
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    // Update message badge
    function updateMessageBadge() {
        const badge = document.querySelector('.message-badge');
        if (badge) {
            const unreadCount = teamCommunications ? teamCommunications.getUnreadCount() : 0;
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    // Setup notification and message click handlers
    function setupActionHandlers() {
        const notifBtn = document.querySelector('.nav-notifications');
        const msgBtn = document.querySelector('.nav-messages');

        if (notifBtn) {
            notifBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Open notifications panel (would be implemented in a modal)
                if (notificationSystem) {
                    notificationSystem.markAllAsRead();
                    updateNotificationBadge();
                }
            });
        }

        if (msgBtn) {
            msgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Open messages panel (would be implemented in a modal)
                if (teamCommunications) {
                    teamCommunications.markAllAsRead();
                    updateMessageBadge();
                }
            });
        }
    }

    // Initialize
    function init() {
        injectNavigation();
        setActiveLink();
        setupMobileToggle();
        setupSmoothScroll();
        addBodyPadding();
        setupActionHandlers();
        
        // Update badges after a short delay to ensure systems are loaded
        setTimeout(() => {
            updateNotificationBadge();
            updateMessageBadge();
        }, 500);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-calculate padding on resize
    window.addEventListener('resize', addBodyPadding);
})();
