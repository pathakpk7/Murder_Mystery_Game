// Team Communications System
// Handles dynamic message unlocking from team members

const teamCommunications = {
    // Character avatars
    characters: {
        'Prasoon Pathak': { icon: 'fas fa-user-secret', color: '#d4af37' },
        'Gowrav Dubey': { icon: 'fas fa-laptop-code', color: '#3b82f6' },
        'Harsh Shukla': { icon: 'fas fa-user-shield', color: '#22c55e' },
        'Tammana Tiwari': { icon: 'fas fa-brain', color: '#ec4899' },
        'Amisha Singh': { icon: 'fas fa-newspaper', color: '#f59e0b' },
        'Professor Vedika Rao': { icon: 'fas fa-chalkboard-teacher', color: '#8b5cf6' },
        'ACP Rudransh Pathak': { icon: 'fas fa-shield-alt', color: '#ef4444' }
    },

    // Mock communications data (will come from API in production)
    communications: [
        {
            id: 1,
            sender: 'Prasoon Pathak',
            message: 'Welcome to the Investigation Division, recruit. Complete your training at Detective Academy to receive your first case assignment.',
            triggerType: 'case_start',
            triggerCaseId: 0,
            isUnlocked: true,
            isRead: false,
            timestamp: new Date().toISOString()
        },
        {
            id: 2,
            sender: 'Prasoon Pathak',
            message: 'Excellent work mastering the basics. SQL is your primary tool for investigation. Every query you write brings us closer to the truth.',
            triggerType: 'objective_complete',
            triggerCaseId: 0,
            isUnlocked: false,
            isRead: false,
            timestamp: new Date().toISOString()
        },
        {
            id: 3,
            sender: 'Gowrav Dubey',
            message: 'The evidence locker database is our first line of defense. Being able to query it efficiently is crucial for any investigator.',
            triggerType: 'objective_complete',
            triggerCaseId: 0,
            isUnlocked: false,
            isRead: false,
            timestamp: new Date().toISOString()
        },
        {
            id: 4,
            sender: 'Prasoon Pathak',
            message: 'You are learning quickly. Understanding data distribution helps us spot patterns that others miss.',
            triggerType: 'objective_complete',
            triggerCaseId: 0,
            isUnlocked: false,
            isRead: false,
            timestamp: new Date().toISOString()
        },
        {
            id: 5,
            sender: 'Prasoon Pathak',
            message: 'Training complete. You have demonstrated the SQL skills necessary to begin field investigations. Report to the Task Force Dossier for your first assignment.',
            triggerType: 'case_solved',
            triggerCaseId: 0,
            isUnlocked: false,
            isRead: false,
            timestamp: new Date().toISOString()
        }
    ],

    // Unlock communication based on trigger
    unlockCommunication(triggerType, triggerCaseId) {
        const communication = this.communications.find(
            comm => comm.triggerType === triggerType && 
                   comm.triggerCaseId === triggerCaseId && 
                   !comm.isUnlocked
        );

        if (communication) {
            communication.isUnlocked = true;
            communication.timestamp = new Date().toISOString();
            
            // Save to localStorage
            this.saveCommunications();
            
            // Show notification
            this.showNotification(communication);
            
            return communication;
        }

        return null;
    },

    // Get all unlocked communications
    getUnlockedCommunications() {
        return this.communications.filter(comm => comm.isUnlocked);
    },

    // Get unread communications
    getUnreadCommunications() {
        return this.communications.filter(comm => comm.isUnlocked && !comm.isRead);
    },

    // Mark communication as read
    markAsRead(communicationId) {
        const communication = this.communications.find(comm => comm.id === communicationId);
        if (communication) {
            communication.isRead = true;
            this.saveCommunications();
        }
    },

    // Mark all as read
    markAllAsRead() {
        this.communications.forEach(comm => {
            if (comm.isUnlocked) {
                comm.isRead = true;
            }
        });
        this.saveCommunications();
    },

    // Save communications to localStorage
    saveCommunications() {
        localStorage.setItem('team_communications', JSON.stringify(this.communications));
    },

    // Load communications from localStorage
    loadCommunications() {
        const saved = localStorage.getItem('team_communications');
        if (saved) {
            this.communications = JSON.parse(saved);
        }
    },

    // Show notification for new communication
    showNotification(communication) {
        const character = this.characters[communication.sender];
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'communication-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-bg-secondary);
            border: 1px solid var(--color-gold);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: var(--spacing-md);">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--color-crimson), var(--color-gold)); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="${character.icon}" style="color: var(--color-text-primary);"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-gold); margin-bottom: var(--spacing-xs);">${communication.sender}</div>
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5;">${communication.message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--color-text-muted); cursor: pointer; font-size: 1rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    },

    // Render communications panel
    renderCommunicationsPanel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const unlocked = this.getUnlockedCommunications();
        
        if (unlocked.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-xl); color: var(--color-text-muted);">
                    <i class="fas fa-comments" style="font-size: 2rem; margin-bottom: var(--spacing-md);"></i>
                    <p>No communications yet. Complete objectives to receive messages from the team.</p>
                </div>
            `;
            return;
        }

        let html = '';
        unlocked.forEach(comm => {
            const character = this.characters[comm.sender];
            const timeAgo = this.getTimeAgo(new Date(comm.timestamp));
            
            html += `
                <div class="message-item ${!comm.isRead ? 'unread' : ''}" data-id="${comm.id}">
                    <div class="message-avatar" style="background: linear-gradient(135deg, var(--color-crimson), var(--color-gold));">
                        <i class="${character.icon}"></i>
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-sender">${comm.sender}</span>
                            <span class="message-time">${timeAgo}</span>
                        </div>
                        <div class="message-text">${comm.message}</div>
                    </div>
                    ${!comm.isRead ? '<div class="unread-indicator"></div>' : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Add click handlers
        container.querySelectorAll('.message-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
                item.classList.remove('unread');
                const indicator = item.querySelector('.unread-indicator');
                if (indicator) indicator.remove();
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
        return this.getUnreadCommunications().length;
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

    .message-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--color-dark-gray);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }

    .message-item:hover {
        border-color: var(--color-gold);
    }

    .message-item.unread {
        border-left: 3px solid var(--color-crimson);
    }

    .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .message-content {
        flex: 1;
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--spacing-xs);
    }

    .message-sender {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-gold);
    }

    .message-time {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .message-text {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
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
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    teamCommunications.loadCommunications();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = teamCommunications;
}
