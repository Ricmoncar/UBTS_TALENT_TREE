// mobile-app-v2.js - Improved mobile interface

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize mobile view on mobile devices
    if (window.innerWidth <= 768) {
        setTimeout(initMobileApp, 800);
    }
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-view')) {
            initMobileApp();
        } else if (window.innerWidth > 768 && document.querySelector('.mobile-view')) {
            // If window is resized to desktop, simply hide mobile view
            document.querySelector('.mobile-view').style.display = 'none';
            document.querySelector('.talent-tree-container').style.display = 'block';
            document.querySelector('.ultimate-talent').style.display = 'block';
            document.querySelector('.talent-info-panel').style.display = 'block';
        }
    });
});

function initMobileApp() {
    // Don't initialize if already initialized
    if (document.querySelector('.mobile-view')) return;
    
    createMobileView();
    bindEvents();
}

function createMobileView() {
    // Main container
    const mobileView = document.createElement('div');
    mobileView.className = 'mobile-view';
    
    // Create header
    const header = createHeader();
    mobileView.appendChild(header);
    
    // Create tab navigation
    const tabNav = createTabNavigation();
    mobileView.appendChild(tabNav);
    
    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    
    // Create tab panels
    const braveryPanel = createBraveryPanel();
    const humilityPanel = createHumilityPanel();
    const mixedPanel = createMixedPanel();
    
    tabContent.appendChild(braveryPanel);
    tabContent.appendChild(humilityPanel);
    tabContent.appendChild(mixedPanel);
    mobileView.appendChild(tabContent);
    
    // Add a footer spacer
    const footerSpacer = document.createElement('div');
    footerSpacer.className = 'footer-spacer';
    mobileView.appendChild(footerSpacer);
    
    // Add the mobile view to the page
    document.body.appendChild(mobileView);
    
    // Hide the original content
    document.querySelector('.talent-tree-container').style.display = 'none';
    document.querySelector('.ultimate-talent').style.display = 'none';
    document.querySelector('.talent-info-panel').style.display = 'none';
    
    // Activate first tab (bravery by default)
    activateTab('bravery');
}

function createHeader() {
    const header = document.createElement('div');
    header.className = 'mobile-header';
    
    // Title
    const title = document.createElement('div');
    title.className = 'mobile-title';
    title.textContent = 'BLACKJACK - SOUL TALENTS';
    header.appendChild(title);
    
    // Navigation buttons
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';
    
    // Back to menu button
    const backToMenu = document.createElement('a');
    backToMenu.className = 'back-to-menu';
    backToMenu.href = 'index.html';
    backToMenu.textContent = 'BACK TO MENU';
    navButtons.appendChild(backToMenu);
    
    // Talent points display
    const pointsDisplay = document.createElement('div');
    pointsDisplay.className = 'mobile-points-display';
    pointsDisplay.innerHTML = `
        <span class="points-label">POINTS</span>
        <span class="points-value" id="mobile-available-points">0</span>
        <span class="points-spent">Spent: <span id="mobile-spent-points">0</span></span>
    `;
    navButtons.appendChild(pointsDisplay);
    
    header.appendChild(navButtons);
    
    return header;
}

function createTabNavigation() {
    const tabNav = document.createElement('div');
    tabNav.className = 'tab-navigation';
    
    // Bravery tab
    const braveryTab = document.createElement('div');
    braveryTab.className = 'tab bravery';
    braveryTab.setAttribute('data-tab', 'bravery');
    braveryTab.textContent = 'BRAVERY';
    braveryTab.addEventListener('click', () => activateTab('bravery'));
    
    // Humility tab
    const humilityTab = document.createElement('div');
    humilityTab.className = 'tab humility';
    humilityTab.setAttribute('data-tab', 'humility');
    humilityTab.textContent = 'HUMILITY';
    humilityTab.addEventListener('click', () => activateTab('humility'));
    
    // Mixed tab
    const mixedTab = document.createElement('div');
    mixedTab.className = 'tab mixed';
    mixedTab.setAttribute('data-tab', 'mixed');
    mixedTab.textContent = 'MIXED';
    mixedTab.addEventListener('click', () => activateTab('mixed'));
    
    tabNav.appendChild(braveryTab);
    tabNav.appendChild(humilityTab);
    tabNav.appendChild(mixedTab);
    
    return tabNav;
}

function createBraveryPanel() {
    const panel = document.createElement('div');
    panel.className = 'tab-panel bravery';
    panel.id = 'bravery-panel';
    
    // Add header
    const header = document.createElement('h2');
    header.className = 'tab-header bravery';
    header.textContent = 'BRAVERY PATH';
    panel.appendChild(header);
    
    // Create talent list
    const talentList = document.createElement('ul');
    talentList.className = 'talent-list';
    
    // Add bravery talents
    const braveryTalents = [
        'iron-fist',
        'critical-fighter',
        'berserker-rage',
        'burning-fists',
        'parry-mastery',
        'bloodlust',
        'soul-rend',
        'executioner'
    ];
    
    braveryTalents.forEach(talentId => {
        const talent = window.talents ? window.talents[talentId] : null;
        const talentItem = createTalentItem(talentId, 'bravery');
        talentList.appendChild(talentItem);
    });
    
    panel.appendChild(talentList);
    
    return panel;
}

function createHumilityPanel() {
    const panel = document.createElement('div');
    panel.className = 'tab-panel humility';
    panel.id = 'humility-panel';
    
    // Add header
    const header = document.createElement('h2');
    header.className = 'tab-header humility';
    header.textContent = 'HUMILITY PATH';
    panel.appendChild(header);
    
    // Soul showcase for humility path
    const showcase = createSoulShowcase();
    panel.appendChild(showcase);
    
    // Create talent list
    const talentList = document.createElement('ul');
    talentList.className = 'talent-list';
    
    // Add humility talents
    const humilityTalents = [
        'swift-movement',
        'phantom-step',
        'mind-reading',
        'evasive-maneuvers',
        'act-synergy',
        'fortune-seeker',
        'soul-caller',
        'time-dilation'
    ];
    
    humilityTalents.forEach(talentId => {
        const talentItem = createTalentItem(talentId, 'humility');
        talentList.appendChild(talentItem);
    });
    
    panel.appendChild(talentList);
    
    return panel;
}

function createMixedPanel() {
    const panel = document.createElement('div');
    panel.className = 'tab-panel mixed';
    panel.id = 'mixed-panel';
    
    // Add header
    const header = document.createElement('h2');
    header.className = 'tab-header mixed';
    header.textContent = 'BALANCED PATH';
    panel.appendChild(header);
    
    // Create talent list
    const talentList = document.createElement('ul');
    talentList.className = 'talent-list';
    
    // Add mixed talents, starting with the ultimate
    const mixedTalents = [
        'soul-ascension',
        'inner-strength',
        'soul-bond',
        'balance-keeper',
        'soul-harmony',
        'soul-purity'
    ];
    
    mixedTalents.forEach(talentId => {
        const talentItem = createTalentItem(talentId, 'mixed');
        talentList.appendChild(talentItem);
    });
    
    panel.appendChild(talentList);
    
    return panel;
}

function createSoulShowcase() {
    const showcase = document.createElement('div');
    showcase.className = 'soul-showcase';
    
    const container = document.createElement('div');
    container.className = 'soul-container-mobile';
    
    const glow = document.createElement('div');
    glow.className = 'soul-glow-mobile';
    
    const soul = document.createElement('div');
    soul.innerHTML = `
        <svg viewBox="0 0 100 100">
            <defs>
                <linearGradient id="mobileBraveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ff8c00;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#ff6600;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="mobileHumilityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#1e90ff;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#4682b4;stop-opacity:1" />
                </linearGradient>
            </defs>
            <path d="M50,15 L60,40 L85,40 L65,55 L70,80 L50,65 L50,50 Z" fill="url(#mobileBraveGrad)" />
            <path d="M50,15 L40,40 L15,40 L35,55 L30,80 L50,65 L50,50 Z" fill="url(#mobileHumilityGrad)" />
        </svg>
    `;
    
    container.appendChild(glow);
    container.appendChild(soul);
    showcase.appendChild(container);
    
    return showcase;
}

function createTalentItem(talentId, type) {
    // Get talent data from global talents object if available
    const talent = window.talents ? window.talents[talentId] : null;
    
    // Default values if talent data isn't available yet
    const name = talent ? talent.name : talentId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const icon = document.querySelector(`[data-id="${talentId}"] .talent-icon`)?.textContent || '?';
    const currentRank = talent ? talent.currentRank : 0;
    const maxRank = talent ? talent.maxRank : 1;
    const description = talent ? talent.description.replace(/\n/g, '<br>') : 'This talent enhances your abilities.';
    
    // Classes based on talent state
    const classes = [
        'talent-item',
        type,
        currentRank > 0 ? 'unlocked' : '',
        currentRank >= maxRank ? 'max-rank' : '',
        !talent || (talent && !canUnlockTalent(talentId)) ? 'locked' : ''
    ].filter(Boolean).join(' ');
    
    // Create element
    const item = document.createElement('li');
    item.className = classes;
    item.setAttribute('data-id', talentId);
    
    // Create header - always visible part
    const header = document.createElement('div');
    header.className = 'talent-header';
    header.innerHTML = `
        <div class="talent-icon">${icon}</div>
        <div class="talent-name">${name}</div>
        <div class="talent-rank">${currentRank}/${maxRank}</div>
        <div class="expand-indicator">▼</div>
    `;
    
    // Add lock indicator if needed
    if (!talent || (talent && !canUnlockTalent(talentId) && currentRank === 0)) {
        const lock = document.createElement('div');
        lock.className = 'locked-indicator';
        lock.innerHTML = '🔒';
        header.appendChild(lock);
    }
    
    // Create content - hidden by default, shown when clicked
    const content = document.createElement('div');
    content.className = 'talent-content';
    
    // Description
    const descriptionEl = document.createElement('div');
    descriptionEl.className = 'talent-description';
    descriptionEl.innerHTML = description;
    content.appendChild(descriptionEl);
    
    // Effects section
    if (talent && talent.effects && (currentRank > 0 || currentRank < maxRank)) {
        const effectsHeader = document.createElement('div');
        effectsHeader.className = 'effects-header';
        effectsHeader.textContent = 'Effects:';
        content.appendChild(effectsHeader);
        
        // Current effect
        if (currentRank > 0) {
            const currentEffectEl = document.createElement('div');
            currentEffectEl.className = 'talent-effect current-effect';
            currentEffectEl.textContent = talent.effects[currentRank - 1];
            content.appendChild(currentEffectEl);
        }
        
        // Next effect
        if (currentRank < maxRank) {
            const nextEffectEl = document.createElement('div');
            nextEffectEl.className = 'talent-effect next-effect';
            nextEffectEl.textContent = talent.effects[currentRank];
            
            // Add label for next effect
            const nextLabel = document.createElement('strong');
            nextLabel.textContent = currentRank > 0 ? 'Next Rank: ' : 'First Rank: ';
            nextEffectEl.prepend(nextLabel);
            
            content.appendChild(nextEffectEl);
        }
    }
    
    // Requirements
    if (talent && talent.requirements && talent.requirements.length > 0) {
        const requirementsEl = document.createElement('div');
        requirementsEl.className = 'talent-requirements';
        
        let requirementsText = '<strong>Requirements:</strong><br>';
        talent.requirements.forEach(req => {
            const reqTalent = window.talents ? window.talents[req.talent] : null;
            const isMet = reqTalent && reqTalent.currentRank >= req.minRank;
            const style = isMet ? 'color: #4CAF50;' : 'color: #FF6B6B;';
            const checkMark = isMet ? '✓' : '✗';
            requirementsText += `<div class="requirement-item">
                <span class="requirement-icon" style="${style}">${checkMark}</span>
                <span style="${style}">${reqTalent ? reqTalent.name : req.talent} Rank ${req.minRank}</span>
            </div>`;
        });
        
        requirementsEl.innerHTML = requirementsText;
        content.appendChild(requirementsEl);
    }
    
    // Actions
    const actionsEl = document.createElement('div');
    actionsEl.className = 'talent-actions';
    
    // Add point button
    const addButton = document.createElement('div');
    addButton.className = `talent-button add-point ${(!talent || !canUnlockTalent(talentId)) ? 'disabled' : ''}`;
    addButton.textContent = 'Add Point';
    addButton.setAttribute('data-id', talentId);
    actionsEl.appendChild(addButton);
    
    // Remove point button
    const removeButton = document.createElement('div');
    removeButton.className = `talent-button remove-point ${(!talent || talent.currentRank <= 0 || !canRemoveTalentPoint(talentId)) ? 'disabled' : ''}`;
    removeButton.textContent = 'Remove Point';
    removeButton.setAttribute('data-id', talentId);
    actionsEl.appendChild(removeButton);
    
    content.appendChild(actionsEl);
    
    // Assemble and return
    item.appendChild(header);
    item.appendChild(content);
    
    return item;
}

function canUnlockTalent(talentId) {
    if (!window.talents) return false;
    
    const talent = window.talents[talentId];
    if (!talent) return false;
    
    // Check if already at max rank
    if (talent.currentRank >= talent.maxRank) return false;
    
    // Check if we have enough points
    if (window.gameState && window.gameState.availablePoints < 1) return false;
    
    // If this is an upgrade (already have at least rank 1), no need to check requirements
    if (talent.currentRank > 0) return true;
    
    // Check requirements (only for initial unlock)
    for (const req of talent.requirements) {
        const reqTalent = window.talents[req.talent];
        if (!reqTalent || reqTalent.currentRank < req.minRank) {
            return false;
        }
    }
    
    return true;
}

function canRemoveTalentPoint(talentId) {
    if (!window.talents) return false;
    
    const talent = window.talents[talentId];
    if (!talent) return false;
    
    // Check if we can remove a point
    if (talent.currentRank <= 0) {
        return false; // Nothing to remove
    }
    
    // Check if removing this point would break requirements for other talents
    for (const id in window.talents) {
        const otherTalent = window.talents[id];
        
        // Skip talents that aren't unlocked
        if (otherTalent.currentRank === 0) continue;
        
        // Check if this talent is a requirement for the other talent
        for (const req of otherTalent.requirements) {
            if (req.talent === talentId && talent.currentRank - 1 < req.minRank) {
                return false; // This would break a requirement
            }
        }
    }
    
    return true;
}

function activateTab(tabName) {
    // Deactivate all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Activate selected tab
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    document.querySelector(`#${tabName}-panel`).classList.add('active');
}

function bindEvents() {
    // Update available points display
    function updatePointsDisplay() {
        if (window.gameState) {
            // Update available points
            const availablePointsDisplay = document.getElementById('mobile-available-points');
            if (availablePointsDisplay) {
                availablePointsDisplay.textContent = window.gameState.availablePoints;
            }
            
            // Update spent points
            const spentPointsDisplay = document.getElementById('mobile-spent-points');
            if (spentPointsDisplay) {
                spentPointsDisplay.textContent = window.gameState.spentPoints;
            }
        }
    }
    
    // Update talent items based on talent state
    function updateTalentItems() {
        document.querySelectorAll('.talent-item').forEach(item => {
            const talentId = item.getAttribute('data-id');
            if (!window.talents) return;
            
            const talent = window.talents[talentId];
            
            if (talent) {
                // Update rank display
                const rankDisplay = item.querySelector('.talent-rank');
                if (rankDisplay) {
                    rankDisplay.textContent = `${talent.currentRank}/${talent.maxRank}`;
                }
                
                // Update classes
                if (talent.currentRank > 0) {
                    item.classList.add('unlocked');
                    if (talent.currentRank >= talent.maxRank) {
                        item.classList.add('max-rank');
                    } else {
                        item.classList.remove('max-rank');
                    }
                } else {
                    item.classList.remove('unlocked', 'max-rank');
                }
                
                // Update lock indicator
                const lockIndicator = item.querySelector('.locked-indicator');
                if (talent.currentRank === 0 && !canUnlockTalent(talentId)) {
                    if (!lockIndicator) {
                        const lock = document.createElement('div');
                        lock.className = 'locked-indicator';
                        lock.innerHTML = '🔒';
                        item.querySelector('.talent-header').appendChild(lock);
                    }
                } else if (lockIndicator) {
                    lockIndicator.remove();
                }
                
                // Update button states
                const addButton = item.querySelector('.add-point');
                const removeButton = item.querySelector('.remove-point');
                
                if (addButton) {
                    if (canUnlockTalent(talentId)) {
                        addButton.classList.remove('disabled');
                    } else {
                        addButton.classList.add('disabled');
                    }
                }
                
                if (removeButton) {
                    if (talent.currentRank > 0 && canRemoveTalentPoint(talentId)) {
                        removeButton.classList.remove('disabled');
                    } else {
                        removeButton.classList.add('disabled');
                    }
                }
            }
        });
        
        updatePointsDisplay();
    }
    
    // Listen for click events on talent headers to expand/collapse
    document.addEventListener('click', function(e) {
        if (e.target.closest('.talent-header')) {
            const item = e.target.closest('.talent-item');
            const content = item.querySelector('.talent-content');
            
            // Toggle this content
            content.classList.toggle('expanded');
        }
    });
    
    // Listen for click events on add/remove buttons
    document.addEventListener('click', function(e) {
        const addButton = e.target.closest('.add-point:not(.disabled)');
        const removeButton = e.target.closest('.remove-point:not(.disabled)');
        
        if (addButton) {
            const talentId = addButton.getAttribute('data-id');
            if (window.talentClick) {
                window.talentClick(talentId);
                updateTalentItems();
            }
        } else if (removeButton) {
            const talentId = removeButton.getAttribute('data-id');
            if (window.removeTalentPoint) {
                window.removeTalentPoint(talentId);
                updateTalentItems();
            }
        }
    });
    
    // Periodic updates for talent states (to sync with desktop view changes)
    setInterval(updateTalentItems, 1000);
    
    // Initial update
    updateTalentItems();
}