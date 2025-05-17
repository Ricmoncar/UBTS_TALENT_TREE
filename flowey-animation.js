// flowey-animations.js - Enhanced animations for Flowey's talent tree

// Generate magical flower particles
function createFlowerParticles() {
    const container = document.createElement('div');
    container.className = 'flower-particles';
    document.querySelector('.talent-tree-container').appendChild(container);
    
    // Create particles for each branch
    const particleCount = {
        healing: 15,
        buff: 15,
        growth: 10
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
    
    // Random size (2-4px)
    const size = 2 + Math.random() * 2;
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
    
    // Set color based on type
    let color;
    switch(type) {
        case 'healing':
            color = 'rgba(76, 175, 80, 0.7)'; // Green
            break;
        case 'buff':
            color = 'rgba(255, 193, 7, 0.7)'; // Amber
            break;
        case 'growth':
            color = 'rgba(139, 195, 74, 0.7)'; // Light Green
            break;
    }
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 5px ${color}`;
    
    container.appendChild(particle);
    
    // Remove and recreate the particle after animation completes
    setTimeout(() => {
        particle.remove();
        createParticle(container, type);
    }, (duration + delay) * 1000);
}

// Create energy aura around central flower
function createFlowerAura() {
    const aura = document.createElement('div');
    aura.className = 'flower-aura';
    document.querySelector('.talent-tree-container').appendChild(aura);
}

// Create power surge effects
function createNectarSurges() {
    const types = ['healing', 'buff', 'growth'];
    
    types.forEach(type => {
        const surge = document.createElement('div');
        surge.className = `nectar-surge ${type}`;
        document.querySelector('.talent-tree-container').appendChild(surge);
    });
}

// Add glowing vines effect
function createGlowingVines() {
    const container = document.querySelector('.talent-tree-container');
    const vinesCount = 8;
    
    for (let i = 0; i < vinesCount; i++) {
        const vine = document.createElement('div');
        vine.className = 'glowing-vine';
        
        // Position around the central flower
        const angle = (i / vinesCount) * Math.PI * 2;
        const startX = 50; // Center X (%)
        const startY = 50; // Center Y (%)
        
        // Set vine properties
        vine.style.width = '2px';
        vine.style.height = '0';
        vine.style.position = 'absolute';
        vine.style.left = `${startX}%`;
        vine.style.top = `${startY}%`;
        vine.style.transformOrigin = 'center bottom';
        vine.style.transform = `rotate(${angle}rad)`;
        
        // Set color based on section
        if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
            vine.style.background = 'linear-gradient(to top, rgba(76, 175, 80, 0.7), transparent)'; // Healing side
        } else {
            vine.style.background = 'linear-gradient(to top, rgba(255, 193, 7, 0.7), transparent)'; // Buff side
        }
        
        // Add transition for growth animation
        vine.style.transition = 'height 3s ease-out, opacity 2s ease-in-out';
        vine.style.opacity = '0';
        
        container.appendChild(vine);
        
        // Start vine growth animation after a delay
        setTimeout(() => {
            const length = 30 + Math.random() * 20; // Random length 30-50%
            vine.style.height = `${length}%`;
            vine.style.opacity = '0.7';
        }, 500 + i * 300);
        
        // Make vines pulse
        setInterval(() => {
            vine.style.opacity = '0.3';
            setTimeout(() => {
                vine.style.opacity = '0.7';
            }, 1000);
        }, 3000);
    }
}

// Create floating flowers and leaves
function createFloatingElements() {
    const container = document.querySelector('.talent-tree-container');
    const elements = ['🌸', '🌼', '🌺', '🍃', '🌱'];
    const count = 15;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.textContent = elements[Math.floor(Math.random() * elements.length)];
            
            // Random position
            element.style.position = 'absolute';
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.fontSize = `${12 + Math.random() * 8}px`;
            element.style.opacity = '0';
            element.style.zIndex = '1';
            element.style.pointerEvents = 'none';
            
            // Animation
            const duration = 10 + Math.random() * 10;
            element.style.transition = `opacity 2s ease-in, transform ${duration}s ease-in-out`;
            
            container.appendChild(element);
            
            // Start animation
            setTimeout(() => {
                element.style.opacity = '0.5';
                element.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`;
            }, 100);
            
            // Remove element after animation
            setTimeout(() => {
                element.style.opacity = '0';
                setTimeout(() => {
                    if (container.contains(element)) {
                        element.remove();
                    }
                }, 2000);
            }, duration * 1000 - 2000);
        }, i * 1000);
    }
    
    // Repeat floating elements periodically
    setTimeout(createFloatingElements, count * 1000);
}

// Add animation when spending points
function addPointSpendingAnimation() {
    // Save original talentClick function reference
    const originalTalentClick = window.talentClick;
    
    // Override with our version that adds animation
    window.talentClick = function(talentId) {
        const node = document.querySelector(`[data-id="${talentId}"]`);
        
        // Call original function
        const result = originalTalentClick(talentId);
        
        // Add animation effect
        if (node) {
            node.classList.add('point-spent-effect');
            
            // Create a burst of particles
            const rect = node.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Determine particle type based on node class
            let particleType = 'growth';
            if (node.classList.contains('healing')) {
                particleType = 'healing';
            } else if (node.classList.contains('buff')) {
                particleType = 'buff';
            }
            
            // Create particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = `point-particle ${particleType}`;
                particle.style.position = 'fixed';
                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.width = `${3 + Math.random() * 4}px`;
                particle.style.height = `${3 + Math.random() * 4}px`;
                particle.style.borderRadius = '50%';
                particle.style.zIndex = '100';
                particle.style.pointerEvents = 'none';
                
                // Set color based on type
                switch(particleType) {
                    case 'healing':
                        particle.style.background = 'radial-gradient(circle, rgba(76, 175, 80, 0.9), rgba(76, 175, 80, 0.3))';
                        particle.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.7)';
                        break;
                    case 'buff':
                        particle.style.background = 'radial-gradient(circle, rgba(255, 193, 7, 0.9), rgba(255, 193, 7, 0.3))';
                        particle.style.boxShadow = '0 0 10px rgba(255, 193, 7, 0.7)';
                        break;
                    case 'growth':
                        particle.style.background = 'radial-gradient(circle, rgba(139, 195, 74, 0.9), rgba(139, 195, 74, 0.3))';
                        particle.style.boxShadow = '0 0 10px rgba(139, 195, 74, 0.7)';
                        break;
                }
                
                document.body.appendChild(particle);
                
                // Animate particles
                setTimeout(() => {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 20 + Math.random() * 60;
                    particle.style.transition = 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
                    particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
                    particle.style.opacity = '0';
                }, 10);
                
                // Remove particles
                setTimeout(() => {
                    if (document.body.contains(particle)) {
                        particle.remove();
                    }
                }, 800);
            }
            
            setTimeout(() => {
                node.classList.remove('point-spent-effect');
            }, 500);
        }
        
        return result;
    };
}

// Garden of Eden ultimate ability effect
function setupUltimateEffect() {
    const ultimateNode = document.querySelector('.talent-node.ultimate');
    if (!ultimateNode) return;
    
    ultimateNode.addEventListener('mouseenter', () => {
        // Create a garden effect around the ultimate talent
        createGardenEffect(ultimateNode);
    });
}

function createGardenEffect(node) {
    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create a rainbow aura
    const aura = document.createElement('div');
    aura.style.position = 'fixed';
    aura.style.width = '300px';
    aura.style.height = '300px';
    aura.style.left = `${centerX - 150}px`;
    aura.style.top = `${centerY - 150}px`;
    aura.style.backgroundImage = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,193,7,0.2) 20%, rgba(76,175,80,0.2) 40%, rgba(139,195,74,0.2) 60%, rgba(179,157,219,0.2) 80%, transparent 100%)';
    aura.style.borderRadius = '50%';
    aura.style.opacity = '0';
    aura.style.transition = 'opacity 1s ease-out';
    aura.style.zIndex = '50';
    aura.style.pointerEvents = 'none';
    document.body.appendChild(aura);
    
    // Animate aura
    setTimeout(() => {
        aura.style.opacity = '1';
    }, 10);
    
    // Plants for the garden
    const plants = ['🌷', '🌹', '🌻', '🌺', '🌸', '🌼', '🌱', '🌿', '☘️', '🍀'];
    
    // Create plants in a circle around the node
    for (let i = 0; i < 24; i++) {
        const delay = 100 + i * 50;
        setTimeout(() => {
            const plant = document.createElement('div');
            plant.textContent = plants[Math.floor(Math.random() * plants.length)];
            plant.style.position = 'fixed';
            plant.style.fontSize = '20px';
            plant.style.zIndex = '51';
            plant.style.pointerEvents = 'none';
            
            // Position in a circle
            const angle = (i / 24) * Math.PI * 2;
            const distance = 100;
            plant.style.left = `${centerX + Math.cos(angle) * distance}px`;
            plant.style.top = `${centerY + Math.sin(angle) * distance}px`;
            
            // Initial state
            plant.style.opacity = '0';
            plant.style.transform = 'scale(0.2)';
            plant.style.transition = 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            document.body.appendChild(plant);
            
            // Grow plant
            setTimeout(() => {
                plant.style.opacity = '1';
                plant.style.transform = 'scale(1)';
            }, 50);
            
            // Add gentle swaying animation
            plant.style.animation = `plantSway 2s ease-in-out infinite alternate ${Math.random() * 2}s`;
            
            // Add to cleanup collection
            gardenElements.push(plant);
        }, delay);
    }
    
    // Add butterflies and bees for extra effect
    const insects = ['🦋', '🐝'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const insect = document.createElement('div');
            insect.textContent = insects[Math.floor(Math.random() * insects.length)];
            insect.style.position = 'fixed';
            insect.style.fontSize = '18px';
            insect.style.zIndex = '52';
            insect.style.pointerEvents = 'none';
            
            // Start position
            const startAngle = Math.random() * Math.PI * 2;
            const startDistance = 120;
            insect.style.left = `${centerX + Math.cos(startAngle) * startDistance}px`;
            insect.style.top = `${centerY + Math.sin(startAngle) * startDistance}px`;
            
            // Initial state
            insect.style.opacity = '0';
            insect.style.transition = 'opacity 0.5s ease-out';
            
            document.body.appendChild(insect);
            
            // Show insect
            setTimeout(() => {
                insect.style.opacity = '1';
            }, 50);
            
            // Animate flight pattern
            const duration = 10000;
            const startTime = Date.now();
            
            function animateInsect() {
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    if (document.body.contains(insect)) {
                        insect.style.opacity = '0';
                        setTimeout(() => insect.remove(), 500);
                    }
                    return;
                }
                
                // Complex flight pattern using sine/cosine waves
                const progress = elapsed / duration;
                const angle = startAngle + progress * Math.PI * 4;
                const distance = startDistance + Math.sin(progress * Math.PI * 6) * 30;
                
                insect.style.left = `${centerX + Math.cos(angle) * distance}px`;
                insect.style.top = `${centerY + Math.sin(angle) * distance}px`;
                
                // Continue animation
                requestAnimationFrame(animateInsect);
            }
            
            animateInsect();
            
            // Add to cleanup collection
            gardenElements.push(insect);
        }, 1000 + i * 300);
    }
    
    // Add a rainbow
    setTimeout(() => {
        const rainbow = document.createElement('div');
        rainbow.textContent = '🌈';
        rainbow.style.position = 'fixed';
        rainbow.style.fontSize = '40px';
        rainbow.style.left = `${centerX}px`;
        rainbow.style.top = `${centerY - 130}px`;
        rainbow.style.transform = 'translate(-50%, -50%) scale(0)';
        rainbow.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        rainbow.style.zIndex = '53';
        rainbow.style.pointerEvents = 'none';
        rainbow.style.opacity = '0';
        document.body.appendChild(rainbow);
        
        setTimeout(() => {
            rainbow.style.transform = 'translate(-50%, -50%) scale(1)';
            rainbow.style.opacity = '1';
        }, 50);
        
        gardenElements.push(rainbow);
    }, 500);
    
    // Store elements for cleanup
    const gardenElements = [aura];
    
    // Add keyframes for plant swaying if not already added
    if (!document.getElementById('garden-style')) {
        const style = document.createElement('style');
        style.id = 'garden-style';
        style.textContent = `
            @keyframes plantSway {
                0% { transform: rotate(-5deg); }
                100% { transform: rotate(5deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove garden effect when mouse leaves
    node.addEventListener('mouseleave', () => {
        // Fade out and remove elements
        gardenElements.forEach(element => {
            if (document.body.contains(element)) {
                element.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(element)) {
                        element.remove();
                    }
                }, 1000);
            }
        });
    }, { once: true });
}

// Initialize all animations
function initAnimations() {
    createFlowerParticles();
    createFlowerAura();
    createNectarSurges();
    createGlowingVines();
    createFloatingElements();
    addPointSpendingAnimation();
    setupUltimateEffect();
    
    // Add CSS animations if not already present
    addAnimationStyles();
}

// Add CSS animations dynamically
function addAnimationStyles() {
    if (document.getElementById('flowey-animation-styles')) {
        return; // Already added
    }
    
    const style = document.createElement('style');
    style.id = 'flowey-animation-styles';
    style.textContent = `
        .particle {
            position: absolute;
            border-radius: 50%;
            opacity: 0;
            animation: floatParticle var(--duration) ease-in-out infinite;
        }
        
        @keyframes floatParticle {
            0%, 100% {
                transform: translateY(100vh) translateX(var(--drift));
                opacity: 0;
            }
            10%, 90% {
                opacity: var(--max-opacity);
            }
            50% {
                transform: translateY(0) translateX(calc(var(--drift) / 2));
            }
        }
        
        .flower-aura {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 250px;
            height: 250px;
            border-radius: 50%;
            background: radial-gradient(circle, 
                rgba(255, 235, 59, 0.2), 
                rgba(76, 175, 80, 0.1), 
                rgba(139, 195, 74, 0.05), 
                transparent 70%);
            animation: pulseAura 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 1;
        }
        
        @keyframes pulseAura {
            0%, 100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0.5;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.8;
            }
        }
        
        .nectar-surge {
            position: absolute;
            width: 0;
            height: 0;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            animation: nectarSurge 8s ease-out infinite;
            pointer-events: none;
            z-index: 1;
        }
        
        .nectar-surge.healing {
            border: 2px solid rgba(76, 175, 80, 0.5);
            animation-delay: 0s;
        }
        
        .nectar-surge.buff {
            border: 2px solid rgba(255, 193, 7, 0.5);
            animation-delay: 2.7s;
        }
        
        .nectar-surge.growth {
            border: 2px solid rgba(139, 195, 74, 0.5);
            animation-delay: 5.3s;
        }
        
        @keyframes nectarSurge {
            0% {
                width: 0;
                height: 0;
                opacity: 0.7;
            }
            100% {
                width: 500px;
                height: 500px;
                opacity: 0;
            }
        }
        
        .point-particle {
            border-radius: 50%;
            pointer-events: none;
        }
    `;
    
    document.head.appendChild(style);
}

// Run after DOM is loaded and talent tree is initialized
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure talent tree is fully loaded
    setTimeout(initAnimations, 1000);
});