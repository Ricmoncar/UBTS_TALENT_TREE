// ===================================================
// BLACKJACK TALENT TREE CONFIGURATION
// ===================================================
// Edit this file to change talents, descriptions, and requirements
// This is your control panel for the entire talent tree!

// Default starting talent points - Changed to 0 by default
export const DEFAULT_TALENT_POINTS = 0;

// ===================================================
// TALENT DEFINITIONS
// ===================================================
// How to edit talents:
// - name: Display name of the talent
// - emoji: Icon shown on the talent node
// - description: Detailed description (use \n for new lines)
// - maxRank: Maximum number of points you can put in this talent
// - type: 'bravery', 'humility', or 'mixed'
// - tier: 1, 2, 3, or 4 (determines position/unlock order)
// - requirements: Array of talents that must be unlocked first
//   Example: [{ talent: 'iron-fist', minRank: 2 }]
// - effects: Array of descriptions for each rank

export const TALENT_DEFINITIONS = {
    // ===================================================
    // BRAVERY BRANCH (Orange - Combat/Offense)
    // ===================================================
    'iron-fist': {
        name: 'Iron Fist',
        emoji: '⚔️',
        description: 'Your fists imbue with Bravery..\nEach rank increases your combat prowess.',
        maxRank: 6,
        type: 'bravery',
        tier: 1,
        requirements: [],
        effects: [
            '+100 ATK',
            '+250 ATK (Total)',
            '+500 ATK (Total) + Critical hits stun enemies',
            '+1000 ATK (Total) + Critical hits stun enemies + 5% critical strike chance',
            '+1500 ATK (Total) + Critical hits stun enemies + 10% critical strike chance',
            '+5000 ATK (Total) + Critical hits stun enemies + 30% critical strike chance',
        ]
    },
    
    'berserker-rage': {
        name: 'Berserker',
        emoji: '🔥',
        description: 'The lower your health, the stronger you become.\nRage fuels you in combat.',
        maxRank: 5,
        type: 'bravery',
        tier: 2,
        requirements: [{ talent: 'iron-fist', minRank: 2 }],
        effects: [
            '+2% ATK per 10% missing HP',
            '+4% ATK per 10% missing HP',
            '+6% ATK per 10% missing HP',
            '+8% ATK per 10% missing HP',
            '+10% ATK per 10% missing HP + critical hits deal 50% more damage'
        ]
    },
    
    // Rest of the talent definitions remain the same
    'parry-mastery': {
        name: 'Parry Mastery',
        emoji: '🛡️',
        description: 'Perfect timing turns defense into offense.\nMaster the art of deflecting attacks.',
        maxRank: 3,
        type: 'bravery',
        tier: 2,
        requirements: [{ talent: 'iron-fist', minRank: 1 }],
        effects: [
            '+10% Parry Chance',
            '+20% Parry Chance, +15% Parry Damage',
            '+30% Parry Chance, +35% Parry Damage'
        ]
    },
    
    'bloodlust': {
        name: 'Bloodlust',
        emoji: '🩸',
        description: 'Each victory fuels your next assault.\nThe thrill of combat enhances your abilities.',
        maxRank: 4,
        type: 'bravery',
        tier: 2,
        requirements: [{ talent: 'iron-fist', minRank: 2 }],
        effects: [
            '+1% damage after kill',
            '+2% damage after kill + 5% critical strike chance',
            '+3% damage after kill + heal 300 HP on kill + 10% critical strike chance',
            '+5% damage after kill + heal 780 HP on kill + 20% critical strike chance'
        ]
    },
    
    'soul-rend': {
        name: 'Soul Rend',
        emoji: '💀',
        description: 'Your attacks now tear at the their soul.\nWeakens enemies beyond physical damage.',
        maxRank: 2,
        type: 'bravery',
        tier: 3,
        requirements: [{ talent: 'berserker-rage', minRank: 3 }],
        effects: [
            'Attacks reduce enemy stats by 20% (non-stacking)',
            'Attacks reduce enemy stats by 30% (non-stacking)',
            'Attacks reduce enemy stats by 30% (non-stacking), harvest their soul.'
        ]
    },
    
    'executioner': {
        name: 'Executioner',
        emoji: '⚰️',
        description: 'Deliver swift hits to the wounded.\nNo mercy for those who falter.',
        maxRank: 1,
        type: 'bravery',
        tier: 3,
        requirements: [{ talent: 'bloodlust', minRank: 3 }],
        effects: [
            'Instantly execute enemies below 25% HP'
        ]
    },

    // ===================================================
    // HUMILITY BRANCH (Blue - Speed/Utility)
    // ===================================================
    'swift-movement': {
        name: 'Swift Movement',
        emoji: '💨',
        description: 'Speed and grace.\nOutmaneuver your foes with enhanced agility.',
        maxRank: 5,
        type: 'humility',
        tier: 1,
        requirements: [],
        effects: [
            '+15% Speed',
            '+30% Speed',
            '+45% Speed, +5% Dodge',
            '+60% Speed, +10% Dodge',
            '+75% Speed, +15% Dodge + 15% parry chance'
        ]
    },
    
    'phantom-step': {
        name: 'Phantom Step',
        emoji: '👻',
        description: 'Become like smoke on the battlefield.\nEach dodge makes you faster and more elusive.',
        maxRank: 3,
        type: 'humility',
        tier: 2,
        requirements: [{ talent: 'swift-movement', minRank: 2 }],
        effects: [
            'Dodging grants +5% Speed buff',
            '+10% Dodge Chance, dodging grants +10% Speed buff',
            '+20% Dodge Chance, dodging grants +40% Speed buff + Leave afterimage upon dodging'
        ]
    },
    
    'act-synergy': {
        name: 'ACT Synergy',
        emoji: '🎭',
        description: 'Your ACT commands become more efficient.\nWords and actions work in perfect harmony.',
        maxRank: 6,
        type: 'humility',
        tier: 2,
        requirements: [{ talent: 'swift-movement', minRank: 1 }],
        effects: [
            'ACT empowered by 20%',
            'ACT empowered by 40%',
            'ACT empowered by 80%',
            'ACT empowered by 100% + HUMILITY can chain act with you. (10% effectiveness)',
            'ACT empowered by 125% + HUMILITY can chain act with you. (50% effectiveness)',
            'ACT empowered by 150% + HUMILITY can chain act with you. (100% effectiveness)'
        ]
    },
    
    'evasive-maneuvers': {
        name: 'Evasive Maneuvers',
        emoji: '🌪️',
        description: 'Master the art of not being hit.\nDodge with style and grace.',
        maxRank: 4,
        type: 'humility',
        tier: 2,
        requirements: [{ talent: 'swift-movement', minRank: 1 }],
        effects: [
            '+10% Dodge Chance',
            '+20% Dodge Chance',
            '+30% Dodge Chance',
            '+40% Dodge Chance + Dodging grants brief invincibility'
        ]
    },
    
    'time-dilation': {
        name: 'Time Dilation',
        emoji: '⏰',
        description: 'Occasionally act twice in a single turn.',
        maxRank: 1,
        type: 'humility',
        tier: 3,
        requirements: [{ talent: 'phantom-step', minRank: 3 }],
        effects: [
            '40% chance to take an extra turn'
        ]
    },
    
    'fortune-seeker': {
        name: 'Fortune Seeker',
        emoji: '💰',
        description: 'Lady Luck smiles upon you.\nFind greater rewards in your adventures.',
        maxRank: 3,
        type: 'humility',
        tier: 3,
        requirements: [{ talent: 'act-synergy', minRank: 3 }],
        effects: [
            '+50% LOVE gained, +25% Gold',
            '+100% LOVE gained, +50% Gold',
            '+150% LOVE gained, +100% Gold'
        ]
    },

    // ===================================================
    // MIXED/SOUL CORE (White - Balance/Ultimate)
    // ===================================================
    'soul-bond': {
        name: 'Soul Bond',
        emoji: '🔗',
        description: 'Forge a connection between your dual souls.\nBalance brings strength and resilience.',
        maxRank: 3,
        type: 'mixed',
        tier: 1,
        requirements: [],
        effects: [
            '+500 HP, +15% DEF',
            '+1500 HP, +25% DEF',
            '+3500 HP, +35% DEF + HUMILITY and BRAVERY can ACT and FIGHT together.'
        ]
    },
    
    'balance-keeper': {
        name: 'Balance Keeper',
        emoji: '⚖️',
        description: 'Maintain the harmony between.\nTrue power comes from perfect equilibrium.',
        maxRank: 3,
        type: 'mixed',
        tier: 1,
        requirements: [],
        effects: [
            '+10% Damage and ACT effectiveness',
            '+20% Damage and ACT effectiveness',
            '+40% Damage and ACT effectiveness, Immunity to debuffs'
        ]
    },
    
    'soul-ascension': {
        name: 'Soul Ascension',
        emoji: '✨',
        description: 'Get the two together.\nUnlock the true potential of your dual soul.',
        maxRank: 1,
        type: 'mixed',
        tier: 4,
        requirements: [
            { talent: 'soul-bond', minRank: 3 },
            { talent: 'soul-rend', minRank: 1 },
            { talent: 'time-dilation', minRank: 1 }
        ],
        effects: [
            '...?'
        ]
    }
};
