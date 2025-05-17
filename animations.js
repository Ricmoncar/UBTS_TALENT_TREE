// Add this to your script.js file or create a new animations.js file

// Generate magical particles
function createMagicalParticles() {
    const container = document.createElement('div');
    container.className = 'magical-particles';
    document.querySelector('.talent-tree-container').appendChild(container);
    
    // Create particles for each branch
    const particleCount = {
        bravery: 15,
        humility: 15,
        mixed: 10
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

// Create energy aura around central soul
function createSoulAura() {
    const aura = document.createElement('div');
    aura.className = 'soul-aura';
    document.querySelector('.talent-tree-container').appendChild(aura);
}

// Create power surge effects
function createPowerSurges() {
    const types = ['bravery', 'humility', 'mixed'];
    
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
        if (node) {
            node.classList.add('point-spent-effect');
            setTimeout(() => {
                node.classList.remove('point-spent-effect');
            }, 500);
        }
        
        return result;
    };
}

// Initialize all animations
function initAnimations() {
    createMagicalParticles();
    createSoulAura();
    createPowerSurges();
    addPointSpendingAnimation();
}

// Run after DOM is loaded and talent tree is initialized
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure talent tree is fully loaded
    setTimeout(initAnimations, 1000);
});