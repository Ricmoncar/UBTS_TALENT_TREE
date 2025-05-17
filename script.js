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

// Firebase references
let db;
let blackjackRef;

// Initialize the game
function initGame() {
    if (!firebase) {
        console.error('Firebase is not initialized. Please check your Firebase setup.');
        return;
    }
    
    try {
        db = firebase.database();
        blackjackRef = db.ref('characters/blackjack');
        
        loadGameState();
        updateUI();
        setupEventListeners();
        
        // Set up real-time sync for blackjack character data
        blackjackRef.on('value', (snapshot) => {
            const data = snapshot.val() || { points: DEFAULT_TALENT_POINTS, talents: {}, spentPoints: 0 };
            
            // Update local game state
            gameState.availablePoints = data.points || DEFAULT_TALENT_POINTS;
            gameState.spentPoints = data.spentPoints || 0;
            
            // Update talent ranks
            Object.keys(talents).forEach(talentId => {
                talents[talentId].currentRank = data.talents && data.talents[talentId] ? 
                    data.talents[talentId] : 0;
            });
            
            updateUI();
        });
    } catch (error) {
        console.error('Error initializing game:', error);
    }
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

// Load game state from Firebase
function loadGameState() {
    try {
        blackjackRef.once('value').then((snapshot) => {
            const data = snapshot.val() || { points: DEFAULT_TALENT_POINTS, talents: {}, spentPoints: 0 };
            
            // Update local game state
            gameState.availablePoints = data.points || DEFAULT_TALENT_POINTS;
            gameState.spentPoints = data.spentPoints || 0;
            
            // Update talent ranks
            Object.keys(talents).forEach(talentId => {
                talents[talentId].currentRank = data.talents && data.talents[talentId] ? 
                    data.talents[talentId] : 0;
            });
            
            updateUI();
        }).catch((error) => {
            console.error('Error loading game state:', error);
        });
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

// Save game state to Firebase
function saveGameState() {
    try {
        const stateToSave = {
            points: gameState.availablePoints,
            spentPoints: gameState.spentPoints,
            talents: {}
        };
        
        // Save current talent ranks
        Object.keys(talents).forEach(talentId => {
            if (talents[talentId].currentRank > 0) {
                stateToSave.talents[talentId] = talents[talentId].currentRank;
            }
        });
        
        blackjackRef.update(stateToSave).catch((error) => {
            console.error('Error saving game state:', error);
        });
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
    
    if (talent.currentRank > 0) {
        // Remove a point
        talent.currentRank--;
        gameState.spentPoints--;
        gameState.availablePoints++;
    } else if (canUnlockTalent(talentId)) {
        // Add a point
        talent.currentRank++;
        gameState.spentPoints++;
        gameState.availablePoints--;
    } else {
        alert('Cannot unlock this talent!');
        return;
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a short time to make sure Firebase is fully initialized
    setTimeout(() => {
        initGame();
    }, 500);
});

// Make functions global for HTML onclick handlers
window.talentClick = talentClick;