// Import the talent configuration
import { TALENT_DEFINITIONS, DEFAULT_TALENT_POINTS } from './snaps-talentconfig.js';

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
let snapsRef;

// Initialize the game
function initGame() {
    if (!firebase) {
        console.error('Firebase is not initialized. Please check your Firebase setup.');
        return;
    }
    
    try {
        db = firebase.database();
        snapsRef = db.ref('characters/snaps');
        
        loadGameState();
        updateUI();
        setupEventListeners();
        initParticleEffect();
        
        // Set up real-time sync for snaps character data
        snapsRef.on('value', (snapshot) => {
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
        
        // Right-click to remove a point
        node.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const talentId = node.getAttribute('data-id');
            removeTalentPoint(talentId);
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
        snapsRef.once('value').then((snapshot) => {
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
        
        snapsRef.update(stateToSave).catch((error) => {
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
                
                // Add a class for max-rank
                if (talent.currentRank >= talent.maxRank) {
                    node.classList.add('max-rank');
                } else {
                    node.classList.remove('max-rank');
                }
            } else {
                node.classList.remove('unlocked', 'max-rank');
                if (!canUnlockTalent(talentId)) {
                    node.classList.add('locked');
                } else {
                    node.classList.remove('locked');
                }
            }
        }
    });
}

// Check if a talent can be unlocked or upgraded
function canUnlockTalent(talentId) {
    const talent = talents[talentId];
    
    // Check if already at max rank
    if (talent.currentRank >= talent.maxRank) return false;
    
    // Check if we have enough points
    if (gameState.availablePoints < 1) return false;
    
    // If this is an upgrade (already have at least rank 1), no need to check requirements
    if (talent.currentRank > 0) return true;
    
    // Check requirements (only for initial unlock)
    for (const req of talent.requirements) {
        const reqTalent = talents[req.talent];
        if (!reqTalent || reqTalent.currentRank < req.minRank) {
            return false;
        }
    }
    
    return true;
}

// Handle talent clicks - modified to add ranks instead of toggling
function talentClick(talentId) {
    const talent = talents[talentId];
    
    // If already unlocked and not at max rank, add another point
    if (talent.currentRank > 0 && talent.currentRank < talent.maxRank && gameState.availablePoints > 0) {
        // Add another rank
        talent.currentRank++;
        gameState.spentPoints++;
        gameState.availablePoints--;
        
        // Add effect for unlocking talent
        addActivationEffect(talentId);
    } 
    // If not unlocked yet but can be unlocked
    else if (talent.currentRank === 0 && canUnlockTalent(talentId)) {
        // Add first rank
        talent.currentRank = 1;
        gameState.spentPoints++;
        gameState.availablePoints--;
        
        // Add effect for unlocking talent
        addActivationEffect(talentId);
    } 
    // If at max rank, user clicked to remove a point
    else if (talent.currentRank >= talent.maxRank) {
        removeTalentPoint(talentId);
        return;
    }
    else {
        if (talent.currentRank >= talent.maxRank) {
            alert('Talent already at maximum rank!');
        } else if (gameState.availablePoints < 1) {
            alert('Not enough talent points!');
        } else {
            alert('Cannot unlock this talent! Check requirements.');
        }
        return;
    }
    
    showTalentInfo(talentId);
    updateUI();
    saveGameState();
}

// Function to remove a talent point (on right click or when clicking max rank)
function removeTalentPoint(talentId) {
    const talent = talents[talentId];
    
    // Check if we can remove a point
    if (talent.currentRank <= 0) {
        return; // Nothing to remove
    }
    
    // Check if removing this point would break requirements for other talents
    if (!canRemoveTalentPoint(talentId)) {
        alert('Cannot remove this talent point as other talents depend on it!');
        return;
    }
    
    // Remove a point
    talent.currentRank--;
    gameState.spentPoints--;
    gameState.availablePoints++;
    
    showTalentInfo(talentId);
    updateUI();
    saveGameState();
}

// Check if removing a talent point would break dependencies
function canRemoveTalentPoint(talentId) {
    const talent = talents[talentId];
    
    // Simulate removing a point
    const newRank = talent.currentRank - 1;
    
    // Check if any other talents would have their requirements broken
    for (const id in talents) {
        const otherTalent = talents[id];
        
        // Skip talents that aren't unlocked
        if (otherTalent.currentRank === 0) continue;
        
        // Check if this talent is a requirement for the other talent
        for (const req of otherTalent.requirements) {
            if (req.talent === talentId && newRank < req.minRank) {
                return false; // This would break a requirement
            }
        }
    }
    
    return true;
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
            const style = isMet ? 'color: #90ee7e;' : 'color: #FF6B6B;';
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
            <div class="panel-icon">${talent.emoji}</div>
            <h3>${talent.name}</h3>
        </div>
        <div class="info-content">
            <p class="talent-description">${talent.description.replace(/\n/g, '<br>')}</p>
            <div class="info-divider"></div>
            <p><strong>Rank:</strong> ${talent.currentRank}/${talent.maxRank}</p>
            ${effectText}
            ${requirementText}
            <div class="info-divider"></div>
            <p class="usage-tip"><strong>Tip:</strong> Left-click to add points, right-click to remove.</p>
        </div>
    `;
}

// Add visual effect when activating a talent
function addActivationEffect(talentId) {
    const node = document.querySelector(`[data-id="${talentId}"]`);
    if (!node) return;
    
    // Add activation class for animation
    node.classList.add('talent-activated');
    
    // Create particles
    const type = node.classList.contains('magic') ? 'magic' : 
                node.classList.contains('physical') ? 'physical' : 'weapon';
    
    for (let i = 0; i < 10; i++) {
        createActivationParticle(node, type);
    }
    
    // Remove class after animation completes
    setTimeout(() => {
        node.classList.remove('talent-activated');
    }, 1000);
}

// Create particles for talent activation
function createActivationParticle(node, type) {
    const particle = document.createElement('div');
    particle.className = `activation-particle ${type}`;
    
    // Position particle at the center of the node
    const rect = node.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Set particle properties
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Random size
    const size = 5 + Math.random() * 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const duration = 500 + Math.random() * 1000;
    
    // Set animation
    particle.style.transition = `all ${duration}ms ease-out`;
    
    // Add to document
    document.body.appendChild(particle);
    
    // Trigger animation in next frame
    requestAnimationFrame(() => {
        particle.style.left = `${x + Math.cos(angle) * distance}px`;
        particle.style.top = `${y + Math.sin(angle) * distance}px`;
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0.1)';
    });
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration);
}

// Initialize axe particle effects
function initParticleEffect() {
    const container = document.querySelector('.soul-container');
    if (!container) return;
    
    // Create particles around the axe
    setInterval(() => {
        createAxeParticle(container);
    }, 300);
}

// Create floating axe particles
function createAxeParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'axe-particle';
    
    // Random position around the axe
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Random position within the axe
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // Set particle properties
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Random size
    const size = 3 + Math.random() * 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random animation duration
    const duration = 3000 + Math.random() * 2000;
    particle.style.animationDuration = `${duration}ms`;
    
    // Add to document
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, duration);
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
        initPanZoom();
    }, 500);
});

// Make functions global for HTML onclick handlers
window.talentClick = talentClick;
window.removeTalentPoint = removeTalentPoint;

// ===================================================
// PANZOOM IMPLEMENTATION FOR TALENT TREE NAVIGATION
// ===================================================

// Variables for panning functionality
let isPanning = false;
let startPoint = { x: 0, y: 0 };
let currentTranslate = { x: 0, y: 0 };
let startTranslate = { x: 0, y: 0 };
let scale = 1;
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.5;
const PAN_SPEED = 1;

function initPanZoom() {
    const container = document.querySelector('.talent-tree-container');
    
    // Create a wrapper for panning/zooming
    const wrapper = document.createElement('div');
    wrapper.className = 'talent-tree-panzoom';
    
    // Move all children except the SVG into the wrapper
    const svg = container.querySelector('.connection-lines');
    const childNodes = Array.from(container.childNodes);
    
    childNodes.forEach(child => {
        if (child !== svg) {
            wrapper.appendChild(child);
        }
    });
    
    // Add the wrapper back to the container (after the SVG)
    container.appendChild(wrapper);
    
    // Set up mouse events for panning
    wrapper.addEventListener('mousedown', startPan);
    document.addEventListener('mousemove', pan);
    document.addEventListener('mouseup', endPan);
    
    // Set up touch events for mobile
    wrapper.addEventListener('touchstart', startPanTouch);
    wrapper.addEventListener('touchmove', panTouch);
    wrapper.addEventListener('touchend', endPanTouch);
    
    // Add zoom with mouse wheel
    container.addEventListener('wheel', zoom);
    
    // Double tap to reset on mobile
    let lastTap = 0;
    wrapper.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            resetView();
            e.preventDefault();
        }
        lastTap = currentTime;
    });
    
    // Double click to reset on desktop
    wrapper.addEventListener('dblclick', resetView);
    
    // Add reset button to talent info panel
    const infoPanel = document.getElementById('talent-info');
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-view-button';
    resetButton.textContent = 'Reset View';
    resetButton.onclick = resetView;
    infoPanel.querySelector('.info-content').appendChild(resetButton);
    
    // Add pinch zoom for mobile
    if (window.Hammer) {
        const hammer = new Hammer.Manager(wrapper);
        const pinch = new Hammer.Pinch();
        hammer.add(pinch);
        
        let baseScale = scale;
        
        hammer.on('pinchstart', function() {
            baseScale = scale;
        });
        
        hammer.on('pinch', function(e) {
            handleZoom(e.center.x, e.center.y, baseScale * e.scale);
            applyTransform();
        });
    }
    
    // Fix connection lines
    fixConnectionLines();
}

function startPan(e) {
    isPanning = true;
    startPoint = { x: e.clientX, y: e.clientY };
    startTranslate = { ...currentTranslate };
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
}

function pan(e) {
    if (!isPanning) return;
    
    const dx = (e.clientX - startPoint.x) * PAN_SPEED / scale;
    const dy = (e.clientY - startPoint.y) * PAN_SPEED / scale;
    
    currentTranslate.x = startTranslate.x + dx;
    currentTranslate.y = startTranslate.y + dy;
    
    applyTransform();
    e.preventDefault();
}

function endPan() {
    isPanning = false;
    document.body.style.cursor = 'default';
}

function startPanTouch(e) {
    if (e.touches.length === 1) {
        isPanning = true;
        startPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        startTranslate = { ...currentTranslate };
        e.preventDefault();
    }
}

function panTouch(e) {
    if (!isPanning || e.touches.length !== 1) return;
    
    const dx = (e.touches[0].clientX - startPoint.x) * PAN_SPEED / scale;
    const dy = (e.touches[0].clientY - startPoint.y) * PAN_SPEED / scale;
    
    currentTranslate.x = startTranslate.x + dx;
    currentTranslate.y = startTranslate.y + dy;
    
    applyTransform();
    e.preventDefault();
}

function endPanTouch() {
    isPanning = false;
}

function zoom(e) {
    e.preventDefault();
    
    // Get mouse position
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Determine zoom direction
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    
    handleZoom(mouseX, mouseY, scale * zoomFactor);
}

function handleZoom(mouseX, mouseY, newScale) {
    // Constrain scale
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    
    // Calculate new position based on mouse position
    const factor = newScale / scale;
    const dx = mouseX - mouseX * factor;
    const dy = mouseY - mouseY * factor;
    
    scale = newScale;
    currentTranslate.x += dx / scale;
    currentTranslate.y += dy / scale;
    
    applyTransform();
}

function applyTransform() {
    const container = document.querySelector('.talent-tree-panzoom');
    container.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    
    // Update SVG connections to match the transform
    updateConnections();
}

function updateConnections() {
    const svg = document.querySelector('.connection-lines');
    svg.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
}

function resetView() {
    scale = 1;
    currentTranslate = { x: 0, y: 0 };
    applyTransform();
}

// Fix connection lines visibility issue
function fixConnectionLines() {
    const connectionLines = document.querySelectorAll('.connection-line');
    connectionLines.forEach(line => {
        line.setAttribute('fill', 'none');
        
        // Add explicit inline styling as a backup
        const type = line.classList.contains('magic') ? 'magic' : 
                    line.classList.contains('physical') ? 'physical' : 
                    line.classList.contains('weapon-req') ? 'weapon-req' : 'weapon';
        
        let strokeColor;
        switch(type) {
            case 'magic': strokeColor = '#a374db'; break;
            case 'physical': strokeColor = '#ff8c24'; break;
            case 'weapon': strokeColor = '#62d84b'; break;
            case 'weapon-req': strokeColor = '#ffd700'; break;
        }
        
        line.style.stroke = strokeColor;
        line.style.strokeWidth = '4px';
        line.style.fill = 'none';
        
        if (type === 'weapon-req') {
            line.style.strokeDasharray = '5, 5';
        }
    });
    
    // Ensure the connection lines are visible during pan-zoom
    document.addEventListener('mousemove', updateConnections);
    document.addEventListener('wheel', updateConnections);
}

// Add CSS for activation effect
function addActivationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .talent-activated {
            animation: pulseActivation 1s ease-out;
        }
        
        @keyframes pulseActivation {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.3); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        .activation-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            transform: translate(-50%, -50%);
        }
        
        .activation-particle.magic {
            background: radial-gradient(circle, rgba(163, 116, 219, 0.9), rgba(163, 116, 219, 0.3));
            box-shadow: 0 0 10px rgba(163, 116, 219, 0.7);
        }
        
        .activation-particle.physical {
            background: radial-gradient(circle, rgba(255, 140, 36, 0.9), rgba(255, 140, 36, 0.3));
            box-shadow: 0 0 10px rgba(255, 140, 36, 0.7);
        }
        
        .activation-particle.weapon {
            background: radial-gradient(circle, rgba(98, 216, 75, 0.9), rgba(98, 216, 75, 0.3));
            box-shadow: 0 0 10px rgba(98, 216, 75, 0.7);
        }
    `;
    document.head.appendChild(style);
}

// Call the CSS addition on load
document.addEventListener('DOMContentLoaded', addActivationCSS);

// Export for use in HTML
window.talents = talents;
window.gameState = gameState;