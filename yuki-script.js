// Import the talent configuration
import { TALENT_DEFINITIONS, DEFAULT_TALENT_POINTS } from './yuki-talentconfig.js';
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
effects: config.effects,
emoji: config.emoji
};
});
// Game State
let gameState = {
availablePoints: DEFAULT_TALENT_POINTS,
spentPoints: 0,
talents: {} // This will store currentRanks of spent talents, mirroring Firebase structure
};
// Firebase references
let db;
let yukiRef;
// Initialize the game
function initGame() {
if (!firebase) {
console.error('Firebase is not initialized. Please check your Firebase setup.');
return;
}
try {
    db = firebase.database();
    yukiRef = db.ref('characters/yuki');

    // Load game state first, then update UI, then setup listeners
    loadGameState().then(() => {
        updateUI();
        setupEventListeners();
        initSnowParticleSystem();

        // Set up real-time sync for Yuki character data
        yukiRef.on('value', (snapshot) => {
            const data = snapshot.val() || { points: DEFAULT_TALENT_POINTS, talents: {}, spentPoints: 0 };

            // Update local game state
            gameState.availablePoints = data.points !== undefined ? data.points : DEFAULT_TALENT_POINTS;
            gameState.spentPoints = data.spentPoints || 0;

            // Update talent ranks based on Firebase data
            Object.keys(talents).forEach(talentId => {
                talents[talentId].currentRank = data.talents && data.talents[talentId] ?
                    data.talents[talentId] : 0;
            });

            updateUI(); // Re-render UI with new data
        });
    }).catch(error => {
        console.error('Error during initial game load or Firebase sync setup:', error);
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
        // Add hover effects based on talent type
        if (node.classList.contains('ice')) {
            createSnowParticle(node);
        } else if (node.classList.contains('speed')) {
            createSpeedTrail(node);
        } else if (node.classList.contains('mercy')) {
            createMercyGlow(node);
        } else if (node.classList.contains('ultimate')) {
            createSpiritAura(node);
        }
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
    return new Promise((resolve, reject) => {
        if (!yukiRef) {
            console.error('yukiRef not initialized in loadGameState');
            return reject(new Error('yukiRef not initialized'));
        }
        try {
            yukiRef.once('value').then((snapshot) => {
                const data = snapshot.val() || { points: DEFAULT_TALENT_POINTS, talents: {}, spentPoints: 0 };
                // Update local game state
                gameState.availablePoints = data.points !== undefined ? data.points : DEFAULT_TALENT_POINTS;
                gameState.spentPoints = data.spentPoints || 0;

                // Update talent ranks
                Object.keys(talents).forEach(talentId => {
                    talents[talentId].currentRank = data.talents && data.talents[talentId] ?
                        data.talents[talentId] : 0;
                });
                // No updateUI() here, will be called after promise resolves in initGame
                resolve();
            }).catch((error) => {
                console.error('Error loading game state from Firebase:', error);
                // Fallback to default state if loading fails
                gameState.availablePoints = DEFAULT_TALENT_POINTS;
                gameState.spentPoints = 0;
                Object.keys(talents).forEach(talentId => {
                    talents[talentId].currentRank = 0;
                });
                reject(error);
            });
        } catch (error) {
            console.error('Error setting up Firebase listener for game state:', error);
            // Fallback to default state
            gameState.availablePoints = DEFAULT_TALENT_POINTS;
            gameState.spentPoints = 0;
            Object.keys(talents).forEach(talentId => {
                talents[talentId].currentRank = 0;
            });
            reject(error);
        }
    });
}
// Save game state to Firebase
function saveGameState() {
if (!yukiRef) {
    console.error('yukiRef not initialized in saveGameState');
    return;
}
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

    yukiRef.update(stateToSave).catch((error) => {
        console.error('Error saving game state to Firebase:', error);
    });
} catch (error) {
    console.error('Error preparing game state for saving:', error);
}
}
// Update UI elements
function updateUI() {
    const availablePointsEl = document.getElementById('available-points');
    const spentPointsEl = document.getElementById('spent-points');
    if (availablePointsEl) {
        availablePointsEl.textContent = gameState.availablePoints;
    }
    if (spentPointsEl) {
        spentPointsEl.textContent = gameState.spentPoints;
    }

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
            if (!canUnlockTalent(talentId)) { // Check if requirements are met for non-invested talents
                node.classList.add('locked');
            } else {
                node.classList.remove('locked');
            }
        }
    }
});

// Update connection lines
updateConnectionLines();
}
// Check if a talent can be unlocked or upgraded
function canUnlockTalent(talentId) {
const talent = talents[talentId];
if (!talent) return false; // Talent does not exist

// Check if already at max rank
if (talent.currentRank >= talent.maxRank) return false;

// Check if we have enough points
if (gameState.availablePoints < 1) return false;

// If this is an upgrade (already have at least rank 1), no need to check requirements again
if (talent.currentRank > 0) return true;

// Check requirements (only for initial unlock - rank 0 to 1)
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
if (!talent) return;

// If already unlocked and not at max rank, add another point
if (talent.currentRank > 0 && talent.currentRank < talent.maxRank && gameState.availablePoints > 0) {
    // Add another rank
    talent.currentRank++;
    gameState.spentPoints++;
    gameState.availablePoints--;

    playActivationEffect(talentId);
}
// If not unlocked yet but can be unlocked
else if (talent.currentRank === 0 && canUnlockTalent(talentId)) {
    // Add first rank
    talent.currentRank = 1;
    gameState.spentPoints++;
    gameState.availablePoints--;

    playActivationEffect(talentId);
}
// If at max rank, user clicked to remove a point (this behavior might be removed if right-click is sole removal method)
else if (talent.currentRank >= talent.maxRank) {
    // removeTalentPoint(talentId); // Original behavior, consider if still desired on left-click at max
    // return;
    alert('Talent already at maximum rank! Right-click to remove points.');
    return; // Prevent further execution for this case
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

showTalentInfo(talentId); // Update info panel immediately
updateUI();
saveGameState();
}
// Function to remove a talent point (on right click or when clicking max rank)
function removeTalentPoint(talentId) {
const talent = talents[talentId];
if (!talent) return;

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

playDeactivationEffect(talentId);

showTalentInfo(talentId); // Update info panel immediately
updateUI();
saveGameState();
}
// Check if removing a talent point would break dependencies
function canRemoveTalentPoint(talentId) {
const talentToRemove = talents[talentId];
if (!talentToRemove || talentToRemove.currentRank <= 0) return true; // Nothing to remove or already 0

const newRank = talentToRemove.currentRank - 1;

// Check if any other *invested* talents would have their requirements broken
for (const otherTalentId in talents) {
    const otherTalent = talents[otherTalentId];

    // Skip talents that aren't unlocked or are the talent being modified
    if (otherTalent.currentRank === 0 || otherTalentId === talentId) continue;

    // Check if this talent (talentId) is a requirement for the otherTalent
    for (const req of otherTalent.requirements) {
        if (req.talent === talentId && newRank < req.minRank) {
            // Removing this point from talentId would make its rank (newRank)
            // fall below the minRank required by otherTalent.
            return false; // This would break a requirement
        }
    }
}
return true;
}
// Show talent information
function showTalentInfo(talentId) {
const talent = talents[talentId];
if (!talent) return;
const infoPanel = document.getElementById('talent-info');
if (!infoPanel) return;

let requirementText = '';
if (talent.requirements.length > 0) {
    requirementText = '<div class="info-divider"></div><p><strong>Requirements:</strong></p>';
    talent.requirements.forEach(req => {
        const reqTalent = talents[req.talent];
        if (!reqTalent) return; // Should not happen if config is correct
        const isMet = reqTalent.currentRank >= req.minRank;
        const style = isMet ? 'color: #a8d8ff;' : 'color: #FF6B6B;';
        const checkMark = isMet ? '✓' : '✗';
        requirementText += `<p style="${style}">• ${checkMark} ${reqTalent.name} Rank ${req.minRank}</p>`;
    });
}

let effectText = '';
if (talent.effects && talent.currentRank > 0 && talent.effects[talent.currentRank - 1]) {
    effectText += `<p><strong>Current Effect:</strong></p>`;
    effectText += `<p class="current-effect">• ${talent.effects[talent.currentRank - 1]}</p>`;
}

if (talent.effects && talent.currentRank < talent.maxRank && talent.effects[talent.currentRank]) {
    effectText += `<p><strong>Next Rank Effect:</strong></p>`;
    effectText += `<p class="next-effect">• ${talent.effects[talent.currentRank]}</p>`;
}

infoPanel.innerHTML = `
    <div class="panel-header">
        <div class="panel-icon">${talent.emoji || ''}</div>
        <h3>${talent.name}</h3>
    </div>
    <div class="info-content">
        <p class="talent-description">${talent.description ? talent.description.replace(/\n/g, '<br>') : ''}</p>
        <div class="info-divider"></div>
        <p><strong>Rank:</strong> ${talent.currentRank}/${talent.maxRank}</p>
        ${effectText}
        ${requirementText}
        <div class="info-divider"></div>
        <p class="usage-tip"><strong>Tip:</strong> Left-click to add points, right-click to remove.</p>
    </div>
`;
// Add reset button if not already there (or re-add if panel is fully overwritten)
const existingResetButton = infoPanel.querySelector('.reset-view-button');
if (!existingResetButton) {
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-view-button';
    resetButton.textContent = 'Reset View';
    resetButton.onclick = resetView;
    const infoContent = infoPanel.querySelector('.info-content');
    if (infoContent) {
        infoContent.appendChild(resetButton);
    }
}
}
// Update connection lines to show active/inactive status
function updateConnectionLines() {
    const svgConnections = document.querySelectorAll('.connection-line');
    svgConnections.forEach(conn => {
        conn.classList.remove('active');
        // Potentially add data attributes to lines in HTML: data-source="source_id" data-target="target_id"
        const sourceId = conn.dataset.source;
        const targetId = conn.dataset.target;

        if (sourceId && targetId && talents[sourceId] && talents[targetId]) {
            const sourceTalent = talents[sourceId];
            const targetTalent = talents[targetId];

            // Find the requirement object in targetTalent that refers to sourceTalent
            const requirement = targetTalent.requirements.find(req => req.talent === sourceId);

            if (requirement && sourceTalent.currentRank >= requirement.minRank && targetTalent.currentRank > 0) {
                conn.classList.add('active');
            }
        }
    });

    // Fallback for original simpler logic if data-source/target not available on lines:
    // This part is kept if the above more specific logic isn't feasible due to SVG structure.
    // However, the above is preferred. If your SVGs don't have data-source/target,
    // you might need to adapt the selector below or add those attributes to your SVG paths.
    if (!svgConnections.length || !svgConnections[0].dataset.source) { // Guessing if the new logic can't apply
        Object.keys(talents).forEach(talentId => { // This is the target talent
            const talent = talents[talentId];
            if (talent.currentRank > 0) {
                talent.requirements.forEach(req => { // req.talent is the source talent
                    const reqTalent = talents[req.talent];
                    if (reqTalent && reqTalent.currentRank >= req.minRank) {
                        // The original selector was very generic.
                        // This selector will attempt to activate lines based on the target talent's ID and type.
                        // This is less precise than data-source/data-target.
                        const selector = `.connection-line.${talent.type}[id*="to-${talentId}"], .connection-line.${talent.type}[class*="to-${talentId}"]`;
                        // Or even more generic like the original if IDs/classes are not set up that way:
                        // const selector = `.connection-line[d*="${talentId}"]`; // Using 'd' attribute is fragile
                        // For now, let's assume a naming convention for IDs/classes for lines exists, e.g., line-from-X-to-Y
                        const connections = document.querySelectorAll(`.connection-line[data-target="${talentId}"][data-source="${req.talent}"]`); // Ideal
                        connections.forEach(c => c.classList.add('active'));

                        // If the above ideal selector yields nothing, fall back to a more general one related to target talent
                        if (connections.length === 0) {
                            // Example: if line ID is like "line_reqName_talentName"
                            const lessSpecificSelector = document.querySelectorAll(`.connection-line[id*="${req.talent}"][id*="${talentId}"]`);
                            lessSpecificSelector.forEach(c => c.classList.add('active'));
                        }
                    }
                });
            }
        });
    }
}
// Visual Effects
// Snow particle system
function initSnowParticleSystem() {
setInterval(createSnowflake, 300);
}
function createSnowflake() {
const snowflake = document.createElement('div');
snowflake.className = 'snowflake';
const size = 1 + Math.random() * 3;
snowflake.style.width = `${size}px`;
snowflake.style.height = `${size}px`;
const xPos = Math.random() * 100;
snowflake.style.left = `${xPos}%`;
const fallSpeed = 5 + Math.random() * 5;
snowflake.style.animation = `snowfall ${fallSpeed}s linear forwards`;
const drift = (Math.random() - 0.5) * 100;
snowflake.style.transform = `translateX(${drift}px)`;
document.body.appendChild(snowflake);
setTimeout(() => {
    if (document.body.contains(snowflake)) {
        snowflake.remove();
    }
}, fallSpeed * 1000);
}
function createSnowParticle(node) {
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        const size = 2 + Math.random() * 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.position = 'fixed';
        snowflake.style.left = `${centerX + (Math.random() - 0.5) * 20}px`;
        snowflake.style.top = `${centerY + (Math.random() - 0.5) * 20}px`;
        const fallSpeed = 2 + Math.random() * 2;
        snowflake.style.animation = `snowfall ${fallSpeed}s linear forwards`;
        document.body.appendChild(snowflake);
        setTimeout(() => {
             if (document.body.contains(snowflake)) {
                snowflake.remove();
            }
        }, fallSpeed * 1000);
    }, i * 100);
}
}
function createSpeedTrail(node) {
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.width = '8px';
        trail.style.height = '8px';
        trail.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(216, 230, 255, 0.3))';
        trail.style.borderRadius = '50%';
        trail.style.filter = 'blur(2px)';
        trail.style.left = `${centerX + (Math.random() - 0.5) * 40}px`;
        trail.style.top = `${centerY + (Math.random() - 0.5) * 40}px`;
        trail.style.opacity = '0.8';
        trail.style.transition = 'all 0.6s ease-out';
        trail.style.zIndex = '1'; // Ensure particles are above other elements but below UI controls if needed
        trail.style.pointerEvents = 'none';
        document.body.appendChild(trail);
        setTimeout(() => {
            trail.style.transform = `scale(0.2) translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)`;
            trail.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            if (document.body.contains(trail)) {
                trail.remove();
            }
        }, 600);
    }, i * 200);
}
}
function createMercyGlow(node) {
const rect = node.getBoundingClientRect();
const aura = document.createElement('div');
aura.style.position = 'fixed';
aura.style.width = `${rect.width * 1.5}px`;
aura.style.height = `${rect.height * 1.5}px`;
aura.style.top = `${rect.top + rect.height/2 - rect.height*1.5/2}px`;
aura.style.left = `${rect.left + rect.width/2 - rect.width*1.5/2}px`;
aura.style.background = 'radial-gradient(circle, rgba(197, 183, 232, 0.4), rgba(197, 183, 232, 0) 70%)';
aura.style.borderRadius = '50%';
aura.style.zIndex = '1';
aura.style.pointerEvents = 'none';
aura.style.animation = 'mercyPulse 1.5s infinite alternate';
document.body.appendChild(aura);

const heartsToRemove = [];
for (let i = 0; i < 2; i++) {
    setTimeout(() => {
        const heart = document.createElement('div');
        heart.style.position = 'fixed';
        heart.style.top = `${rect.top + Math.random() * rect.height}px`;
        heart.style.left = `${rect.left + Math.random() * rect.width}px`;
        heart.style.fontSize = '12px';
        heart.style.color = 'rgba(197, 183, 232, 0.8)';
        heart.textContent = '💗';
        heart.style.transition = 'all 2s ease-out';
        heart.style.zIndex = '1';
        heart.style.pointerEvents = 'none';
        document.body.appendChild(heart);
        heartsToRemove.push(heart);
        setTimeout(() => {
            heart.style.transform = `translateY(-30px)`;
            heart.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            if (document.body.contains(heart)) {
                heart.remove();
            }
        }, 2000);
    }, i * 800);
}

const removeAuraAndHearts = () => {
    if (document.body.contains(aura)) {
        aura.remove();
    }
    heartsToRemove.forEach(h => {
        if (document.body.contains(h)) {
            h.remove();
        }
    });
    node.removeEventListener('mouseleave', removeAuraAndHearts);
};
node.addEventListener('mouseleave', removeAuraAndHearts, { once: true });
}

function createSpiritAura(node) {
    const rect = node.getBoundingClientRect();
    const spiritAura = document.createElement('div');
    spiritAura.style.position = 'fixed';
    spiritAura.style.width = `${rect.width * 2}px`;
    spiritAura.style.height = `${rect.height * 2}px`;
    spiritAura.style.top = `${rect.top + rect.height / 2 - rect.height}px`;
    spiritAura.style.left = `${rect.left + rect.width / 2 - rect.width}px`;
    spiritAura.style.background = 'radial-gradient(ellipse at center, rgba(168, 216, 255, 0.2), rgba(197, 183, 232, 0.2), rgba(168, 216, 255, 0) 70%)';
    spiritAura.style.borderRadius = '50%';
    spiritAura.style.zIndex = '1';
    spiritAura.style.pointerEvents = 'none';
    spiritAura.style.animation = 'foxSpiritAura 3s infinite alternate';
    document.body.appendChild(spiritAura);

    const tails = [];
    let keyframesCSS = "";

    for (let i = 0; i < 9; i++) {
        const tail = document.createElement('div');
        tail.style.position = 'fixed';
        tail.style.width = '2px'; // Thin tail base
        tail.style.height = '40px';
        tail.style.top = `${rect.top + rect.height / 2}px`; // Origin point
        tail.style.left = `${rect.left + rect.width / 2}px`;
        tail.style.background = 'linear-gradient(to bottom, rgba(168, 216, 255, 0.8), rgba(168, 216, 255, 0))';
        tail.style.borderRadius = '50%'; // Rounded tip
        tail.style.transformOrigin = 'top center';
        tail.style.transform = `rotate(${i * 40}deg)`; // Base rotation
        tail.style.zIndex = '1';
        tail.style.pointerEvents = 'none';

        const animationName = `tailWave-${i}`;
        tail.style.animation = `${animationName} 3s infinite ease-in-out ${i * 0.3}s`;
        tails.push(tail);
        document.body.appendChild(tail);

        keyframesCSS += `
            @keyframes ${animationName} {
                0%, 100% { transform: rotate(${i * 40}deg) scaleY(1); }
                50% { transform: rotate(${i * 40 + 10}deg) scaleY(1.2); }
            }
        `;
    }

    // Add all keyframes at once
    if (document.getElementById('tail-animations-style')) {
        document.getElementById('tail-animations-style').remove(); // Remove old one if exists
    }
    const styleElement = document.createElement('style');
    styleElement.id = 'tail-animations-style';
    styleElement.textContent = keyframesCSS;
    document.head.appendChild(styleElement);


    const particles = [];
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.top = `${rect.top + Math.random() * rect.height}px`;
            particle.style.left = `${rect.left + Math.random() * rect.width}px`;
            particle.style.background = 'radial-gradient(circle, rgba(168, 216, 255, 0.9), rgba(197, 183, 232, 0.4))';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = '0 0 5px rgba(168, 216, 255, 0.7)';
            particle.style.transition = 'all 2s ease-out';
            particle.style.zIndex = '1';
            particle.style.pointerEvents = 'none';
            document.body.appendChild(particle);
            particles.push(particle);
            setTimeout(() => {
                particle.style.transform = `translateY(-${20 + Math.random() * 40}px) scale(0.5)`;
                particle.style.opacity = '0';
            }, 10);
            setTimeout(() => {
                if(document.body.contains(particle)) particle.remove();
            }, 2000);
        }, i * 200);
    }

    const removeEffects = () => {
        if(document.body.contains(spiritAura)) spiritAura.remove();
        tails.forEach(t => { if(document.body.contains(t)) t.remove(); });
        particles.forEach(p => { if(document.body.contains(p)) p.remove(); });
        // Optionally remove the dynamically added style tag if it's specific to this hover
        // const styleTag = document.getElementById('tail-animations-style');
        // if (styleTag) styleTag.remove();
        node.removeEventListener('mouseleave', removeEffects);
    };
    node.addEventListener('mouseleave', removeEffects, { once: true });
}
// Play talent activation effect
function playActivationEffect(talentId) {
const node = document.querySelector(`[data-id="${talentId}"]`);
if (!node) return;
node.classList.add('point-spent-effect');
if (node.classList.contains('ice')) {
    playIceActivationEffect(node);
} else if (node.classList.contains('speed')) {
    playSpeedActivationEffect(node);
} else if (node.classList.contains('mercy')) {
    playMercyActivationEffect(node);
} else if (node.classList.contains('ultimate')) {
    playUltimateActivationEffect(node);
}
setTimeout(() => {
    node.classList.remove('point-spent-effect');
}, 500);
}
// Play talent deactivation effect
function playDeactivationEffect(talentId) {
const node = document.querySelector(`[data-id="${talentId}"]`);
if (!node) return;
node.classList.add('point-removed-effect');
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
const glow = document.createElement('div');
glow.style.position = 'fixed';
glow.style.width = `${rect.width * 1.5}px`;
glow.style.height = `${rect.height * 1.5}px`;
glow.style.top = `${centerY - rect.height * 0.75}px`;
glow.style.left = `${centerX - rect.width * 0.75}px`;
glow.style.borderRadius = '50%';
glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)';
glow.style.opacity = '0.8';
glow.style.transition = 'all 0.5s ease-out';
glow.style.zIndex = '1';
glow.style.pointerEvents = 'none';
document.body.appendChild(glow);
setTimeout(() => {
    glow.style.opacity = '0';
    glow.style.transform = 'scale(1.5)';
}, 10);
setTimeout(() => {
    if (document.body.contains(glow)) {
        glow.remove();
    }
}, 500);
setTimeout(() => {
    node.classList.remove('point-removed-effect');
}, 500);
}
function playIceActivationEffect(node) {
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
for (let i = 0; i < 15; i++) {
    setTimeout(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake'; // Assuming .snowflake is styled for appearance
        const size = 3 + Math.random() * 3;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.position = 'fixed';
        snowflake.style.left = `${centerX}px`;
        snowflake.style.top = `${centerY}px`;
        snowflake.style.opacity = '1';
        snowflake.style.transition = 'all 0.8s ease-out';
        snowflake.style.pointerEvents = 'none';
        document.body.appendChild(snowflake);
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 70;
            snowflake.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 360}deg)`;
            snowflake.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            if (document.body.contains(snowflake)) {
                snowflake.remove();
            }
        }, 800);
    }, i * 20);
}
const frost = document.createElement('div');
frost.style.position = 'fixed';
frost.style.width = `${rect.width}px`;
frost.style.height = `${rect.height}px`;
frost.style.top = `${rect.top}px`;
frost.style.left = `${rect.left}px`;
frost.style.borderRadius = '50%';
frost.style.border = '2px solid rgba(168, 216, 255, 0.7)';
frost.style.boxShadow = '0 0 15px rgba(168, 216, 255, 0.5)';
frost.style.transition = 'all 0.5s ease-out';
frost.style.zIndex = '1';
frost.style.pointerEvents = 'none';
document.body.appendChild(frost);
setTimeout(() => {
    frost.style.transform = 'scale(2)';
    frost.style.opacity = '0';
}, 10);
setTimeout(() => {
    if (document.body.contains(frost)) {
        frost.remove();
    }
}, 500);
}
function playSpeedActivationEffect(node) {
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
for (let i = 0; i < 12; i++) {
    const angle = i * (Math.PI * 2 / 12);
    const speedLine = document.createElement('div');
    speedLine.style.position = 'fixed';
    speedLine.style.width = '2px';
    speedLine.style.height = '15px';
    speedLine.style.backgroundColor = 'rgba(216, 230, 255, 0.8)';
    speedLine.style.top = `${centerY}px`;
    speedLine.style.left = `${centerX}px`;
    speedLine.style.transformOrigin = '0 0'; // Set origin for rotation and translation
    speedLine.style.transform = `rotate(${angle}rad) translate(10px, -1px)`; // Adjusted for centering height
    speedLine.style.opacity = '1';
    speedLine.style.transition = 'all 0.5s ease-out';
    speedLine.style.zIndex = '1';
    speedLine.style.pointerEvents = 'none';
    document.body.appendChild(speedLine);
    setTimeout(() => {
        speedLine.style.transform = `rotate(${angle}rad) translate(50px, -1px)`;
        speedLine.style.opacity = '0';
    }, 10);
    setTimeout(() => {
        if (document.body.contains(speedLine)) {
            speedLine.remove();
        }
    }, 500);
}
for (let i = 0; i < 5; i++) {
    setTimeout(() => {
        const paw = document.createElement('div');
        paw.style.position = 'fixed';
        paw.style.fontSize = '14px';
        paw.style.color = 'rgba(216, 230, 255, 0.8)';
        paw.textContent = '🐾';
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 40;
        paw.style.top = `${centerY + Math.sin(angle) * distance - 7}px`; // Adjust for font size
        paw.style.left = `${centerX + Math.cos(angle) * distance - 7}px`; // Adjust for font size
        paw.style.opacity = '0';
        paw.style.transform = 'scale(0.5)';
        paw.style.transition = 'all 0.5s ease-out';
        paw.style.zIndex = '1';
        paw.style.pointerEvents = 'none';
        document.body.appendChild(paw);
        setTimeout(() => {
            paw.style.opacity = '1';
            paw.style.transform = 'scale(1)';
        }, 10);
        setTimeout(() => {
            paw.style.opacity = '0';
        }, 400);
        setTimeout(() => {
            if (document.body.contains(paw)) {
                paw.remove();
            }
        }, 900);
    }, i * 100);
}
}
function playMercyActivationEffect(node) {
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
for (let i = 0; i < 8; i++) {
    setTimeout(() => {
        const heart = document.createElement('div');
        heart.style.position = 'fixed';
        heart.style.fontSize = '16px';
        heart.style.color = 'rgba(197, 183, 232, 0.9)';
        heart.textContent = '💗';
        heart.style.top = `${centerY}px`; // Center of node
        heart.style.left = `${centerX}px`; // Center of node
        heart.style.transform = 'translate(-50%, -50%)'; // Adjust for text centering
        heart.style.transition = 'all 1s ease-out';
        heart.style.zIndex = '1';
        heart.style.pointerEvents = 'none';
        document.body.appendChild(heart);
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 60;
            heart.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px))`;
            heart.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            if (document.body.contains(heart)) {
                heart.remove();
            }
        }, 1000);
    }, i * 50);
}
const aura = document.createElement('div');
aura.style.position = 'fixed';
aura.style.width = `${rect.width * 2}px`;
aura.style.height = `${rect.height * 2}px`;
aura.style.top = `${centerY - rect.height}px`; // Center aura on node
aura.style.left = `${centerX - rect.width}px`; // Center aura on node
aura.style.borderRadius = '50%';
aura.style.background = 'radial-gradient(circle, rgba(197, 183, 232, 0.5), rgba(197, 183, 232, 0) 70%)';
aura.style.opacity = '0';
aura.style.transition = 'all 0.8s ease-out';
aura.style.zIndex = '1';
aura.style.pointerEvents = 'none';
document.body.appendChild(aura);
setTimeout(() => {
    aura.style.opacity = '1';
    aura.style.transform = 'scale(1.2)';
}, 10);
setTimeout(() => {
    aura.style.opacity = '0';
    aura.style.transform = 'scale(2)';
}, 400);
setTimeout(() => {
    if (document.body.contains(aura)) {
        aura.remove();
    }
}, 1200);
}
function playUltimateActivationEffect(node) {
const rect = node.getBoundingClientRect();
const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;
const fox = document.createElement('div');
fox.style.position = 'fixed';
fox.style.fontSize = '60px';
fox.style.color = 'rgba(255, 255, 255, 0.9)';
fox.textContent = '🦊';
fox.style.top = `${centerY}px`;
fox.style.left = `${centerX}px`;
fox.style.transform = 'translate(-50%, -50%) scale(0.1)';
fox.style.transition = 'all 0.8s ease-out';
fox.style.zIndex = '100';
fox.style.pointerEvents = 'none';
fox.style.opacity = '0';
document.body.appendChild(fox);
setTimeout(() => {
    fox.style.transform = 'translate(-50%, -50%) scale(1)';
    fox.style.opacity = '1';
}, 10);
setTimeout(() => {
    fox.style.transform = 'translate(-50%, -50%) scale(2)';
    fox.style.opacity = '0';
}, 600);
setTimeout(() => {
    if (document.body.contains(fox)) {
        fox.remove();
    }
}, 1400);

const wave = document.createElement('div');
wave.style.position = 'fixed';
wave.style.width = `${rect.width}px`;
wave.style.height = `${rect.height}px`;
wave.style.top = `${rect.top}px`;
wave.style.left = `${rect.left}px`;
wave.style.borderRadius = '50%';
wave.style.boxShadow = '0 0 0 2px rgba(168, 216, 255, 0.8)'; // Initial state of shockwave
wave.style.opacity = '1'; // Start visible
wave.style.transition = 'all 1s ease-out';
wave.style.zIndex = '1';
wave.style.pointerEvents = 'none';
document.body.appendChild(wave);
setTimeout(() => {
    wave.style.transform = 'scale(20)';
    wave.style.opacity = '0';
    wave.style.boxShadow = '0 0 0 20px rgba(168, 216, 255, 0)'; // Expand shadow with scale
}, 10);
setTimeout(() => {
    if (document.body.contains(wave)) {
        wave.remove();
    }
}, 1000);

const colors = ['rgba(168, 216, 255, 0.8)', 'rgba(197, 183, 232, 0.8)', 'rgba(216, 230, 255, 0.8)'];
for (let i = 0; i < 40; i++) {
    setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.top = `${centerY}px`;
        particle.style.left = `${centerX}px`;
        particle.style.borderRadius = '50%';
        const pColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = pColor;
        particle.style.boxShadow = `0 0 8px ${pColor}`;
        particle.style.transition = 'all 1.5s ease-out';
        particle.style.zIndex = '2';
        particle.style.pointerEvents = 'none';
        document.body.appendChild(particle);
        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            particle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(${Math.random() * 0.5 + 0.5})`;
            particle.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            if (document.body.contains(particle)) {
                particle.remove();
            }
        }, 1500);
    }, i * 10);
}

for (let i = 0; i < 9; i++) {
    const angleRad = i * (Math.PI * 2 / 9); // Radians for Math functions
    const tail = document.createElement('div');
    tail.style.position = 'fixed';
    tail.style.width = '4px';
    tail.style.height = '40px'; // Initial height
    tail.style.top = `${centerY}px`;
    tail.style.left = `${centerX}px`;
    tail.style.background = 'linear-gradient(to bottom, rgba(168, 216, 255, 0.8), rgba(168, 216, 255, 0))';
    tail.style.borderRadius = '2px'; // Rounded tip
    tail.style.transformOrigin = 'top center'; // Rotate from the base (top)
    // Initial transform: rotate and translate outwards slightly so origin is at node center
    tail.style.transform = `rotate(${angleRad}rad) translateY(0px)`;
    tail.style.opacity = '0';
    tail.style.zIndex = '3';
    tail.style.pointerEvents = 'none';
    document.body.appendChild(tail);

    setTimeout(() => { // Start animation after a delay
        tail.style.opacity = '1';
        tail.style.height = '80px'; // Grow taller
        tail.style.transform = `rotate(${angleRad}rad) translateY(0px)`; // Maintain rotation, grow from origin
        tail.style.transition = 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'; // Smooth grow and fade
    }, 100 + i * 50);

    setTimeout(() => { // Fade out
        tail.style.opacity = '0';
        tail.style.height = '120px'; // Continue growing while fading
    }, 600 + i * 50);

    setTimeout(() => {
        if (document.body.contains(tail)) {
            tail.remove();
        }
    }, 1400 + i * 50);
}

const flash = document.createElement('div');
flash.style.position = 'fixed';
flash.style.top = '0';
flash.style.left = '0';
flash.style.width = '100vw';
flash.style.height = '100vh';
flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
flash.style.opacity = '0';
flash.style.transition = 'opacity 0.3s ease-out';
flash.style.zIndex = '50';
flash.style.pointerEvents = 'none';
document.body.appendChild(flash);
setTimeout(() => {
    flash.style.opacity = '0.8';
}, 10);
setTimeout(() => {
    flash.style.opacity = '0';
}, 150);
setTimeout(() => {
    if (document.body.contains(flash)) {
        flash.remove();
    }
}, 500);
}
// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') {
window.location.href = 'index.html';
}
});
// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
setTimeout(() => {
initGame();
initPanZoom();
}, 500); // Delay to ensure Firebase script potentially loads and initializes
});
// Make functions global for HTML onclick handlers
window.talentClick = talentClick;
window.removeTalentPoint = removeTalentPoint; // This was already global, but ensure it's clear
// ===================================================
// PANZOOM IMPLEMENTATION FOR TALENT TREE NAVIGATION
// ===================================================
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
if (!container) {
    console.error("PanZoom: .talent-tree-container not found.");
    return;
}

const wrapper = document.createElement('div');
wrapper.className = 'talent-tree-panzoom';

const svg = container.querySelector('.connection-lines');
const childNodes = Array.from(container.childNodes);

childNodes.forEach(child => {
    if (child !== svg && child.nodeType === Node.ELEMENT_NODE) { // Only move element nodes
        wrapper.appendChild(child);
    }
});

if (svg) {
    container.insertBefore(wrapper, svg.nextSibling); // Insert wrapper, keep svg usually first or where it was
} else {
    container.appendChild(wrapper); // If no svg, just append
}


wrapper.addEventListener('mousedown', startPan);
document.addEventListener('mousemove', pan); // Listen on document for dragging outside wrapper
document.addEventListener('mouseup', endPan); // Listen on document

wrapper.addEventListener('touchstart', startPanTouch, { passive: false });
document.addEventListener('touchmove', panTouch, { passive: false }); // Listen on document
document.addEventListener('touchend', endPanTouch); // Listen on document

container.addEventListener('wheel', zoom, { passive: false });

let lastTap = 0;
wrapper.addEventListener('touchend', function(e) {
    if (e.touches.length > 0) return; // Ignore if other fingers are still down
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) { // Double tap
        resetView();
        e.preventDefault(); // Prevent zoom on double tap if browser supports it
    }
    lastTap = currentTime;
});

wrapper.addEventListener('dblclick', (e) => {
    e.preventDefault(); // Prevent default double click zoom
    resetView();
});

const infoPanel = document.getElementById('talent-info');
if (infoPanel) {
    const infoContent = infoPanel.querySelector('.info-content');
    if (infoContent && !infoContent.querySelector('.reset-view-button')) {
        const resetButton = document.createElement('button');
        resetButton.className = 'reset-view-button';
        resetButton.textContent = 'Reset View';
        resetButton.onclick = resetView;
        infoContent.appendChild(resetButton);
    }
}

if (window.Hammer) {
    const hammer = new Hammer.Manager(wrapper);
    const pinch = new Hammer.Pinch();
    hammer.add(pinch);
    let baseScale = scale;
    hammer.on('pinchstart', function() {
        baseScale = scale;
    });
    hammer.on('pinch', function(e) {
        // Pinch provides e.scale relative to start of pinch
        handleZoom(e.center.x, e.center.y, baseScale * e.scale, wrapper);
    });
}
fixConnectionLines(); // Initial fix for line styles
applyTransform(); // Apply initial transform (identity)
}

function startPan(e) {
    if (e.button !== 0) return; // Only pan on left mouse button
    isPanning = true;
    startPoint = { x: e.clientX, y: e.clientY };
    startTranslate = { ...currentTranslate };
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
}

function pan(e) {
    if (!isPanning) return;
    const dx = (e.clientX - startPoint.x) * PAN_SPEED; // No division by scale here, apply to currentTranslate which is pre-scale
    const dy = (e.clientY - startPoint.y) * PAN_SPEED;

    currentTranslate.x = startTranslate.x + dx;
    currentTranslate.y = startTranslate.y + dy;

    applyTransform();
    e.preventDefault();
}

function endPan() {
    if (!isPanning) return;
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
    const dx = (e.touches[0].clientX - startPoint.x) * PAN_SPEED;
    const dy = (e.touches[0].clientY - startPoint.y) * PAN_SPEED;

    currentTranslate.x = startTranslate.x + dx;
    currentTranslate.y = startTranslate.y + dy;

    applyTransform();
    e.preventDefault();
}

function endPanTouch() {
    // isPanning = false; // Don't reset isPanning here, could interfere with double tap
    // Check if it was a pan or tap end
    if (isPanning && event.touches.length === 0) { // Ensure it was the last finger up
        isPanning = false;
    }
}

function zoom(e) {
    e.preventDefault();
    const container = e.currentTarget; // Should be .talent-tree-container
    const rect = container.getBoundingClientRect();

    // Mouse position relative to the container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    handleZoom(mouseX, mouseY, scale * zoomFactor, container);
}

function handleZoom(mouseX, mouseY, newScale, zoomTargetElement) {
    const oldScale = scale;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    // Panzoom wrapper's current translation (currentTranslate.x, currentTranslate.y)
    // Mouse position (mouseX, mouseY) is relative to the zoomTargetElement (e.g. .talent-tree-container)
    // Point in content coordinates that was under the mouse:
    // contentX = (mouseX - currentTranslate.x) / oldScale
    // contentY = (mouseY - currentTranslate.y) / oldScale
    // We want this point to remain under the mouse after scaling.
    // new_mouseX = contentX * newScale + new_currentTranslate.x
    // new_mouseY = contentY * newScale + new_currentTranslate.y
    // Since mouseX should be new_mouseX (mouse doesn't move):
    // currentTranslate.x = mouseX - contentX * newScale
    // currentTranslate.y = mouseY - contentY * newScale

    currentTranslate.x = mouseX - (mouseX - currentTranslate.x) * (scale / oldScale);
    currentTranslate.y = mouseY - (mouseY - currentTranslate.y) * (scale / oldScale);

    applyTransform();
}


function applyTransform() {
    const panZoomWrapper = document.querySelector('.talent-tree-panzoom');
    if (panZoomWrapper) {
        panZoomWrapper.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }
    // The SVG also needs to be transformed. If it's a direct child of .talent-tree-container
    // and sibling of .talent-tree-panzoom, it should get the same transform.
    // If it's INSIDE .talent-tree-panzoom, it's transformed automatically.
    // Assuming SVG is sibling, as per initPanZoom logic:
    updateSvgTransform();
}

function updateSvgTransform() {
    const svg = document.querySelector('.talent-tree-container > .connection-lines'); // More specific selector
    if (svg) {
        // The SVG itself is transformed, so its internal coordinate system moves with the panZoomWrapper
        svg.style.transformOrigin = '0 0'; // Ensure transform origin is consistent
        svg.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }
}


function resetView() {
    scale = 1;
    currentTranslate = { x: 0, y: 0 };
    applyTransform();
}

function fixConnectionLines() {
    const connectionLines = document.querySelectorAll('.connection-line');
    connectionLines.forEach(line => {
        line.setAttribute('fill', 'none'); // Ensure no fill unless specified by CSS
        // The stroke color and width should ideally be handled by CSS classes like .ice, .speed, .mercy
        // but explicitly setting them here if CSS might be overridden or missing.
        if (!line.style.stroke) { // Only set if not already set by CSS or inline
            const typeClass = Array.from(line.classList).find(cls => ['ice', 'speed', 'mercy', 'mercy-req'].includes(cls));
            let strokeColor;
            switch(typeClass) {
                case 'ice': strokeColor = '#a8d8ff'; break;
                case 'speed': strokeColor = '#d8e6ff'; break;
                case 'mercy': strokeColor = '#c5b7e8'; break;
                case 'mercy-req': strokeColor = '#e0d5ff'; break;
                default: strokeColor = '#ccc'; // Default color for un-typed lines
            }
            line.style.stroke = strokeColor;
        }
        if (!line.style.strokeWidth) {
            line.style.strokeWidth = '4px';
        }
        if (line.classList.contains('mercy-req') && !line.style.strokeDasharray) {
            line.style.strokeDasharray = '5, 5';
        }
    });
    // No need for these event listeners if applyTransform handles SVG updates
    // document.addEventListener('mousemove', updateSvgTransform);
    // document.addEventListener('wheel', updateSvgTransform);
}

// Export for use in HTML or other modules if needed
window.talents = talents;
window.gameState = gameState;