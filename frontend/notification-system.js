// Notification System
// Handles in-game notifications for promotions, new intelligence, achievements, etc.

const notificationSystem = {
    // Notification types and their icons
    notificationTypes: {
        'promotion_earned': { icon: 'fas fa-medal', color: '#d4af37', title: 'Promotion Earned' },
        'new_intelligence': { icon: 'fas fa-file-secret', color: '#3b82f6', title: 'New Intelligence' },
        'evidence_updated': { icon: 'fas fa-fingerprint', color: '#22c55e', title: 'Evidence Updated' },
        'case_unlocked': { icon: 'fas fa-folder-open', color: '#f59e0b', title: 'Case Unlocked' },
        'achievement_earned': { icon: 'fas fa-trophy', color: '#ec4899', title: 'Achievement Earned' },
        'message_received': { icon: 'fas fa-envelope', color: '#8b5cf6', title: 'Message Received' },
        'rank_up': { icon: 'fas fa-star', color: '#ef4444', title: 'Rank Up' }
    },

    // Notifications array
    notifications: [],

    // Add notification
    addNotification(type, message, data = {}) {
        const typeConfig = this.notificationTypes[type] || { icon: 'fas fa-bell', color: '#d4af37', title: 'Notification' };
        
        const notification = {
            id: Date.now(),
            type: type,
            title: data.title || typeConfig.title,
            message: message,
            icon: typeConfig.icon,
            color: typeConfig.color,
            isRead: false,
            timestamp: new Date().toISOString(),
            data: data
        };

        this.notifications.unshift(notification);
        
        // Save to localStorage
        this.saveNotifications();
        
        // Show toast notification
        this.showToast(notification);
        
        // Update notification badge
        this.updateBadge();
        
        return notification;
    },

    // Get all notifications
    getNotifications() {
        return this.notifications;
    },

    // Get unread notifications
    getUnreadNotifications() {
        return this.notifications.filter(notif => !notif.isRead);
    },

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(notif => notif.id === notificationId);
        if (notification) {
            notification.isRead = true;
            this.saveNotifications();
            this.updateBadge();
        }
    },

    // Mark all as read
    markAllAsRead() {
        this.notifications.forEach(notif => {
            notif.isRead = true;
        });
        this.saveNotifications();
        this.updateBadge();
    },

    // Delete notification
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(notif => notif.id !== notificationId);
        this.saveNotifications();
        this.updateBadge();
    },

    // Clear all notifications
    clearAll() {
        this.notifications = [];
        this.saveNotifications();
        this.updateBadge();
    },

    // Save notifications to localStorage
    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },

    // Load notifications from localStorage
    loadNotifications() {
        const saved = localStorage.getItem('notifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
        }
    },

    // Show toast notification
    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-bg-secondary);
            border: 1px solid ${notification.color};
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-md);
        `;
        
        toast.innerHTML = `
            <div style="width: 40px; height: 40px; background: ${notification.color}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="${notification.icon}" style="color: var(--color-text-primary); font-size: 1.25rem;"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--spacing-xs);">${notification.title}</div>
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5;">${notification.message}</div>
            </div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 1rem; padding: var(--spacing-xs);">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    },

    // Update notification badge in navigation
    updateBadge() {
        const unreadCount = this.getUnreadNotifications().length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // Render notifications panel
    renderNotificationsPanel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-muted);">
                    <i class="fas fa-bell" style="font-size: 2rem; margin-bottom: var(--spacing-md);"></i>
                    <p>No notifications yet.</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.notifications.forEach(notif => {
            const timeAgo = this.getTimeAgo(new Date(notif.timestamp));
            
            html += `
                <div class="notification-item ${!notif.isRead ? 'unread' : ''}" data-id="${notif.id}">
                    <div class="notification-icon" style="color: ${notif.color};">
                        <i class="${notif.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <span class="notification-title">${notif.title}</span>
                            <span class="notification-time">${timeAgo}</span>
                        </div>
                        <div class="notification-message">${notif.message}</div>
                    </div>
                    <button class="notification-delete" onclick="notificationSystem.deleteNotification(${notif.id}); notificationSystem.renderNotificationsPanel('${containerId}');">
                        <i class="fas fa-times"></i>
                    </button>
                    ${!notif.isRead ? '<div class="unread-indicator"></div>' : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-delete')) {
                    const id = parseInt(item.dataset.id);
                    this.markAsRead(id);
                    item.classList.remove('unread');
                    const indicator = item.querySelector('.unread-indicator');
                    if (indicator) indicator.remove();
                }
            });
        });
    },

    // Get time ago string
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        return `${Math.floor(seconds / 86400)} days ago`;
    },

    // Get unread count
    getUnreadCount() {
        return this.getUnreadNotifications().length;
    },

    // Convenience methods for common notification types
    notifyPromotion(newRank) {
        this.addNotification('promotion_earned', `Congratulations! You have been promoted to ${newRank}.`, { title: 'Promotion Earned' });
    },

    notifyNewIntelligence(caseId) {
        this.addNotification('new_intelligence', `New intelligence received for Case ${caseId}.`, { title: 'New Intelligence' });
    },

    notifyEvidenceUpdated(caseId) {
        this.addNotification('evidence_updated', `Evidence locker updated for Case ${caseId}.`, { title: 'Evidence Updated' });
    },

    notifyCaseUnlocked(caseId, caseTitle) {
        this.addNotification('case_unlocked', `Case ${caseId}: ${caseTitle} is now available.`, { title: 'Case Unlocked' });
    },

    notifyAchievement(achievementName) {
        this.addNotification('achievement_earned', `Achievement unlocked: ${achievementName}.`, { title: 'Achievement Earned' });
    },

    notifyRankUp(newRank) {
        this.addNotification('rank_up', `You have advanced to ${newRank}.`, { title: 'Rank Up' });
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-item {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--color-dark-gray);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        position: relative;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .notification-item:hover {
        border-color: var(--color-gold);
    }

    .notification-item.unread {
        border-left: 3px solid var(--color-crimson);
    }

    .notification-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
        width: 24px;
        text-align: center;
    }

    .notification-content {
        flex: 1;
    }

    .notification-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--spacing-xs);
    }

    .notification-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-primary);
    }

    .notification-time {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .notification-message {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
    }

    .notification-delete {
        background: none;
        border: none;
        color: var(--color-text-muted);
        cursor: pointer;
        font-size: 0.875rem;
        padding: var(--spacing-xs);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .notification-item:hover .notification-delete {
        opacity: 1;
    }

    .notification-delete:hover {
        color: var(--color-crimson);
    }

    .unread-indicator {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        width: 8px;
        height: 8px;
        background: var(--color-crimson);
        border-radius: 50%;
    }

    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: var(--color-crimson);
        color: var(--color-text-primary);
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 0.75rem;
        font-weight: 600;
        display: none;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    notificationSystem.loadNotifications();
    notificationSystem.updateBadge();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = notificationSystem;
}
