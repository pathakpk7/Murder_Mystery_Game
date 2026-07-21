// Progression System
// Handles XP, stars, and rank progression

const progressionSystem = {
    // XP values
    xpValues: {
        objectiveComplete: 50,
        optionalObjective: 100,
        caseComplete: 500
    },

    // Star thresholds (based on performance)
    starThresholds: {
        excellent: 3,  // All objectives + optional objectives
        good: 2,       // All objectives
        basic: 1       // Minimum objectives
    },

    // Rank requirements
    rankRequirements: [
        { rank: 'Investigation Intern', minCases: 0, minXP: 0, minLevel: 1 },
        { rank: 'Junior Analyst', minCases: 2, minXP: 1000, minLevel: 2 },
        { rank: 'Investigation Officer', minCases: 5, minXP: 3000, minLevel: 3 },
        { rank: 'Crime Analyst', minCases: 8, minXP: 6000, minLevel: 4 },
        { rank: 'Senior Investigator', minCases: 11, minXP: 10000, minLevel: 5 },
        { rank: 'Lead Investigator', minCases: 14, minXP: 15000, minLevel: 6 },
        { rank: 'Special Operations Lead', minCases: 17, minXP: 20000, minLevel: 7 },
        { rank: 'Vritra Task Force Commander', minCases: 18, minXP: 25000, minLevel: 8 }
    ],

    // Level XP requirements
    levelXP: [0, 1000, 2500, 5000, 8500, 13000, 18000, 23500, 30000],

    // Current player stats
    currentStats: {
        xp: 0,
        level: 1,
        totalStars: 0,
        casesCompleted: 0,
        rank: 'Investigation Intern'
    },

    // Load player stats
    loadStats() {
        this.currentStats.xp = parseInt(localStorage.getItem('xp')) || 0;
        this.currentStats.level = parseInt(localStorage.getItem('level')) || 1;
        this.currentStats.totalStars = parseInt(localStorage.getItem('total_stars')) || 0;
        this.currentStats.casesCompleted = parseInt(localStorage.getItem('cases_completed')) || 0;
        this.currentStats.rank = localStorage.getItem('rank') || 'Investigation Intern';
    },

    // Save player stats
    saveStats() {
        localStorage.setItem('xp', this.currentStats.xp.toString());
        localStorage.setItem('level', this.currentStats.level.toString());
        localStorage.setItem('total_stars', this.currentStats.totalStars.toString());
        localStorage.setItem('cases_completed', this.currentStats.casesCompleted.toString());
        localStorage.setItem('rank', this.currentStats.rank);
    },

    // Add XP
    addXP(amount) {
        this.currentStats.xp += amount;
        this.checkLevelUp();
        this.checkRankUp();
        this.saveStats();
        return this.currentStats.xp;
    },

    // Check for level up
    checkLevelUp() {
        const currentLevelXP = this.levelXP[this.currentStats.level];
        const nextLevelXP = this.levelXP[this.currentStats.level + 1];

        if (nextLevelXP && this.currentStats.xp >= nextLevelXP) {
            this.currentStats.level++;
            notificationSystem.notifyRankUp(`Level ${this.currentStats.level}`);
            return true;
        }
        return false;
    },

    // Check for rank up
    checkRankUp() {
        for (let i = this.rankRequirements.length - 1; i >= 0; i--) {
            const req = this.rankRequirements[i];
            if (this.currentStats.casesCompleted >= req.minCases &&
                this.currentStats.xp >= req.minXP &&
                this.currentStats.level >= req.minLevel &&
                this.currentStats.rank !== req.rank) {
                this.currentStats.rank = req.rank;
                notificationSystem.notifyPromotion(req.rank);
                return true;
            }
        }
        return false;
    },

    // Calculate stars for a case
    calculateStars(totalObjectives, completedObjectives, totalOptional, completedOptional) {
        const requiredRatio = completedObjectives / totalObjectives;
        
        if (requiredRatio >= 1 && completedOptional === totalOptional) {
            return 3; // Excellent
        } else if (requiredRatio >= 1) {
            return 2; // Good
        } else if (requiredRatio >= 0.5) {
            return 1; // Basic
        }
        return 0; // Failed
    },

    // Award stars for completing a case
    awardCaseStars(caseId, stars) {
        // Store case stars
        const caseStarsKey = `case_stars_${caseId}`;
        const existingStars = parseInt(localStorage.getItem(caseStarsKey)) || 0;
        
        // Only update if new stars are higher
        if (stars > existingStars) {
            localStorage.setItem(caseStarsKey, stars.toString());
            
            // Update total stars (difference)
            const starDifference = stars - existingStars;
            this.currentStats.totalStars += starDifference;
            this.saveStats();
            
            if (stars === 3) {
                notificationSystem.notifyAchievement(`Perfect Investigation - Case ${caseId}`);
            }
        }
        
        return stars;
    },

    // Complete objective
    completeObjective(isOptional = false) {
        const xpGain = isOptional ? this.xpValues.optionalObjective : this.xpValues.objectiveComplete;
        this.addXP(xpGain);
        return xpGain;
    },

    // Complete case
    completeCase(caseId, totalObjectives, completedObjectives, totalOptional, completedOptional) {
        // Calculate stars
        const stars = this.calculateStars(totalObjectives, completedObjectives, totalOptional, completedOptional);
        
        // Award stars
        this.awardCaseStars(caseId, stars);
        
        // Add case completion XP
        this.addXP(this.xpValues.caseComplete);
        
        // Increment cases completed
        this.currentStats.casesCompleted++;
        
        // Check for rank up
        this.checkRankUp();
        
        // Save stats
        this.saveStats();
        
        // Notify
        notificationSystem.notifyCaseUnlocked(caseId, `Case ${caseId + 1}`);
        
        return {
            stars,
            xp: this.currentStats.xp,
            level: this.currentStats.level,
            rank: this.currentStats.rank
        };
    },

    // Get current rank info
    getCurrentRank() {
        return this.currentStats.rank;
    },

    // Get next rank
    getNextRank() {
        const currentIndex = this.rankRequirements.findIndex(r => r.rank === this.currentStats.rank);
        if (currentIndex < this.rankRequirements.length - 1) {
            return this.rankRequirements[currentIndex + 1];
        }
        return null;
    },

    // Get progress to next rank
    getRankProgress() {
        const nextRank = this.getNextRank();
        if (!nextRank) return 100;
        
        const currentReq = this.rankRequirements.find(r => r.rank === this.currentStats.rank);
        
        // Calculate progress based on cases completed
        const caseProgress = Math.min(100, (this.currentStats.casesCompleted / nextRank.minCases) * 100);
        
        return Math.round(caseProgress);
    },

    // Get progress to next level
    getLevelProgress() {
        const currentLevelXP = this.levelXP[this.currentStats.level];
        const nextLevelXP = this.levelXP[this.currentStats.level + 1];
        
        if (!nextLevelXP) return 100;
        
        const progress = ((this.currentStats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        return Math.min(100, Math.max(0, progress));
    },

    // Get case stars
    getCaseStars(caseId) {
        return parseInt(localStorage.getItem(`case_stars_${caseId}`)) || 0;
    },

    // Get total stars across all cases
    getTotalStars() {
        return this.currentStats.totalStars;
    },

    // Reset progression (for testing)
    resetProgression() {
        this.currentStats = {
            xp: 0,
            level: 1,
            totalStars: 0,
            casesCompleted: 0,
            rank: 'Investigation Intern'
        };
        this.saveStats();
        
        // Clear case stars
        for (let i = 0; i <= 18; i++) {
            localStorage.removeItem(`case_stars_${i}`);
        }
    },

    // Render progression display
    renderProgression(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const levelProgress = this.getLevelProgress();
        const rankProgress = this.getRankProgress();
        const nextRank = this.getNextRank();

        container.innerHTML = `
            <div class="progression-display">
                <div class="progression-item">
                    <div class="progression-label">
                        <span>Level ${this.currentStats.level}</span>
                        <span>${this.currentStats.xp} XP</span>
                    </div>
                    <div class="progression-bar">
                        <div class="progression-fill" style="width: ${levelProgress}%"></div>
                    </div>
                </div>
                
                <div class="progression-item">
                    <div class="progression-label">
                        <span>${this.currentStats.rank}</span>
                        <span>${rankProgress}% to ${nextRank ? nextRank.rank : 'Max Rank'}</span>
                    </div>
                    <div class="progression-bar">
                        <div class="progression-fill" style="width: ${rankProgress}%"></div>
                    </div>
                </div>
                
                <div class="progression-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${this.currentStats.totalStars} Stars</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span>${this.currentStats.casesCompleted} Cases</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .progression-display {
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
    }

    .progression-item {
        margin-bottom: var(--spacing-md);
    }

    .progression-label {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-xs);
    }

    .progression-bar {
        height: 4px;
        background: var(--color-slate);
        border-radius: 2px;
        overflow: hidden;
    }

    .progression-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--color-crimson), var(--color-gold));
        transition: width 0.3s ease;
    }

    .progression-stats {
        display: flex;
        gap: var(--spacing-lg);
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-border);
    }

    .progression-stats .stat {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }

    .progression-stats .stat i {
        color: var(--color-gold);
    }
`;
document.head.appendChild(style);

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    progressionSystem.loadStats();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = progressionSystem;
}
