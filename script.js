// Import configuration
import { TALENT_DEFINITIONS, DEFAULT_TALENT_POINTS } from './talentconfig.js';

// Convert config to runtime format
const talents = {};
Object.keys(TALENT_DEFINITIONS).forEach(id => {
    const config = TALENT_DEFINITIONS[id];
    talents[id] = {
        name: config.name,
        description: config.description,
        maxRank: config.maxRank,
        currentRank: 0,
        tier: config.tier,
        type: config.type,
        requirements: config.requirements,
        effects: config.effects
    };
});

// Game State
let gameState = {
    availablePoints: DEFAULT_TALENT_POINTS,
    spentPoints: 0,
    talents: {}
};

// Global Points Management
class GlobalPointsManager {
    constructor() {
        this.GLOBAL_POINTS_KEY = 'global-talent-points';
        this.initializeGlobalPoints();
    }

    initializeGlobalPoints() {
        const savedPoints = localStorage.getItem(this.GLOBAL_POINTS_KEY);
        if (savedPoints === null) {
            localStorage.setItem(this.GLOBAL_POINTS_KEY, DEFAULT_TALENT_POINTS.toString());
        }
    }

    getGlobalPoints() {
        return parseInt(localStorage.getItem(this.GLOBAL_POINTS_KEY)) || DEFAULT_TALENT_POINTS;
    }

    setGlobalPoints(points) {
        localStorage.setItem(this.GLOBAL_POINTS_KEY, points.toString());
        // Dispatch event to notify other tabs/windows
        window.dispatchEvent(new CustomEvent('globalPointsChanged', { 
            detail: { points: points } 
        }));
    }

    spendPoint() {
        const currentPoints = this.getGlobalPoints();
        if (currentPoints > 0) {
            this.setGlobalPoints(currentPoints - 1);
            return true;
        }
        return false;
    }

    refundPoint() {
        const currentPoints = this.getGlobalPoints();
        this.setGlobalPoints(currentPoints + 1);
    }
}

const globalPointsManager = new GlobalPointsManager();

// Initialize the game
function initGame() {
    loadGameState();
    updateUI();
    setupEventListeners();
    // Listen for global points changes from other tabs
    window.addEventListener('globalPointsChanged', (event) => {
        gameState.availablePoints = event.detail.points;
        updateUI();
    });
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'global-talent-points') {
            gameState.availablePoints = parseInt(event.newValue);
            updateUI();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Hover effects for talent info
    document.querySelectorAll('.talent-node').forEach(node => {
        node.addEventListener('mouseenter', () => {
            const talentId = node.getAttribute('data-id');
            showTalentInfo(talentId);
        });
    });

    // Update node icons from config
    updateNodeIcons();
}

// Update node icons from config
function updateNodeIcons() {
    Object.keys(TALENT_DEFINITIONS).forEach(talentId => {
        const config = TALENT_DEFINITIONS[talentId];
        const node = document.querySelector(`[data-id="${talentId}"] .talent-icon`);
        if (node) {
            node.textContent = config.emoji;
        }
    });
}

// Load game state from localStorage
function loadGameState() {
    try {
        // Get global points
        gameState.availablePoints = globalPointsManager.getGlobalPoints();
        
        // Load individual talent states
        const savedState = localStorage.getItem('blackjack-talent-tree');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            gameState.spentPoints = parsed.spentPoints || 0;
            
            // Apply loaded talents
            Object.keys(parsed.talents || {}).forEach(talentId => {
                if (talents[talentId]) {
                    talents[talentId].currentRank = parsed.talents[talentId] || 0;
                }
            });
        }
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

// Save game state to localStorage
function saveGameState() {
    try {
        const stateToSave = {
            spentPoints: gameState.spentPoints,
            talents: {}
        };
        
        // Save current talent ranks
        Object.keys(talents).forEach(talentId => {
            if (talents[talentId].currentRank > 0) {
                stateToSave.talents[talentId] = talents[talentId].currentRank;
            }
        });
        
        localStorage.setItem('blackjack-talent-tree', JSON.stringify(stateToSave));
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

// Update UI elements
function updateUI() {
    document.getElementById('available-points').textContent = gameState.availablePoints;
    document.getElementById('spent-points').textContent = gameState.spentPoints;
    
    // Update talent nodes
    Object.keys(talents).forEach(talentId => {
        const talent = talents[talentId];
        const node = document.querySelector(`[data-id="${talentId}"]`);
        const pointsDisplay = document.getElementById(`points-${talentId}`);
        
        if (node && pointsDisplay) {
            // Update points display
            pointsDisplay.textContent = `[${talent.currentRank}/${talent.maxRank}]`;
            
            // Update node appearance
            if (talent.currentRank > 0) {
                node.classList.add('unlocked');
                node.classList.remove('locked');
            } else {
                node.classList.remove('unlocked');
                if (!canUnlockTalent(talentId)) {
                    node.classList.add('locked');
                } else {
                    node.classList.remove('locked');
                }
            }
        }
    });
}

// Check if a talent can be unlocked
function canUnlockTalent(talentId) {
    const talent = talents[talentId];
    
    // Check if already at max rank
    if (talent.currentRank >= talent.maxRank) return false;
    
    // Check if we have enough points
    if (gameState.availablePoints < 1) return false;
    
    // Check requirements
    for (const req of talent.requirements) {
        const reqTalent = talents[req.talent];
        if (!reqTalent || reqTalent.currentRank < req.minRank) {
            return false;
        }
    }
    
    return true;
}

// Handle talent clicks
function talentClick(talentId) {
    const talent = talents[talentId];
    
    if (talent.currentRank > 0 && gameState.availablePoints < 10) {
        // Remove a point
        talent.currentRank--;
        gameState.spentPoints--;
        globalPointsManager.refundPoint();
        gameState.availablePoints = globalPointsManager.getGlobalPoints();
    } else if (canUnlockTalent(talentId)) {
        // Add a point
        if (globalPointsManager.spendPoint()) {
            talent.currentRank++;
            gameState.spentPoints++;
            gameState.availablePoints = globalPointsManager.getGlobalPoints();
        } else {
            alert('Not enough talent points!');
            return;
        }
    }
    
    showTalentInfo(talentId);
    updateUI();
    saveGameState();
}

// Show talent information
function showTalentInfo(talentId) {
    const talent = talents[talentId];
    const infoPanel = document.getElementById('talent-info');
    
    let requirementText = '';
    if (talent.requirements.length > 0) {
        requirementText = '<div class="info-divider"></div><p><strong>Requirements:</strong></p>';
        talent.requirements.forEach(req => {
            const reqTalent = talents[req.talent];
            const isMet = reqTalent.currentRank >= req.minRank;
            const style = isMet ? 'color: #4CAF50;' : 'color: #FF6B6B;';
            const checkMark = isMet ? '✓' : '✗';
            requirementText += `<p style="${style}">• ${checkMark} ${reqTalent.name} Rank ${req.minRank}</p>`;
        });
    }
    
    let effectText = '';
    if (talent.currentRank > 0) {
        effectText += `<p><strong>Current Effect:</strong></p>`;
        effectText += `<p class="current-effect">• ${talent.effects[talent.currentRank - 1]}</p>`;
    }
    
    if (talent.currentRank < talent.maxRank) {
        effectText += `<p><strong>Next Rank Effect:</strong></p>`;
        effectText += `<p class="next-effect">• ${talent.effects[talent.currentRank]}</p>`;
    }
    
    infoPanel.innerHTML = `
        <div class="panel-header">
            <div class="panel-icon">📜</div>
            <h3>${talent.name}</h3>
        </div>
        <div class="info-content">
            <p class="talent-description">${talent.description.replace(/\n/g, '<br>')}</p>
            <div class="info-divider"></div>
            <p><strong>Rank:</strong> ${talent.currentRank}/${talent.maxRank}</p>
            ${effectText}
            ${requirementText}
        </div>
    `;
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key to go back to index
    if (e.key === 'Escape') {
        window.location.href = 'index.html';
    }
});

// Make functions global for HTML onclick handlers
window.talentClick = talentClick;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Auto-save every 5 seconds
setInterval(saveGameState, 5000);