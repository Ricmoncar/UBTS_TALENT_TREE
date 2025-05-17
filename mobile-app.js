document.addEventListener('DOMContentLoaded', function() {
    // Only initialize mobile view on mobile devices
    if (window.innerWidth <= 768) {
        // Hide desktop elements immediately
        document.querySelectorAll('.talent-tree-container, .ultimate-talent, .connection-lines, .talent-info-panel, .talent-points-panel, .back-button, .title').forEach(el => {
            el.style.display = 'none';
        });
        
        // Wait a bit for Firebase and talent data to load
        setTimeout(initMobileApp, 500);
    }
    
    // Handle resize events
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-view')) {
            document.querySelectorAll('.talent-tree-container, .ultimate-talent, .connection-lines, .talent-info-panel, .talent-points-panel, .back-button, .title').forEach(el => {
                el.style.display = 'none';
            });
            initMobileApp();
        } else if (window.innerWidth > 768 && document.querySelector('.mobile-view')) {
            // Switch back to desktop view
            document.querySelector('.mobile-view').style.display = 'none';
            
            document.querySelectorAll('.talent-tree-container, .ultimate-talent, .connection-lines, .talent-info-panel, .talent-points-panel, .back-button, .title').forEach(el => {
                el.style.display = '';
            });
        }
    });
});

function initMobileApp() {
    // Don't initialize if already initialized
    if (document.querySelector('.mobile-view')) return;
    
    // Create standalone mobile interface
    createMobileView();
    
    // Mark body as loaded
    document.body.classList.add('mobile-loaded');
}

function createMobileView() {
    // Reset body styles
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = 'linear-gradient(to bottom, #0a0a14, #1a1a2e)';
    document.body.style.minHeight = '100vh';
    document.body.style.overflow = 'auto';
    
    // Main container
    const mobileView = document.createElement('div');
    mobileView.className = 'mobile-view';
    mobileView.style.position = 'absolute';
    mobileView.style.top = '0';
    mobileView.style.left = '0';
    mobileView.style.width = '100%';
    mobileView.style.minHeight = '100vh';
    mobileView.style.zIndex = '1000';
    mobileView.style.background = 'linear-gradient(to bottom, #0a0a14, #1a1a2e)';
    mobileView.style.color = 'white';
    mobileView.style.fontFamily = "'Cinzel', serif";
    
    // Create main components
    const header = createHeader();
    const tabNav = createTabNavigation();
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.style.paddingTop = '10px';
    
    // Create tab panels
    const braveryPanel = createBraveryPanel();
    const humilityPanel = createHumilityPanel();
    const mixedPanel = createMixedPanel();
    
    tabContent.appendChild(braveryPanel);
    tabContent.appendChild(humilityPanel);
    tabContent.appendChild(mixedPanel);
    
    // Assemble the mobile view
    mobileView.appendChild(header);
    mobileView.appendChild(tabNav);
    mobileView.appendChild(tabContent);
    
    // Add footer space
    const footerSpace = document.createElement('div');
    footerSpace.style.height = '80px';
    mobileView.appendChild(footerSpace);
    
    // Remove any existing mobile view
    const oldMobileView = document.querySelector('.mobile-view');
    if (oldMobileView) {
        oldMobileView.remove();
    }
    
    // Add to the body
    document.body.appendChild(mobileView);
    
    // Activate first tab
    setTimeout(() => activateTab('bravery'), 100);
}

function createHeader() {
    const header = document.createElement('div');
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.padding = '10px 0';
    header.style.background = 'rgba(10, 10, 20, 0.95)';
    header.style.backdropFilter = 'blur(5px)';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    header.style.zIndex = '100';
    header.style.borderBottom = '2px solid #8B4513';
    header.style.height = '60px'; // Fixed height for header
    
    // Title
    const title = document.createElement('div');
    title.textContent = 'BLACKJACK - SOUL TALENTS';
    title.style.fontFamily = "'Uncial Antiqua', 'Cinzel', serif";
    title.style.fontSize = '18px';
    title.style.textAlign = 'center';
    title.style.padding = '5px 0';
    title.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
    
    // Nav container
    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'space-between';
    navContainer.style.padding = '0 15px';
    navContainer.style.marginTop = '5px';
    
    // Back button
    const backButton = document.createElement('a');
    backButton.href = 'index.html';
    backButton.textContent = 'MENU';
    backButton.style.background = 'linear-gradient(135deg, #1e90ff, #4682b4)';
    backButton.style.color = 'white';
    backButton.style.padding = '5px 10px';
    backButton.style.borderRadius = '15px';
    backButton.style.textDecoration = 'none';
    backButton.style.fontWeight = 'bold';
    backButton.style.fontSize = '12px';
    backButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    
    // Points display
    const pointsDisplay = document.createElement('div');
    pointsDisplay.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(101, 67, 33, 0.7))';
    pointsDisplay.style.border = '2px solid #8B4513';
    pointsDisplay.style.borderRadius = '10px';
    pointsDisplay.style.padding = '2px 10px';
    pointsDisplay.style.textAlign = 'center';
    
    const pointsLabel = document.createElement('div');
    pointsLabel.textContent = 'POINTS';
    pointsLabel.style.fontSize = '11px';
    pointsLabel.style.color = '#FFD700';
    pointsLabel.style.fontWeight = 'bold';
    
    const pointsValue = document.createElement('div');
    pointsValue.id = 'mobile-available-points';
    pointsValue.textContent = '0';
    pointsValue.style.fontSize = '16px';
    pointsValue.style.fontWeight = 'bold';
    
    const pointsSpent = document.createElement('div');
    pointsSpent.style.fontSize = '10px';
    pointsSpent.style.color = '#ff7f50';
    pointsSpent.innerHTML = 'Spent: <span id="mobile-spent-points">0</span>';
    
    pointsDisplay.appendChild(pointsLabel);
    pointsDisplay.appendChild(pointsValue);
    pointsDisplay.appendChild(pointsSpent);
    
    navContainer.appendChild(backButton);
    navContainer.appendChild(pointsDisplay);
    
    header.appendChild(title);
    header.appendChild(navContainer);
    
    return header;
}

function createTabNavigation() {
    const tabNav = document.createElement('div');
    tabNav.style.display = 'flex';
    tabNav.style.marginTop = '70px'; // Increased margin to avoid header overlap
    tabNav.style.background = 'rgba(10, 10, 30, 0.9)';
    tabNav.style.borderBottom = '2px solid rgba(255, 255, 255, 0.2)';
    tabNav.style.position = 'sticky'; // Make tabs sticky
    tabNav.style.top = '60px'; // Position right below header
    tabNav.style.zIndex = '99'; // Below header but above content
    
    // Create tabs
    const braveryTab = createTab('BRAVERY', 'bravery');
    const humilityTab = createTab('HUMILITY', 'humility');
    const mixedTab = createTab('MIXED', 'mixed');
    
    tabNav.appendChild(braveryTab);
    tabNav.appendChild(humilityTab);
    tabNav.appendChild(mixedTab);
    
    return tabNav;
}

function createTab(name, type) {
    const tab = document.createElement('div');
    tab.textContent = name;
    tab.setAttribute('data-tab', type);
    tab.style.flex = '1';
    tab.style.textAlign = 'center';
    tab.style.padding = '10px 5px';
    tab.style.fontWeight = 'bold';
    tab.style.cursor = 'pointer';
    tab.style.transition = 'all 0.3s ease';
    tab.style.borderBottom = '3px solid transparent';
    tab.style.fontSize = '14px';
    tab.style.userSelect = 'none';
    
    tab.addEventListener('click', () => activateTab(type));
    
    return tab;
}

// Function to safely get emoji content from original talent nodes
function getEmoji(talentId) {
    // First try to get from the DOM
    const originalNode = document.querySelector(`[data-id="${talentId}"] .talent-icon`);
    if (originalNode && originalNode.textContent) {
        return originalNode.textContent;
    }
    
    // Fallback emoji mapping if DOM elements are not available
    const emojiMap = {
        'iron-fist': '⚔️',
        'critical-fighter': '⚡',
        'berserker-rage': '🔥',
        'burning-fists': '🔥',
        'parry-mastery': '🛡️',
        'bloodlust': '🩸',
        'soul-rend': '💀',
        'executioner': '⚰️',
        'swift-movement': '💨',
        'phantom-step': '👻',
        'mind-reading': '🧠',
        'evasive-maneuvers': '🌪️',
        'act-synergy': '🎭',
        'fortune-seeker': '💰',
        'soul-caller': '👥',
        'time-dilation': '⏰',
        'soul-bond': '🔗',
        'balance-keeper': '⚖️',
        'soul-harmony': '☯️',
        'soul-purity': '💎',
        'inner-strength': '💪',
        'soul-ascension': '✨'
    };
    
    return emojiMap[talentId] || '🔮';
}

// Get talent description safely
function getTalentDescription(talentId) {
    if (window.talents && window.talents[talentId]) {
        return window.talents[talentId].description || 'This talent enhances your abilities.';
    }
    
    // Fallback descriptions
    const descriptionMap = {
        'iron-fist': 'Imbue your fists with Bravery.',
        'critical-fighter': 'Master precision strikes against enemy weak points.',
        'berserker-rage': 'The lower your health, the stronger you become.',
        'burning-fists': 'Imbue your attacks with searing flame.',
        'parry-mastery': 'Perfect timing turns defense into offense.',
        'bloodlust': 'Each victory fuels your next assault.',
        'soul-rend': 'Your attacks tear at the enemy\'s soul.',
        'executioner': 'Deliver swift death to the wounded.',
        'swift-movement': 'Speed and grace. Outmaneuver your foes with enhanced agility.',
        'phantom-step': 'Become like smoke on the battlefield.',
        'mind-reading': 'Peer into the thoughts of others.',
        'evasive-maneuvers': 'Master the art of not being hit.',
        'act-synergy': 'Your ACT commands become more efficient.',
        'fortune-seeker': 'Lady Luck smiles upon you.',
        'soul-caller': 'Summon your spectral ally to fight alongside you.',
        'time-dilation': 'Bend the flow of time to your advantage.',
        'soul-bond': 'Forge a connection between your dual souls.',
        'balance-keeper': 'Maintain harmony between opposing forces.',
        'soul-harmony': 'Achieve perfect balance between your two souls.',
        'soul-purity': 'Cleanse your soul of all corruption.',
        'inner-strength': 'Draw power from within.',
        'soul-ascension': 'The ultimate unification of dual souls.'
    };
    
    return descriptionMap[talentId] || 'This talent enhances your abilities.';
}

function createBraveryPanel() {
    const panel = document.createElement('div');
    panel.className = 'tab-panel bravery';
    panel.id = 'bravery-panel';
    panel.style.display = 'none';
    
    // Panel header
    const header = document.createElement('h2');
    header.textContent = 'BRAVERY PATH';
    header.style.textAlign = 'center';
    header.style.fontFamily = "'Uncial Antiqua', serif";
    header.style.fontSize = '22px';
    header.style.margin = '15px 0';
    header.style.color = '#ff7b25';
    header.style.textShadow = '0 0 10px rgba(255, 123, 37, 0.5)';
    
    panel.appendChild(header);
    
    // Talent list
    const talentList = document.createElement('ul');
    talentList.style.listStyle = 'none';
    talentList.style.padding = '0 12px';
    talentList.style.margin = '0';
    
    // Add talents
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
    panel.style.display = 'none';
    
    // Panel header
    const header = document.createElement('h2');
    header.textContent = 'HUMILITY PATH';
    header.style.textAlign = 'center';
    header.style.fontFamily = "'Uncial Antiqua', serif";
    header.style.fontSize = '22px';
    header.style.margin = '15px 0';
    header.style.color = '#4285f4';
    header.style.textShadow = '0 0 10px rgba(66, 133, 244, 0.5)';
    
    panel.appendChild(header);
    
    // Soul showcase
    const showcase = createSoulShowcase();
    panel.appendChild(showcase);
    
    // Talent list
    const talentList = document.createElement('ul');
    talentList.style.listStyle = 'none';
    talentList.style.padding = '0 12px';
    talentList.style.margin = '0';
    
    // Add talents
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
    panel.style.display = 'none';
    
    // Panel header
    const header = document.createElement('h2');
    header.textContent = 'BALANCED PATH';
    header.style.textAlign = 'center';
    header.style.fontFamily = "'Uncial Antiqua', serif";
    header.style.fontSize = '22px';
    header.style.margin = '15px 0';
    header.style.color = '#a64aff';
    header.style.textShadow = '0 0 10px rgba(166, 74, 255, 0.5)';
    
    panel.appendChild(header);
    
    // Talent list
    const talentList = document.createElement('ul');
    talentList.style.listStyle = 'none';
    talentList.style.padding = '0 12px';
    talentList.style.margin = '0';
    
    // Add talents
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
    showcase.style.display = 'flex';
    showcase.style.justifyContent = 'center';
    showcase.style.margin = '25px 0';
    
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '120px';
    container.style.height = '120px';
    
    const glow = document.createElement('div');
    glow.style.position = 'absolute';
    glow.style.width = '100%';
    glow.style.height = '100%';
    glow.style.borderRadius = '50%';
    glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 70%)';
    glow.style.animation = 'soulPulse 3s infinite ease-in-out';
    
    // Add keyframes for glow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes soulPulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
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
    // Get talent data
    const talent = window.talents ? window.talents[talentId] : null;
    
    // Default values if talent data isn't available yet
    const name = talent ? talent.name : talentId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const icon = getEmoji(talentId);
    const currentRank = talent ? talent.currentRank : 0;
    const maxRank = talent ? talent.maxRank : 1;
    const description = getTalentDescription(talentId);
    
    // Create talent item
    const item = document.createElement('li');
    item.setAttribute('data-id', talentId);
    item.style.marginBottom = '15px';
    item.style.borderRadius = '10px';
    item.style.overflow = 'hidden';
    item.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.4)';
    
    // Set background based on type and state
    applyTalentItemStyles(item, type, currentRank >= maxRank, currentRank > 0);
    
    // Create header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.padding = '15px';
    header.style.cursor = 'pointer';
    header.style.position = 'relative';
    
    // Icon
    const iconEl = document.createElement('div');
    iconEl.textContent = icon;
    iconEl.style.fontSize = '26px';
    iconEl.style.marginRight = '15px';
    iconEl.style.filter = 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.5))';
    
    // Name
    const nameEl = document.createElement('div');
    nameEl.textContent = name;
    nameEl.style.fontWeight = 'bold';
    nameEl.style.fontSize = '18px';
    nameEl.style.flex = '1';
    nameEl.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.7)';
    
    // Rank
    const rankEl = document.createElement('div');
    rankEl.textContent = `${currentRank}/${maxRank}`;
    rankEl.style.background = 'rgba(0, 0, 0, 0.4)';
    rankEl.style.padding = '5px 10px';
    rankEl.style.borderRadius = '12px';
    rankEl.style.fontSize = '14px';
    rankEl.style.textAlign = 'center';
    rankEl.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, 0.3)';
    
    // Expand indicator
    const expandEl = document.createElement('div');
    expandEl.textContent = '▼';
    expandEl.style.marginLeft = '10px';
    expandEl.style.fontSize = '18px';
    expandEl.style.opacity = '0.7';
    expandEl.style.transition = 'transform 0.3s ease';
    
    // Content container (initially hidden)
    const content = document.createElement('div');
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease';
    content.style.background = 'rgba(0, 0, 0, 0.3)';
    content.style.padding = '0 15px';
    
    // Description
    const descriptionEl = document.createElement('div');
    descriptionEl.innerHTML = description.replace(/\n/g, '<br>');
    descriptionEl.style.margin = '15px 0';
    descriptionEl.style.fontStyle = 'italic';
    descriptionEl.style.fontSize = '15px';
    descriptionEl.style.lineHeight = '1.5';
    descriptionEl.style.padding = '10px';
    descriptionEl.style.background = 'rgba(0, 0, 0, 0.2)';
    descriptionEl.style.borderRadius = '8px';
    
    content.appendChild(descriptionEl);
    
    // Effects
    if (talent && talent.effects) {
        if (currentRank > 0) {
            const currentHeader = document.createElement('div');
            currentHeader.textContent = 'Current Effect:';
            currentHeader.style.fontSize = '16px';
            currentHeader.style.fontWeight = 'bold';
            currentHeader.style.margin = '15px 0 10px';
            content.appendChild(currentHeader);
            
            const currentEffect = document.createElement('div');
            currentEffect.textContent = talent.effects[currentRank - 1];
            currentEffect.style.color = '#4CAF50';
            currentEffect.style.marginBottom = '10px';
            currentEffect.style.paddingLeft = '20px';
            currentEffect.style.position = 'relative';
            currentEffect.style.fontSize = '14px';
            currentEffect.style.lineHeight = '1.4';
            content.appendChild(currentEffect);
        }
        
        if (currentRank < maxRank) {
            const nextHeader = document.createElement('div');
            nextHeader.textContent = currentRank > 0 ? 'Next Rank Effect:' : 'First Rank Effect:';
            nextHeader.style.fontSize = '16px';
            nextHeader.style.fontWeight = 'bold';
            nextHeader.style.margin = '15px 0 10px';
            content.appendChild(nextHeader);
            
            const nextEffect = document.createElement('div');
            nextEffect.textContent = talent.effects[currentRank];
            nextEffect.style.color = '#FFD700';
            nextEffect.style.marginBottom = '10px';
            nextEffect.style.paddingLeft = '20px';
            nextEffect.style.position = 'relative';
            nextEffect.style.fontSize = '14px';
            nextEffect.style.lineHeight = '1.4';
            content.appendChild(nextEffect);
        }
    }
    
    // Requirements
    if (talent && talent.requirements && talent.requirements.length > 0) {
        const reqContainer = document.createElement('div');
        reqContainer.style.margin = '15px 0';
        reqContainer.style.padding = '10px';
        reqContainer.style.background = 'rgba(0, 0, 0, 0.2)';
        reqContainer.style.borderRadius = '8px';
        
        const reqHeader = document.createElement('div');
        reqHeader.textContent = 'Requirements:';
        reqHeader.style.fontWeight = 'bold';
        reqHeader.style.marginBottom = '5px';
        reqContainer.appendChild(reqHeader);
        
        talent.requirements.forEach(req => {
            const reqTalent = window.talents ? window.talents[req.talent] : null;
            const isMet = reqTalent && reqTalent.currentRank >= req.minRank;
            
            const reqItem = document.createElement('div');
            reqItem.style.display = 'flex';
            reqItem.style.alignItems = 'center';
            reqItem.style.margin = '5px 0';
            reqItem.style.color = isMet ? '#4CAF50' : '#FF6B6B';
            
            const icon = document.createElement('span');
            icon.textContent = isMet ? '✓' : '✗';
            icon.style.marginRight = '8px';
            
            const text = document.createElement('span');
            text.textContent = `${reqTalent ? reqTalent.name : req.talent} Rank ${req.minRank}`;
            
            reqItem.appendChild(icon);
            reqItem.appendChild(text);
            reqContainer.appendChild(reqItem);
        });
        
        content.appendChild(reqContainer);
    }
    
    // Add/Remove buttons
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.justifyContent = 'space-between';
    actions.style.margin = '15px 0';
    
    const addButton = document.createElement('div');
    addButton.textContent = 'Add Point';
    addButton.setAttribute('data-id', talentId);
    addButton.style.flex = '1';
    addButton.style.margin = '0 5px';
    addButton.style.padding = '12px 0';
    addButton.style.borderRadius = '5px';
    addButton.style.textAlign = 'center';
    addButton.style.fontWeight = 'bold';
    addButton.style.fontSize = '16px';
    addButton.style.cursor = 'pointer';
    addButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    addButton.style.background = 'linear-gradient(135deg, #228b22, #32cd32)';
    addButton.style.color = 'white';
    
    if (!talent || !canUnlockTalent(talentId)) {
        addButton.style.background = '#444';
        addButton.style.color = '#888';
        addButton.style.opacity = '0.7';
        addButton.style.cursor = 'not-allowed';
    }
    
    const removeButton = document.createElement('div');
    removeButton.textContent = 'Remove Point';
    removeButton.setAttribute('data-id', talentId);
    removeButton.style.flex = '1';
    removeButton.style.margin = '0 5px';
    removeButton.style.padding = '12px 0';
    removeButton.style.borderRadius = '5px';
    removeButton.style.textAlign = 'center';
    removeButton.style.fontWeight = 'bold';
    removeButton.style.fontSize = '16px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    removeButton.style.background = 'linear-gradient(135deg, #8b0000, #cd5c5c)';
    removeButton.style.color = 'white';
    
    if (!talent || talent.currentRank <= 0 || !canRemoveTalentPoint(talentId)) {
        removeButton.style.background = '#444';
        removeButton.style.color = '#888';
        removeButton.style.opacity = '0.7';
        removeButton.style.cursor = 'not-allowed';
    }
    
    actions.appendChild(addButton);
    actions.appendChild(removeButton);
    content.appendChild(actions);
    
    // Add lock indicator if needed
    if (!talent || (talent && !canUnlockTalent(talentId) && currentRank === 0)) {
        const lock = document.createElement('div');
        lock.textContent = '🔒';
        lock.style.position = 'absolute';
        lock.style.top = '10px';
        lock.style.right = '10px';
        lock.style.width = '20px';
        lock.style.height = '20px';
        lock.style.background = 'rgba(0, 0, 0, 0.5)';
        lock.style.borderRadius = '50%';
        lock.style.display = 'flex';
        lock.style.alignItems = 'center';
        lock.style.justifyContent = 'center';
        lock.style.fontSize = '12px';
        header.appendChild(lock);
    }
    
    // Assemble talent item
    header.appendChild(iconEl);
    header.appendChild(nameEl);
    header.appendChild(rankEl);
    header.appendChild(expandEl);
    
    item.appendChild(header);
    item.appendChild(content);
    
    // Add expand/collapse functionality
    header.addEventListener('click', () => {
        if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
            content.style.maxHeight = '500px';
            content.style.padding = '15px';
            content.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
            expandEl.style.transform = 'rotate(180deg)';
        } else {
            content.style.maxHeight = '0';
            content.style.padding = '0 15px';
            content.style.borderTop = 'none';
            expandEl.style.transform = 'rotate(0deg)';
        }
    });
    
    return item;
}

function applyTalentItemStyles(item, type, isMaxRank, isUnlocked) {
    switch (type) {
        case 'bravery':
            if (isUnlocked) {
                item.style.background = 'linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(101, 67, 33, 0.9))';
                item.style.border = '2px solid #ffd700';
            } else {
                item.style.background = 'linear-gradient(135deg, rgba(70, 35, 0, 0.9), rgba(50, 25, 0, 0.9))';
                item.style.border = '1px solid #ff7b25';
            }
            
            if (isMaxRank) {
                item.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            }
            break;
            
        case 'humility':
            if (isUnlocked) {
                item.style.background = 'linear-gradient(135deg, rgba(30, 80, 140, 0.9), rgba(30, 100, 180, 0.9))';
                item.style.border = '2px solid #87ceeb';
            } else {
                item.style.background = 'linear-gradient(135deg, rgba(0, 40, 80, 0.9), rgba(0, 30, 60, 0.9))';
                item.style.border = '1px solid #4285f4';
            }
            
            if (isMaxRank) {
                item.style.boxShadow = '0 0 15px rgba(135, 206, 235, 0.5)';
            }
            break;
            
        case 'mixed':
            if (isUnlocked) {
                item.style.background = 'linear-gradient(135deg, rgba(90, 30, 140, 0.9), rgba(70, 20, 120, 0.9))';
                item.style.border = '2px solid #e6e6fa';
            } else {
                item.style.background = 'linear-gradient(135deg, rgba(60, 20, 80, 0.9), rgba(40, 10, 50, 0.9))';
                item.style.border = '1px solid #a64aff';
            }
            
            if (isMaxRank) {
                item.style.boxShadow = '0 0 15px rgba(230, 230, 250, 0.5)';
            }
            break;
    }
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
    // Get all tabs and panels
    const tabs = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('.tab-panel');
    
    // Deactivate all
    tabs.forEach(tab => {
        tab.style.borderBottom = '3px solid transparent';
        tab.style.background = 'transparent';
        tab.style.color = 'white';
    });
    
    panels.forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Activate selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedPanel = document.getElementById(`${tabName}-panel`);
    
    if (selectedTab && selectedPanel) {
        // Apply tab styles based on type
        switch(tabName) {
            case 'bravery':
                selectedTab.style.borderBottom = '3px solid #ff7b25';
                selectedTab.style.background = 'rgba(139, 69, 19, 0.4)';
                selectedTab.style.color = '#ffa500';
                break;
            case 'humility':
                selectedTab.style.borderBottom = '3px solid #4285f4';
                selectedTab.style.background = 'rgba(70, 130, 180, 0.4)';
                selectedTab.style.color = '#87ceeb';
                break;
            case 'mixed':
                selectedTab.style.borderBottom = '3px solid #a64aff';
                selectedTab.style.background = 'rgba(138, 43, 226, 0.4)';
                selectedTab.style.color = '#d8bfd8';
                break;
        }
        
        selectedPanel.style.display = 'block';
    }
}

// Listen for click events on add/remove buttons
document.addEventListener('click', function(e) {
    // Check if the click was on an add button that's not disabled
    if (e.target.textContent === 'Add Point' && 
        e.target.style.background.includes('32cd32')) {
        
        const talentId = e.target.getAttribute('data-id');
        if (window.talentClick) {
            window.talentClick(talentId);
            updateUI();
        }
    } 
    // Check if the click was on a remove button that's not disabled
    else if (e.target.textContent === 'Remove Point' && 
             e.target.style.background.includes('cd5c5c')) {
        
        const talentId = e.target.getAttribute('data-id');
        if (window.removeTalentPoint) {
            window.removeTalentPoint(talentId);
            updateUI();
        }
    }
});

// Update all UI elements
function updateUI() {
    // Skip if no talent data available
    if (!window.talents) return;
    
    document.querySelectorAll('[data-id]').forEach(item => {
        const talentId = item.getAttribute('data-id');
        const talent = window.talents[talentId];
        
        if (!talent) return;
        
        // Update talent item styling
        if (item.tagName === 'LI') { // Only update styling for our mobile list items
            applyTalentItemStyles(item, 
                item.classList.contains('bravery') ? 'bravery' : 
                item.classList.contains('humility') ? 'humility' : 'mixed',
                talent.currentRank >= talent.maxRank,
                talent.currentRank > 0
            );
            
            // Update rank display
            const rankDisplay = item.querySelector('div > div:nth-child(3)');
            if (rankDisplay) {
                rankDisplay.textContent = `${talent.currentRank}/${talent.maxRank}`;
            }
            
            // Update add button
            const addButton = Array.from(item.querySelectorAll('div')).find(el => el.textContent === 'Add Point');
            if (addButton) {
                if (canUnlockTalent(talentId)) {
                    addButton.style.background = 'linear-gradient(135deg, #228b22, #32cd32)';
                    addButton.style.color = 'white';
                    addButton.style.opacity = '1';
                    addButton.style.cursor = 'pointer';
                } else {
                    addButton.style.background = '#444';
                    addButton.style.color = '#888';
                    addButton.style.opacity = '0.7';
                    addButton.style.cursor = 'not-allowed';
                }
            }
            
            // Update remove button
            const removeButton = Array.from(item.querySelectorAll('div')).find(el => el.textContent === 'Remove Point');
            if (removeButton) {
                if (talent.currentRank > 0 && canRemoveTalentPoint(talentId)) {
                    removeButton.style.background = 'linear-gradient(135deg, #8b0000, #cd5c5c)';
                    removeButton.style.color = 'white';
                    removeButton.style.opacity = '1';
                    removeButton.style.cursor = 'pointer';
                } else {
                    removeButton.style.background = '#444';
                    removeButton.style.color = '#888';
                    removeButton.style.opacity = '0.7';
                    removeButton.style.cursor = 'not-allowed';
                }
            }
            
            // Update lock indicator
            const header = item.querySelector('div:first-child');
            const lockIndicator = header.querySelector('div:last-child');
            if (lockIndicator && lockIndicator.textContent === '🔒') {
                if (canUnlockTalent(talentId) || talent.currentRank > 0) {
                    lockIndicator.remove();
                }
            } else if (talent.currentRank === 0 && !canUnlockTalent(talentId) && !lockIndicator) {
                const lock = document.createElement('div');
                lock.textContent = '🔒';
                lock.style.position = 'absolute';
                lock.style.top = '10px';
                lock.style.right = '10px';
                lock.style.width = '20px';
                lock.style.height = '20px';
                lock.style.background = 'rgba(0, 0, 0, 0.5)';
                lock.style.borderRadius = '50%';
                lock.style.display = 'flex';
                lock.style.alignItems = 'center';
                lock.style.justifyContent = 'center';
                lock.style.fontSize = '12px';
                header.appendChild(lock);
            }
        }
    });
    
    // Update points display
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

// Periodic updates for talent states
setInterval(updateUI, 1000);