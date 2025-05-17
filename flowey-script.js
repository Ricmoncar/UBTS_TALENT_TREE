// Import the talent configuration
import { TALENT_DEFINITIONS, DEFAULT_TALENT_POINTS } from './flowey-talentconfig.js';

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
    talents: {}
};

// Firebase references
let db;
let floweyRef;

// Initialize the game
function initGame() {
    if (!firebase) {
        console.error('Firebase is not initialized. Please check your Firebase setup.');
        return;
    }
    
    try {
        db = firebase.database();
        floweyRef = db.ref('characters/flowey');
        
        loadGameState().then(() => {
            updateUI();
            setupEventListeners();
            initAnimations();
            
            // Set up real-time sync for Flowey character data
            floweyRef.on('value', (snapshot) => {
                const data = snapshot.val() || { points: DEFAULT_TALENT_POINTS, talents: {}, spentPoints: 0 };
                
                // Update local game state
                gameState.availablePoints = data.points !== undefined ? data.points : DEFAULT_TALENT_POINTS;
                gameState.spentPoints = data.spentPoints || 0;
                
                // Update talent ranks
                Object.keys(talents).forEach(talentId => {
                    talents[talentId].currentRank = data.talents && data.talents[talentId] ? 
                        data.talents[talentId] : 0;
                });
                
                updateUI();
            });
        }).catch(error => {
            console.error('Error during game initialization:', error);
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
            if (node.classList.contains('healing')) {
                createHealingParticles(node);
            } else if (node.classList.contains('buff')) {
                createBuffParticles(node);
            } else if (node.classList.contains('growth')) {
                createGrowthParticles(node);
            } else if (node.classList.contains('ultimate')) {
                createGardenEffect(node);
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
        if (!floweyRef) {
            console.error('Firebase reference not initialized');
            reject(new Error('Firebase reference not initialized'));
            return;
        }
        
        floweyRef.once('value').then((snapshot) => {
            const data = snapshot.val() || { points: DEFAULT_TALENT_POINTS, talents: {}, spentPoints: 0 };
            
            // Update local game state
            gameState.availablePoints = data.points !== undefined ? data.points : DEFAULT_TALENT_POINTS;
            gameState.spentPoints = data.spentPoints || 0;
            
            // Update talent ranks
            Object.keys(talents).forEach(talentId => {
                talents[talentId].currentRank = data.talents && data.talents[talentId] ? 
                    data.talents[talentId] : 0;
            });
            
            resolve();
        }).catch((error) => {
            console.error('Error loading game state:', error);
            reject(error);
        });
    });
}

// Save game state to Firebase
function saveGameState() {
    if (!floweyRef) {
        console.error('Firebase reference not initialized');
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
        
        floweyRef.update(stateToSave).catch((error) => {
            console.error('Error saving game state:', error);
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
                if (!canUnlockTalent(talentId)) {
                    node.classList.add('locked');
                } else {
                    node.classList.remove('locked');
                }
            }
        }
    });
    
    // Update connection lines based on talent state
    updateConnectionLines();
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
        alert('Talent already at maximum rank! Right-click to remove points.');
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
    
    // Add deactivation effect
    addDeactivationEffect(talentId);
    
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
    
    // Add reset view button
    const infoContent = infoPanel.querySelector('.info-content');
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-view-button';
    resetButton.textContent = 'Reset View';
    resetButton.onclick = resetView;
    infoContent.appendChild(resetButton);
}

// Update connection lines based on talent state
function updateConnectionLines() {
    // Find all connection lines
    const connections = document.querySelectorAll('.connection-line');
    
    // For each connection, determine if it should be active based on talent state
    connections.forEach(conn => {
        conn.classList.remove('active');
    });
    
    // Activate connection lines for unlocked talents
    // This is a simplified approach - ideally you would have explicit source/target data for each line
    Object.keys(talents).forEach(talentId => {
        const talent = talents[talentId];
        
        if (talent.currentRank > 0) {
            // Activate connections based on talent type
            const type = talent.type;
            const typeSelector = `.connection-line.${type}`;
            const typeLines = document.querySelectorAll(typeSelector);
            
            // This is a simplified approach. In a production environment,
            // you would want to track which lines connect which talents specifically.
            typeLines.forEach(line => {
                // If this was a more sophisticated system, you would check if this line
                // specifically connects to or from this talent
                // For now, just activate all lines of the matching type
                line.classList.add('active');
            });
            
            // Special handling for requirement connections
            if (talent.type === 'growth') {
                // If this is a growth talent, also activate growth-req lines
                const reqSelector = `.connection-line.growth-req`;
                const reqLines = document.querySelectorAll(reqSelector);
                reqLines.forEach(line => {
                    line.classList.add('active');
                });
            }
        }
    });
}

// Initialize animations and effects
function initAnimations() {
    // Create floating petals and leaves
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createFloatingElement('🌸', 'floating-petal', 30 + Math.random() * 20);
            createFloatingElement('🍃', 'floating-leaf', 35 + Math.random() * 25);
        }, i * 1000);
    }
    
    // Add soul glow animation
    const soulGlow = document.querySelector('.soul-glow');
    if (soulGlow) {
        soulGlow.style.animation = 'flowerGlow 5s ease-in-out infinite';
    }
    
    // Add point spending animation effect
    addPointSpendingAnimation();
}

// Create floating elements (petals, leaves)
function createFloatingElement(emoji, className, duration) {
    const element = document.createElement('div');
    element.className = className;
    element.textContent = emoji;
    element.style.animationDuration = `${duration}s`;
    
    // Random position from top of screen
    const yPos = Math.random() * 80 + 10; // 10-90% of viewport height
    element.style.top = `${yPos}%`;
    
    // Start from left side
    element.style.left = '-50px';
    
    document.querySelector('.background-animation').appendChild(element);
    
    // Remove element after animation completes
    setTimeout(() => {
        if (document.body.contains(element)) {
            element.remove();
        }
    }, duration * 1000);
}

// Create healing particles effect
function createHealingParticles(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'petal-particle healing';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            document.body.appendChild(particle);
            
            // Animate particle outward
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 30 + Math.random() * 20;
                particle.style.transition = 'all 1s ease-out';
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            // Remove particle after animation
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    particle.remove();
                }
            }, 1000);
        }, i * 100);
    }
}

// Create buff particles effect
function createBuffParticles(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create a spiral of particles
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'petal-particle buff';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            document.body.appendChild(particle);
            
            // Spiral animation
            setTimeout(() => {
                const angle = i * (Math.PI / 4); // 8 particles in a circle
                const distance = 20 + i * 3; // Increasing distance for spiral effect
                particle.style.transition = 'all 0.8s ease-out';
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            // Remove particle after animation
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    particle.remove();
                }
            }, 800);
        }, i * 50);
    }
}

// Create growth particles effect
function createGrowthParticles(node) {
    const rect = node.getBoundingClientRect();
    const bottom = rect.bottom;
    const left = rect.left + rect.width / 2;
    
    // Create growing vines effect
    for (let i = 0; i < 3; i++) {
        const vine = document.createElement('div');
        vine.style.position = 'fixed';
        vine.style.width = '2px';
        vine.style.height = '0px';
        vine.style.background = 'linear-gradient(to top, #4CAF50, transparent)';
        vine.style.left = `${left - 5 + i * 5}px`;
        vine.style.top = `${bottom}px`;
        vine.style.zIndex = '1';
        vine.style.transform = 'translateY(0)';
        vine.style.transition = 'all 1s ease-out';
        document.body.appendChild(vine);
        
        // Grow vine
        setTimeout(() => {
            vine.style.height = `${20 + Math.random() * 30}px`;
            vine.style.transform = `translateY(-100%) rotate(${(Math.random() - 0.5) * 20}deg)`;
        }, i * 200);
        
        // Remove vine after animation
        setTimeout(() => {
            if (document.body.contains(vine)) {
                vine.style.opacity = '0';
                setTimeout(() => vine.remove(), 500);
            }
        }, 1200 + i * 200);
    }
}

// Create garden effect for ultimate talent
function createGardenEffect(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create garden particle container if not exists
    let gardenContainer = document.querySelector('.garden-particles');
    if (!gardenContainer) {
        gardenContainer = document.createElement('div');
        gardenContainer.className = 'garden-particles';
        document.body.appendChild(gardenContainer);
    }
    
    // Plants and flower emojis for the garden
    const plants = ['🌷', '🌹', '🌻', '🌺', '🌸', '🌼', '🌱', '🌿', '☘️', '🍀'];
    
    // Create plants in a circular pattern
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const angle = i * (Math.PI * 2 / 10);
            const distance = 80 + Math.random() * 40;
            const plantX = centerX + Math.cos(angle) * distance;
            const plantY = centerY + Math.sin(angle) * distance;
            
            const plant = document.createElement('div');
            plant.className = 'garden-particle';
            plant.textContent = plants[Math.floor(Math.random() * plants.length)];
            plant.style.left = `${plantX}px`;
            plant.style.top = `${plantY}px`;
            
            gardenContainer.appendChild(plant);
            
            // Remove plant after animation
            setTimeout(() => {
                if (document.body.contains(plant)) {
                    plant.style.opacity = '0';
                    setTimeout(() => plant.remove(), 500);
                }
            }, 4000);
        }, i * 100);
    }
    
    // Remove garden container when mouse leaves
    node.addEventListener('mouseleave', () => {
        setTimeout(() => {
            const container = document.querySelector('.garden-particles');
            if (container) {
                container.remove();
            }
        }, 4000);
    }, { once: true });
}

// Add visual effect when activating a talent
function addActivationEffect(talentId) {
    const node = document.querySelector(`[data-id="${talentId}"]`);
    if (!node) return;
    
    // Add activation animation class
    node.classList.add('point-spent-effect');
    
    // Get talent type for specific effects
    const talentType = talents[talentId].type;
    
    // Add type-specific activation effect
    switch (talentType) {
        case 'healing':
            createHealingActivationEffect(node);
            break;
        case 'buff':
            createBuffActivationEffect(node);
            break;
        case 'growth':
            createGrowthActivationEffect(node);
            break;
        case 'ultimate':
            createUltimateActivationEffect(node);
            break;
    }
    
    // Remove animation class after completion
    setTimeout(() => {
        node.classList.remove('point-spent-effect');
    }, 500);
}

// Add visual effect when deactivating a talent
function addDeactivationEffect(talentId) {
    const node = document.querySelector(`[data-id="${talentId}"]`);
    if (!node) return;
    
    // Add deactivation animation class
    node.classList.add('point-removed-effect');
    
    // Add fading effect
    const rect = node.getBoundingClientRect();
    const glow = document.createElement('div');
    glow.style.position = 'fixed';
    glow.style.width = `${rect.width * 1.5}px`;
    glow.style.height = `${rect.height * 1.5}px`;
    glow.style.top = `${rect.top - rect.height * 0.25}px`;
    glow.style.left = `${rect.left - rect.width * 0.25}px`;
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.4), transparent 70%)';
    glow.style.transition = 'all 0.5s ease-out';
    glow.style.zIndex = '1';
    document.body.appendChild(glow);
    
    // Animate glow
    setTimeout(() => {
        glow.style.transform = 'scale(0.5)';
        glow.style.opacity = '0';
    }, 10);
    
    // Remove effects
    setTimeout(() => {
        if (document.body.contains(glow)) {
            glow.remove();
        }
        node.classList.remove('point-removed-effect');
    }, 500);
}

// Type-specific activation effects
function createHealingActivationEffect(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create a burst of green healing particles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'petal-particle healing';
            const size = 3 + Math.random() * 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            document.body.appendChild(particle);
            
            // Animate particles outward
            setTimeout(() => {
                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 60;
                particle.style.transition = `all ${0.5 + Math.random() * 0.5}s ease-out`;
                particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                particle.style.opacity = '0';
            }, 10);
            
            // Remove particle after animation
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    particle.remove();
                }
            }, 1000);
        }, i * 20);
    }
    
    // Create a healing symbol
    const symbol = document.createElement('div');
    symbol.textContent = '💚';
    symbol.style.position = 'fixed';
    symbol.style.fontSize = '24px';
    symbol.style.left = `${centerX}px`;
    symbol.style.top = `${centerY}px`;
    symbol.style.transform = 'translate(-50%, -50%) scale(0)';
    symbol.style.opacity = '0';
    symbol.style.transition = 'all 0.5s ease-out';
    symbol.style.zIndex = '2';
    document.body.appendChild(symbol);
    
    // Animate symbol
    setTimeout(() => {
        symbol.style.transform = 'translate(-50%, -50%) scale(2)';
        symbol.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        symbol.style.transform = 'translate(-50%, -50%) scale(3)';
        symbol.style.opacity = '0';
    }, 400);
    
    // Remove symbol
    setTimeout(() => {
        if (document.body.contains(symbol)) {
            symbol.remove();
        }
    }, 900);
}

function createBuffActivationEffect(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create a ring of buff particles
    for (let i = 0; i < 16; i++) {
        const angle = i * (Math.PI * 2 / 16);
        const particle = document.createElement('div');
        particle.className = 'petal-particle buff';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        document.body.appendChild(particle);
        
        // Animate particles in a ring
        setTimeout(() => {
            const distance = 40;
            particle.style.transition = 'all 0.6s ease-out';
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0.8';
        }, 10);
        
        // Second phase - expand outward
        setTimeout(() => {
            const expandDistance = 70;
            particle.style.transform = `translate(${Math.cos(angle) * expandDistance}px, ${Math.sin(angle) * expandDistance}px)`;
            particle.style.opacity = '0';
        }, 600);
        
        // Remove particle after animation
        setTimeout(() => {
            if (document.body.contains(particle)) {
                particle.remove();
            }
        }, 1200);
    }
    
    // Create a buff symbol
    const symbol = document.createElement('div');
    symbol.textContent = '⚡';
    symbol.style.position = 'fixed';
    symbol.style.fontSize = '28px';
    symbol.style.left = `${centerX}px`;
    symbol.style.top = `${centerY}px`;
    symbol.style.transform = 'translate(-50%, -50%) scale(0)';
    symbol.style.opacity = '0';
    symbol.style.transition = 'all 0.4s ease-out';
    symbol.style.zIndex = '2';
    document.body.appendChild(symbol);
    
    // Animate symbol
    setTimeout(() => {
        symbol.style.transform = 'translate(-50%, -50%) scale(1.5)';
        symbol.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        symbol.style.transform = 'translate(-50%, -50%) scale(2.5)';
        symbol.style.opacity = '0';
    }, 700);
    
    // Remove symbol
    setTimeout(() => {
        if (document.body.contains(symbol)) {
            symbol.remove();
        }
    }, 1100);
}

function createGrowthActivationEffect(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create growing vines from the bottom of the node
    for (let i = 0; i < 5; i++) {
        const vine = document.createElement('div');
        vine.style.position = 'fixed';
        vine.style.width = '3px';
        vine.style.height = '0';
        vine.style.backgroundColor = '#4CAF50';
        vine.style.left = `${centerX + (i - 2) * 8}px`;
        vine.style.top = `${rect.bottom}px`;
        vine.style.transformOrigin = 'bottom center';
        vine.style.transition = 'all 1s ease-out';
        vine.style.zIndex = '1';
        document.body.appendChild(vine);
        
        // Animate vine growing
        setTimeout(() => {
            vine.style.height = `${40 + Math.random() * 30}px`;
            vine.style.transform = `translateY(-100%) rotate(${(Math.random() - 0.5) * 30}deg)`;
        }, i * 100);
        
        // Add a leaf/flower to the end of each vine
        setTimeout(() => {
            const leaf = document.createElement('div');
            leaf.textContent = Math.random() > 0.5 ? '🍃' : '🌱';
            leaf.style.position = 'fixed';
            leaf.style.fontSize = '16px';
            leaf.style.left = `${centerX + (i - 2) * 8}px`;
            leaf.style.top = `${rect.bottom - 40 - Math.random() * 30}px`;
            leaf.style.transform = 'translate(-50%, -100%) scale(0)';
            leaf.style.opacity = '0';
            leaf.style.transition = 'all 0.4s ease-out';
            leaf.style.zIndex = '2';
            document.body.appendChild(leaf);
            
            // Animate leaf appearing
            setTimeout(() => {
                leaf.style.transform = 'translate(-50%, -100%) scale(1)';
                leaf.style.opacity = '1';
            }, 50);
            
            // Remove leaf
            setTimeout(() => {
                if (document.body.contains(leaf)) {
                    leaf.style.opacity = '0';
                    setTimeout(() => leaf.remove(), 400);
                }
            }, 1500);
        }, 500 + i * 100);
        
        // Remove vine
        setTimeout(() => {
            if (document.body.contains(vine)) {
                vine.style.opacity = '0';
                setTimeout(() => vine.remove(), 500);
            }
        }, 2000);
    }
    
    // Create a growth symbol
    const symbol = document.createElement('div');
    symbol.textContent = '🌿';
    symbol.style.position = 'fixed';
    symbol.style.fontSize = '28px';
    symbol.style.left = `${centerX}px`;
    symbol.style.top = `${centerY}px`;
    symbol.style.transform = 'translate(-50%, -50%) scale(0)';
    symbol.style.opacity = '0';
    symbol.style.transition = 'all 0.5s ease-out';
    symbol.style.zIndex = '2';
    document.body.appendChild(symbol);
    
    // Animate symbol
    setTimeout(() => {
        symbol.style.transform = 'translate(-50%, -50%) scale(1.5)';
        symbol.style.opacity = '1';
    }, 200);
    
    setTimeout(() => {
        symbol.style.transform = 'translate(-50%, -50%) scale(2)';
        symbol.style.opacity = '0';
    }, 700);
    
    // Remove symbol
    setTimeout(() => {
        if (document.body.contains(symbol)) {
            symbol.remove();
        }
    }, 1200);
}

function createUltimateActivationEffect(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Flash effect
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100vw';
    flash.style.height = '100vh';
    flash.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    flash.style.opacity = '0';
    flash.style.transition = 'opacity 0.3s ease-out';
    flash.style.zIndex = '900';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.opacity = '0.7';
    }, 10);
    
    setTimeout(() => {
        flash.style.opacity = '0';
    }, 300);
    
    setTimeout(() => {
        if (document.body.contains(flash)) {
            flash.remove();
        }
    }, 600);
    
    // Create a garden of flowers
    const plantEmojis = ['🌷', '🌹', '🌻', '🌺', '🌸', '🌼', '🌱', '🌿', '☘️', '🍀', '🌳'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const plant = document.createElement('div');
            plant.textContent = plantEmojis[Math.floor(Math.random() * plantEmojis.length)];
            plant.style.position = 'fixed';
            plant.style.fontSize = '24px';
            
            // Position in a circular pattern around the node
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 200;
            plant.style.left = `${centerX + Math.cos(angle) * distance}px`;
            plant.style.top = `${centerY + Math.sin(angle) * distance}px`;
            
            plant.style.transform = 'scale(0)';
            plant.style.opacity = '0';
            plant.style.transition = 'all 0.7s ease-out';
            plant.style.zIndex = '2';
            document.body.appendChild(plant);
            
            // Animate plant growing
            setTimeout(() => {
                plant.style.transform = 'scale(1)';
                plant.style.opacity = '0.9';
            }, 10);
            
            // Remove plant
            setTimeout(() => {
                if (document.body.contains(plant)) {
                    plant.style.opacity = '0';
                    setTimeout(() => plant.remove(), 500);
                }
            }, 2000 + Math.random() * 1000);
        }, 200 + i * 50);
    }
    
    // Create a rainbow effect
    const rainbow = document.createElement('div');
    rainbow.textContent = '🌈';
    rainbow.style.position = 'fixed';
    rainbow.style.fontSize = '60px';
    rainbow.style.left = `${centerX}px`;
    rainbow.style.top = `${centerY}px`;
    rainbow.style.transform = 'translate(-50%, -50%) scale(0)';
    rainbow.style.opacity = '0';
    rainbow.style.transition = 'all 0.8s ease-out';
    rainbow.style.zIndex = '3';
    document.body.appendChild(rainbow);
    
    // Animate rainbow
    setTimeout(() => {
        rainbow.style.transform = 'translate(-50%, -50%) scale(3)';
        rainbow.style.opacity = '1';
    }, 400);
    
    setTimeout(() => {
        rainbow.style.transform = 'translate(-50%, -50%) scale(5)';
        rainbow.style.opacity = '0';
    }, 1500);
    
    // Remove rainbow
    setTimeout(() => {
        if (document.body.contains(rainbow)) {
            rainbow.remove();
        }
    }, 2300);
}

// Add animation when spending points
function addPointSpendingAnimation() {
    // Save original talentClick function
    const originalTalentClick = window.talentClick;
    
    // Override with our version that adds animation
    window.talentClick = function(talentId) {
        const node = document.querySelector(`[data-id="${talentId}"]`);
        
        // Call original function or this function's implementation
        const result = talentClick(talentId);
        
        return result;
    };
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
window.talents = talents; // Export for debugging and HTML references

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
    if (container) {
        container.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
        
        // Update SVG connections to match the transform
        updateConnections();
    }
}

function updateConnections() {
    const svg = document.querySelector('.connection-lines');
    if (svg) {
        svg.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px) scale(${scale})`;
    }
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
        const type = line.classList.contains('healing') ? 'healing' : 
                    line.classList.contains('buff') ? 'buff' : 
                    line.classList.contains('growth-req') ? 'growth-req' : 'growth';
        
        let strokeColor;
        switch(type) {
            case 'healing': strokeColor = '#66bb6a'; break;
            case 'buff': strokeColor = '#ffca28'; break;
            case 'growth': strokeColor = '#81c784'; break;
            case 'growth-req': strokeColor = '#b39ddb'; break;
        }
        
        line.style.stroke = strokeColor;
        line.style.strokeWidth = '4px';
        line.style.fill = 'none';
        
        if (type === 'growth-req') {
            line.style.strokeDasharray = '5, 5';
        }
    });
    
    // Ensure the connection lines are visible during pan-zoom
    document.addEventListener('mousemove', updateConnections);
    document.addEventListener('wheel', updateConnections);
}