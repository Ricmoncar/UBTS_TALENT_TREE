// mobile-view.js - Add this to your project
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all scripts to load
    setTimeout(initMobileView, 800);
});

function initMobileView() {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        createMobileView();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const currentMobile = window.innerWidth <= 768;
        
        // Toggle views based on screen size
        if (currentMobile && !isMobile) {
            createMobileView();
        } else if (!currentMobile && isMobile) {
            removeMobileView();
        }
    });
}

function createMobileView() {
    // Don't create mobile view if it already exists
    if (document.querySelector('.mobile-talent-view')) {
        return;
    }
    
    // Create container for mobile view
    const mobileView = document.createElement('div');
    mobileView.className = 'mobile-talent-view';
    
    // Add mobile soul
    const mobileSoulHtml = `
        <div class="mobile-soul-container">
            <div class="mobile-soul">
                <div class="mobile-soul-glow"></div>
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
            </div>
        </div>
    `;
    
    // Add ultimate talent
    const ultimateTalentHtml = createMobileBranch('SOUL ASCENSION', 'mixed', ['soul-ascension']);
    
    // Add the three branches
    const braveryBranchHtml = createMobileBranch('BRAVERY PATH', 'bravery', [
        'iron-fist', 
        'critical-fighter', 
        'berserker-rage', 
        'burning-fists', 
        'parry-mastery', 
        'bloodlust', 
        'soul-rend', 
        'executioner'
    ]);
    
    const humilityBranchHtml = createMobileBranch('HUMILITY PATH', 'humility', [
        'swift-movement', 
        'phantom-step', 
        'mind-reading', 
        'evasive-maneuvers', 
        'act-synergy', 
        'fortune-seeker', 
        'soul-caller', 
        'time-dilation'
    ]);
    
    const mixedBranchHtml = createMobileBranch('BALANCED PATH', 'mixed', [
        'soul-bond', 
        'balance-keeper', 
        'soul-harmony', 
        'soul-purity', 
        'inner-strength'
    ]);
    
    // Assemble mobile view
    mobileView.innerHTML = mobileSoulHtml + ultimateTalentHtml + braveryBranchHtml + humilityBranchHtml + mixedBranchHtml;
    
    // Add mobile view to page
    const treeContainer = document.querySelector('.talent-tree-container');
    treeContainer.parentNode.insertBefore(mobileView, treeContainer);
    
    // Add class to desktop view
    treeContainer.classList.add('desktop-talent-view');
    
    // Create modal for talent details
    createMobileTalentModal();
    
    // Set up event listeners for mobile talent nodes
    setupMobileTalentEvents();
}

function createMobileBranch(title, type, talentIds) {
    // Start branch container
    let branchHtml = `
        <div class="mobile-branch ${type}">
            <h2 class="branch-title ${type}">${title}</h2>
            <div class="mobile-talent-grid">
    `;
    
    // Add each talent node
    talentIds.forEach(id => {
        const talent = window.talents ? window.talents[id] : null;
        const isUltimate = id === 'soul-ascension';
        
        // Default values if talent data isn't available yet
        const name = talent ? talent.name : id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const icon = document.querySelector(`[data-id="${id}"] .talent-icon`)?.textContent || '?';
        const currentRank = talent ? talent.currentRank : 0;
        const maxRank = talent ? talent.maxRank : 1;
        const requirements = talent ? talent.requirements : [];
        
        // Classes based on talent state
        const classes = [
            'mobile-talent-node',
            type,
            currentRank > 0 ? 'unlocked' : '',
            currentRank >= maxRank ? 'max-rank' : '',
            isUltimate ? 'ultimate' : ''
        ].filter(Boolean).join(' ');
        
        // Requirements text
        let requirementsText = '';
        if (requirements.length > 0 && talent) {
            const reqNames = requirements.map(req => {
                const reqTalent = window.talents[req.talent];
                return reqTalent ? `${reqTalent.name} (${req.minRank})` : '';
            }).filter(Boolean);
            
            if (reqNames.length > 0) {
                requirementsText = `<div class="mobile-requirements">Requires: ${reqNames[0]}</div>`;
            }
        }
        
        branchHtml += `
            <div class="${classes}" data-id="${id}" onclick="showMobileTalentDetails('${id}')">
                <div class="mobile-talent-icon">${icon}</div>
                <div class="mobile-talent-name">${name}</div>
                <div class="mobile-talent-points">[${currentRank}/${maxRank}]</div>
                ${requirementsText}
            </div>
        `;
    });
    
    // Close branch container
    branchHtml += `
            </div>
        </div>
    `;
    
    return branchHtml;
}

function createMobileTalentModal() {
    // Create modal if it doesn't exist
    if (!document.querySelector('.mobile-talent-modal')) {
        const modal = document.createElement('div');
        modal.className = 'mobile-talent-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close" onclick="hideMobileTalentModal()">×</div>
                <h3 class="modal-title">Talent Name</h3>
                <div class="modal-description">Talent description goes here</div>
                <div class="modal-details">
                    <p><strong>Rank:</strong> <span class="modal-rank">0/0</span></p>
                    <div class="modal-effects"></div>
                    <div class="modal-requirements"></div>
                </div>
                <div class="modal-actions">
                    <div class="modal-button add" onclick="addMobileTalentPoint()">Add Point</div>
                    <div class="modal-button remove" onclick="removeMobileTalentPoint()">Remove Point</div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Current selected talent for modal
let currentMobileTalent = null;

function showMobileTalentDetails(talentId) {
    const talent = window.talents[talentId];
    currentMobileTalent = talentId;
    
    if (!talent) return;
    
    const modal = document.querySelector('.mobile-talent-modal');
    const addButton = modal.querySelector('.modal-button.add');
    const removeButton = modal.querySelector('.modal-button.remove');
    
    // Update modal content
    modal.querySelector('.modal-title').textContent = talent.name;
    modal.querySelector('.modal-description').textContent = talent.description;
    modal.querySelector('.modal-rank').textContent = `${talent.currentRank}/${talent.maxRank}`;
    
    // Effects
    let effectsHtml = '';
    if (talent.currentRank > 0) {
        effectsHtml += `<p><strong>Current Effect:</strong></p>`;
        effectsHtml += `<p>• ${talent.effects[talent.currentRank - 1]}</p>`;
    }
    
    if (talent.currentRank < talent.maxRank) {
        effectsHtml += `<p><strong>Next Rank:</strong></p>`;
        effectsHtml += `<p>• ${talent.effects[talent.currentRank]}</p>`;
    }
    
    modal.querySelector('.modal-effects').innerHTML = effectsHtml;
    
    // Requirements
    let requirementsHtml = '';
    if (talent.requirements.length > 0) {
        requirementsHtml = '<p><strong>Requirements:</strong></p>';
        talent.requirements.forEach(req => {
            const reqTalent = window.talents[req.talent];
            const isMet = reqTalent.currentRank >= req.minRank;
            const style = isMet ? 'color: #4CAF50;' : 'color: #FF6B6B;';
            const checkMark = isMet ? '✓' : '✗';
            requirementsHtml += `<p style="${style}">• ${checkMark} ${reqTalent.name} Rank ${req.minRank}</p>`;
        });
    }
    
    modal.querySelector('.modal-requirements').innerHTML = requirementsHtml;
    
    // Button states
    const canAdd = window.canUnlockTalent(talentId);
    const canRemove = talent.currentRank > 0 && window.canRemoveTalentPoint(talentId);
    
    if (canAdd) {
        addButton.classList.remove('disabled');
    } else {
        addButton.classList.add('disabled');
    }
    
    if (canRemove) {
        removeButton.classList.remove('disabled');
    } else {
        removeButton.classList.add('disabled');
    }
    
    // Show modal
    modal.classList.add('visible');
}

function hideMobileTalentModal() {
    const modal = document.querySelector('.mobile-talent-modal');
    modal.classList.remove('visible');
    currentMobileTalent = null;
}

function addMobileTalentPoint() {
    if (currentMobileTalent) {
        window.talentClick(currentMobileTalent);
        updateMobileView();
        showMobileTalentDetails(currentMobileTalent);
    }
}

function removeMobileTalentPoint() {
    if (currentMobileTalent) {
        window.removeTalentPoint(currentMobileTalent);
        updateMobileView();
        showMobileTalentDetails(currentMobileTalent);
    }
}

function updateMobileView() {
    // Update all mobile nodes to reflect talent state
    document.querySelectorAll('.mobile-talent-node').forEach(node => {
        const talentId = node.getAttribute('data-id');
        const talent = window.talents[talentId];
        
        if (talent) {
            // Update rank display
            const pointsDisplay = node.querySelector('.mobile-talent-points');
            if (pointsDisplay) {
                pointsDisplay.textContent = `[${talent.currentRank}/${talent.maxRank}]`;
            }
            
            // Update node appearance
            if (talent.currentRank > 0) {
                node.classList.add('unlocked');
                if (talent.currentRank >= talent.maxRank) {
                    node.classList.add('max-rank');
                } else {
                    node.classList.remove('max-rank');
                }
            } else {
                node.classList.remove('unlocked', 'max-rank');
                
                // Check if talent can be unlocked
                if (!window.canUnlockTalent(talentId)) {
                    node.classList.add('locked');
                } else {
                    node.classList.remove('locked');
                }
            }
        }
    });
}

function setupMobileTalentEvents() {
    // Add global variables for our mobile handlers
    window.showMobileTalentDetails = showMobileTalentDetails;
    window.hideMobileTalentModal = hideMobileTalentModal;
    window.addMobileTalentPoint = addMobileTalentPoint;
    window.removeMobileTalentPoint = removeMobileTalentPoint;
    
    // Listen for talent state changes
    document.addEventListener('talentStateChanged', updateMobileView);
}

function removeMobileView() {
    const mobileView = document.querySelector('.mobile-talent-view');
    if (mobileView) {
        mobileView.remove();
    }
    
    document.querySelector('.talent-tree-container').classList.remove('desktop-talent-view');
}

// Call this function when talent state changes to keep both views in sync
function notifyTalentStateChanged() {
    const event = new CustomEvent('talentStateChanged');
    document.dispatchEvent(event);
}

// Override original talent functions to trigger updates
const originalTalentClick = window.talentClick;
window.talentClick = function(talentId) {
    const result = originalTalentClick(talentId);
    notifyTalentStateChanged();
    return result;
};

const originalRemoveTalentPoint = window.removeTalentPoint;
window.removeTalentPoint = function(talentId) {
    const result = originalRemoveTalentPoint(talentId);
    notifyTalentStateChanged();
    return result;
};