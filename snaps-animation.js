// Snaps Animation Effects - Fixed version
// Add this to your snaps-script.js file or create a new snaps-animations.js file

// Generate magical and axe particles
function createSnapsParticles() {
    const container = document.createElement('div');
    container.className = 'snaps-particles';
    document.querySelector('.talent-tree-container').appendChild(container);
    
    // Create particles for each branch
    const particleCount = {
        magic: 15,
        physical: 15,
        weapon: 20
    };
    
    // Generate particles
    Object.keys(particleCount).forEach(type => {
        for (let i = 0; i < particleCount[type]; i++) {
            createParticle(container, type);
        }
    });
}

function createParticle(container, type) {
    const particle = document.createElement('div');
    particle.className = `particle ${type}`;
    
    // Random position
    const xPos = Math.random() * 100;
    particle.style.left = `${xPos}%`;
    
    // Random size (1-3px)
    const size = 1 + Math.random() * 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random duration (10-20s)
    const duration = 10 + Math.random() * 10;
    particle.style.setProperty('--duration', `${duration}s`);
    
    // Random drift (-50px to 50px)
    const drift = (Math.random() - 0.5) * 100;
    particle.style.setProperty('--drift', `${drift}px`);
    
    // Random opacity (0.3-0.7)
    const opacity = 0.3 + Math.random() * 0.4;
    particle.style.setProperty('--max-opacity', opacity);
    
    // Random delay (0-10s)
    const delay = Math.random() * 10;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
    
    // Remove and recreate the particle after animation completes
    setTimeout(() => {
        particle.remove();
        createParticle(container, type);
    }, (duration + delay) * 1000);
}

// Create star glow effect
function createStarGlow() {
    // Add extra glow to the star
    const starContainer = document.querySelector('.soul-container');
    if (!starContainer) return;

    // Add multiple layers of glow for better effect
    for (let i = 0; i < 3; i++) {
        const glow = document.createElement('div');
        glow.className = 'star-glow-layer';
        glow.style.position = 'absolute';
        glow.style.top = '50%';
        glow.style.left = '50%';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.width = `${200 + i * 30}px`;
        glow.style.height = `${200 + i * 30}px`;
        glow.style.borderRadius = '50%';
        glow.style.background = `radial-gradient(circle, rgba(98, 216, 75, ${0.3 - i * 0.1}), transparent 70%)`;
        glow.style.animation = `pulse ${3 + i}s infinite alternate ease-in-out`;
        glow.style.animationDelay = `${i * 0.5}s`;
        glow.style.zIndex = '1';
        
        starContainer.appendChild(glow);
    }
}

// Create power surge effects
function createPowerSurges() {
    const types = ['magic', 'physical', 'weapon'];
    
    types.forEach(type => {
        const surge = document.createElement('div');
        surge.className = `power-surge ${type}`;
        document.querySelector('.talent-tree-container').appendChild(surge);
    });
}

// Add animation when spending points
function addPointSpendingAnimation() {
    // Save original talentClick function
    const originalTalentClick = window.talentClick;
    
    // Override with our version that adds animation
    window.talentClick = function(talentId) {
        const node = document.querySelector(`[data-id="${talentId}"]`);
        
        // Call original function
        const result = originalTalentClick(talentId);
        
        // Add animation effect
        if (node && result !== false) {
            // Regular animation for all talents
            node.classList.add('point-spent-effect');
            createParticleBurst(node);
            setTimeout(() => {
                node.classList.remove('point-spent-effect');
            }, 500);
        }
        
        return result;
    };
}

// Create particle burst effect
function createParticleBurst(node) {
    const rect = node.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Determine particle type based on talent class
    let type = 'weapon';
    if (node.classList.contains('magic')) {
        type = 'magic';
    } else if (node.classList.contains('physical')) {
        type = 'physical';
    }
    
    // Create CSS for burst particles if not already added
    if (!document.getElementById('burst-particle-style')) {
        const style = document.createElement('style');
        style.id = 'burst-particle-style';
        style.textContent = `
            .burst-particle {
                position: fixed;
                border-radius: 50%;
                opacity: 1;
                z-index: 100;
                transition: all 0.5s ease-out;
                transform: translate(-50%, -50%);
            }
            
            .burst-particle.magic {
                background: radial-gradient(circle, rgba(163, 116, 219, 0.9), rgba(163, 116, 219, 0.3));
                box-shadow: 0 0 8px rgba(163, 116, 219, 0.7);
            }
            
            .burst-particle.physical {
                background: radial-gradient(circle, rgba(255, 140, 36, 0.9), rgba(255, 140, 36, 0.3));
                box-shadow: 0 0 8px rgba(255, 140, 36, 0.7);
            }
            
            .burst-particle.weapon {
                background: radial-gradient(circle, rgba(98, 216, 75, 0.9), rgba(98, 216, 75, 0.3));
                box-shadow: 0 0 8px rgba(98, 216, 75, 0.7);
            }
            
            .point-spent-effect {
                animation: pointSpent 0.5s ease-out !important;
            }
            
            @keyframes pointSpent {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    filter: brightness(1);
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.3);
                    filter: brightness(1.5);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    filter: brightness(1);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Create particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = `burst-particle ${type}`;
        
        // Random size
        const size = 4 + Math.random() * 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position at center of node
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Random direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 100;
        const duration = 500 + Math.random() * 1000;
        
        // Add to document
        document.body.appendChild(particle);
        
        // Start animation
        setTimeout(() => {
            particle.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px))`;
            particle.style.opacity = '0';
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, duration);
    }
}

// Initialize all animations
function initSnapsAnimations() {
    // Create styles first
    addAnimationStyles();
    
    // Then create visual elements
    createSnapsParticles();
    createStarGlow();
    createPowerSurges();
    addPointSpendingAnimation();
    
    // Check for extra nodes in the star and remove them if found
    removeNodesInStar();
}

// Add CSS styles for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Particle styles */
        .particle {
            position: absolute;
            border-radius: 50%;
            top: 0;
            opacity: 0;
            z-index: 1;
            animation: floatUp var(--duration) ease-in-out infinite;
        }
        
        .particle.magic {
            background: radial-gradient(circle, rgba(163, 116, 219, 0.9), rgba(163, 116, 219, 0.1));
            box-shadow: 0 0 5px rgba(163, 116, 219, 0.5);
        }
        
        .particle.physical {
            background: radial-gradient(circle, rgba(255, 140, 36, 0.9), rgba(255, 140, 36, 0.1));
            box-shadow: 0 0 5px rgba(255, 140, 36, 0.5);
        }
        
        .particle.weapon {
            background: radial-gradient(circle, rgba(98, 216, 75, 0.9), rgba(98, 216, 75, 0.1));
            box-shadow: 0 0 5px rgba(98, 216, 75, 0.5);
        }
        
        @keyframes floatUp {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            20% {
                opacity: var(--max-opacity);
            }
            80% {
                opacity: var(--max-opacity);
            }
            100% {
                transform: translateY(-100px) translateX(var(--drift));
                opacity: 0;
            }
        }
        
        /* Star glow */
        @keyframes pulse {
            0%, 100% {
                opacity: 0.4;
                transform: translate(-50%, -50%) scale(1);
            }
            50% {
                opacity: 0.8;
                transform: translate(-50%, -50%) scale(1.1);
            }
        }
        
        /* Power surges */
        .power-surge {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 1px;
            height: 1px;
            z-index: 1;
            pointer-events: none;
        }
        
        .power-surge.magic::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, rgba(163, 116, 219, 0.8), rgba(163, 116, 219, 0));
            transform-origin: left center;
            transform: rotate(-60deg);
            animation: surgePulse 8s ease-in-out infinite;
            animation-delay: 0s;
        }
        
        .power-surge.physical::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, rgba(255, 140, 36, 0.8), rgba(255, 140, 36, 0));
            transform-origin: left center;
            transform: rotate(60deg);
            animation: surgePulse 8s ease-in-out infinite;
            animation-delay: 2.5s;
        }
        
        .power-surge.weapon::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, rgba(98, 216, 75, 0.8), rgba(98, 216, 75, 0));
            transform-origin: left center;
            transform: rotate(180deg);
            animation: surgePulse 8s ease-in-out infinite;
            animation-delay: 5s;
        }
        
        @keyframes surgePulse {
            0%, 100% {
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Check for and remove any nodes mistakenly placed inside the star
function removeNodesInStar() {
    const starContainer = document.querySelector('.soul-container');
    if (!starContainer) return;
    
    const starRect = starContainer.getBoundingClientRect();
    const starCenterX = starRect.left + starRect.width / 2;
    const starCenterY = starRect.top + starRect.height / 2;
    const starRadius = starRect.width / 2;
    
    // Find all talent nodes
    const nodes = document.querySelectorAll('.talent-node');
    
    nodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const nodeCenterX = nodeRect.left + nodeRect.width / 2;
        const nodeCenterY = nodeRect.top + nodeRect.height / 2;
        
        // Calculate distance from node center to star center
        const distance = Math.sqrt(
            Math.pow(nodeCenterX - starCenterX, 2) + 
            Math.pow(nodeCenterY - starCenterY, 2)
        );
        
        // If node is inside the star, move it outside
        if (distance < starRadius) {
            console.log('Found node inside star, repositioning...');
            
            // Calculate angle from star center to node
            const angle = Math.atan2(nodeCenterY - starCenterY, nodeCenterX - starCenterX);
            
            // Calculate new position outside the star
            const newDistanceFromCenter = starRadius + nodeRect.width / 2 + 10;
            const newX = 50 + (Math.cos(angle) * newDistanceFromCenter / window.innerWidth * 100);
            const newY = 50 + (Math.sin(angle) * newDistanceFromCenter / window.innerHeight * 100);
            
            // Update node position
            node.style.left = `${newX}%`;
            node.style.top = `${newY}%`;
        }
    });
}

// Run after DOM is loaded and talent tree is initialized
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure talent tree is fully loaded
    setTimeout(initSnapsAnimations, 1000);
});