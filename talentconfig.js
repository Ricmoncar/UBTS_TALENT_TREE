// ===================================================
// BLACKJACK TALENT TREE CONFIGURATION - REDESIGNED
// ===================================================
// Complete redesign with reimagined talents structure

// Default starting talent points
export const DEFAULT_TALENT_POINTS = 0;

// ===================================================
// TALENT DEFINITIONS
// ===================================================

export const TALENT_DEFINITIONS = {
    // ===================================================
    // BRAVERY BRANCH (Red/Orange - Combat/Offense)
    // ===================================================
    'iron-fist': {
        name: 'Iron Fist',
        emoji: '⚔️',
        description: 'Your fists imbue with Bravery.\nEach rank increases your combat prowess.',
        maxRank: 5,
        type: 'bravery',
        tier: 1,
        requirements: [],
        effects: [
            '+100 ATK',
            '+250 ATK (Total)',
            '+500 ATK (Total) + Critical hits stun enemies for 1s',
            '+1000 ATK (Total) + Critical hits stun enemies for 2s',
            '+2000 ATK (Total) + Critical hits stun enemies for 3s + 15% critical strike chance'
        ]
    },
    
    'critical-fighter': {
        name: 'Critical Fighter',
        emoji: '⚡',
        description: 'Master precision strikes against enemy weak points.\nIncreases critical hit chance and damage.',
        maxRank: 3,
        type: 'bravery',
        tier: 2,
        requirements: [{ talent: 'iron-fist', minRank: 2 }],
        effects: [
            '+10% Critical Hit Chance, +25% Critical Hit Damage',
            '+20% Critical Hit Chance, +50% Critical Hit Damage',
            '+30% Critical Hit Chance, +100% Critical Hit Damage + Critical hits heal you for 5% max HP'
        ]
    },
    
    'berserker-rage': {
        name: 'Berserker Rage',
        emoji: '🔥',
        description: 'The lower your health, the stronger you become.\nRage fuels you in combat.',
        maxRank: 3,
        type: 'bravery',
        tier: 2,
        requirements: [{ talent: 'iron-fist', minRank: 3 }],
        effects: [
            '+5% ATK per 10% missing HP',
            '+10% ATK per 10% missing HP, +5% Critical Chance when below 50% HP',
            '+15% ATK per 10% missing HP, +15% Critical Chance when below 50% HP'
        ]
    },
    
    'burning-fists': {
        name: 'Burning Fists',
        emoji: '🔥',
        description: 'Imbue your attacks with searing flame.\nEnemies burn with each strike.',
        maxRank: 3,
        type: 'bravery',
        tier: 3,
        requirements: [{ talent: 'critical-fighter', minRank: 2 }],
        effects: [
            'Attacks apply Burning, dealing 10% ATK as fire damage',
            'Attacks apply Burning, dealing 20% ATK as fire damage',
            'Attacks apply Burning, dealing 30% ATK as fire damage + Burning effect stacks up to 3 times'
        ]
    },
    
    'parry-mastery': {
        name: 'Parry Mastery',
        emoji: '🛡️',
        description: 'Perfect timing turns defense into offense.\nMaster the art of deflecting attacks.',
        maxRank: 3,
        type: 'bravery',
        tier: 3,
        requirements: [{ talent: 'iron-fist', minRank: 3 }],
        effects: [
            '+10% Parry Chance, Successful parries deal 50% ATK as counter damage',
            '+15% Parry Chance, Successful parries deal 100% ATK as counter damage',
            '+30% Parry Chance, Successful parries deal 150% ATK as counter damage and stun enemies for 2s'
        ]
    },
    
    'bloodlust': {
        name: 'Bloodlust',
        emoji: '🩸',
        description: 'Each victory fuels your next assault.\nThe thrill of combat enhances your abilities.',
        maxRank: 3,
        type: 'bravery',
        tier: 3,
        requirements: [{ talent: 'berserker-rage', minRank: 2 }],
        effects: [
            'Killing an enemy grants +1% ATK',
            'Killing an enemy grants +2% ATK and heals for 5% max HP',
            'Killing an enemy grants +3.5% ATK, heals for 10% max HP, and grants 20% Critical Chance for 10s (stacks up to 3 times)'
        ]
    },
    
    'soul-rend': {
        name: 'Soul Rend',
        emoji: '💀',
        description: 'Your attacks tear at the enemy\'s soul.\nWeakens enemies beyond physical damage.',
        maxRank: 2,
        type: 'bravery',
        tier: 4,
        requirements: [
            { talent: 'burning-fists', minRank: 2 },
            { talent: 'bloodlust', minRank: 2 }
        ],
        effects: [
            'Attacks reduce enemy DEF and ATK by 30% for 1 round',
            'Attacks reduce enemy DEF and ATK by 50% for  2 rounds + you can absorb your enemies souls.'
        ]
    },
    
    'executioner': {
        name: 'Executioner',
        emoji: '⚰️',
        description: 'Deliver swift death to the wounded.\nNo mercy for those who falter.',
        maxRank: 1,
        type: 'bravery',
        tier: 4,
        requirements: [{ talent: 'bloodlust', minRank: 3 }],
        effects: [
            'Instantly execute non-boss enemies below 30% HP'
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
            '+75% Speed, +15% Dodge + 15% chance to take no damage from attacks'
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
            'Dodging grants +10% Speed during fights (stacks up to 3 times)',
            'Dodging grants +20% Speed during fights (stacks up to 3 times)',
            'Dodging grants +30% Speed during fights (stacks up to 10 times), and leaves an afterimage that confuses enemies'
        ]
    },
    
    'mind-reading': {
        name: 'Mind Reading',
        emoji: '🧠',
        description: 'Peer into the thoughts of others.\nAnticipate intentions and actions.',
        maxRank: 3,
        type: 'humility',
        tier: 2,
        requirements: [{ talent: 'swift-movement', minRank: 3 }],
        effects: [
            'Reveal basic thoughts of NPCs, 20% chance to predict enemy attacks',
            'Reveal detailed intentions of NPCs, 40% chance to predict enemy attacks',
            'Reveal all thoughts and memories of NPCs, 60% chance to predict enemy attacks + predicted attacks can be automatically dodged'
        ]
    },
    
    'evasive-maneuvers': {
        name: 'Evasive Maneuvers',
        emoji: '🌪️',
        description: 'Master the art of not being hit.\nDodge with style and grace.',
        maxRank: 3,
        type: 'humility',
        tier: 3,
        requirements: [{ talent: 'phantom-step', minRank: 2 }],
        effects: [
            '+20% Dodge Chance',
            '+35% Dodge Chance + Successful dodges restore 3% max HP',
            '+50% Dodge Chance + Successful dodges restore 6% max HP'
        ]
    },
    
    'act-synergy': {
        name: 'ACT Synergy',
        emoji: '🎭',
        description: 'Your ACT commands become more efficient.\nWords and actions work in perfect harmony.',
        maxRank: 4,
        type: 'humility',
        tier: 3,
        requirements: [{ talent: 'mind-reading', minRank: 2 }],
        effects: [
            'ACT commands are 50% more effective',
            'ACT commands are 100% more effective',
            'ACT commands are 150% more effective + HUMILITY can chain ACT with you (25% effectiveness)',
            'ACT commands are 200% more effective + HUMILITY can chain ACT with you (50% effectiveness)'
        ]
    },
    
    'soul-caller': {
        name: 'Soul Caller',
        emoji: '👥',
        description: 'Summon your spectral ally to fight alongside you.',
        maxRank: 2,
        type: 'humility',
        tier: 4,
        requirements: [{ talent: 'act-synergy', minRank: 3 }],
        effects: [
            'Summon HUMILITY with 2000 HP and 1000 ATK for 2 rounds',
            'Summon HUMILITY with 5000 HP and 2000 ATK for 3 rounds'
        ]
    },
    
    'time-dilation': {
        name: 'Time Dilation',
        emoji: '⏰',
        description: 'Bend the flow of time to your advantage.\nGain extra actions in critical moments.',
        maxRank: 2,
        type: 'humility',
        tier: 4,
        requirements: [
            { talent: 'evasive-maneuvers', minRank: 2 },
            { talent: 'act-synergy', minRank: 2 }
        ],
        effects: [
            '30% chance to act twice in a single turn',
            '50% chance to act twice in a single turn + Once per battle, can stop time for 3s, allowing free movement while enemies are frozen'
        ]
    },
    
    'fortune-seeker': {
        name: 'Fortune Seeker',
        emoji: '💰',
        description: 'Lady Luck smiles upon you.\nFind greater rewards in your adventures.',
        maxRank: 2,
        type: 'humility',
        tier: 3,
        requirements: [{ talent: 'mind-reading', minRank: 2 }],
        effects: [
            '+75% LOVE gained, +50% Gold',
            '+150% LOVE gained, +100% Gold'
        ]
    },

    // ===================================================
    // MIXED/SOUL CORE (Purple - Balance/Ultimate)
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
            '+200 HP, +2% DEF',
            '+400 HP, +5% DEF',
            '+3000 HP, +40% DEF + HUMILITY and BRAVERY can communicate directly with the enemy'
        ]
    },
    
    'balance-keeper': {
        name: 'Balance Keeper',
        emoji: '⚖️',
        description: 'Maintain harmony between opposing forces.\nTrue power comes from equilibrium.',
        maxRank: 3,
        type: 'mixed',
        tier: 2,
        requirements: [{ talent: 'soul-bond', minRank: 1 }],
        effects: [
            '+15% Damage and ACT effectiveness',
            '+30% Damage and ACT effectiveness, 50% resistance to status effects',
            '+45% Damage and ACT effectiveness, Immunity to debuffs + Regenerate 5% max HP every round'
        ]
    },
    
    'soul-harmony': {
        name: 'Soul Harmony',
        emoji: '☯️',
        description: 'Achieve perfect balance between your two souls.\nUnlock latent potential through inner peace.',
        maxRank: 3,
        type: 'mixed',
        tier: 3,
        requirements: [{ talent: 'balance-keeper', minRank: 2 }],
        effects: [
            'Bravery abilities gain +20% effectiveness when used by Humility, and vice versa',
            'Bravery abilities gain +40% effectiveness when used by Humility, and vice versa',
            'Bravery abilities gain +60% effectiveness when used by Humility, and vice versa'
        ]
    },
    
    'soul-purity': {
        name: 'Soul Purity',
        emoji: '💎',
        description: 'Cleanse your soul of all corruption.\nA pure soul enhances all abilities.',
        maxRank: 3,
        type: 'mixed',
        tier: 3,
        requirements: [{ talent: 'soul-bond', minRank: 2 }],
        effects: [
            'Killing grants a bit of LOVE. Sparing grants a bit of LV. \n+10% to all stats',
            'Killing grants LOVE. Sparing grants LV. \n+20% to all stats',
            'SPARING enemies grants massive LV. +30% to all stats, rapidly regenerate HP + Protective aura extends to allies'
        ]
    },
    
    'inner-strength': {
        name: 'Inner Strength',
        emoji: '💪',
        description: 'Draw power from within.\nUnlock your full potential in times of need.',
        maxRank: 2,
        type: 'mixed',
        tier: 4,
        requirements: [
            { talent: 'soul-harmony', minRank: 2 },
            { talent: 'soul-purity', minRank: 2 }
        ],
        effects: [
            'When below 30% HP, gain +50% to all stats for 1 round',
            'When below 30% HP, gain +100% to all stats for 2 rounds'
        ]
    },
    
    'soul-ascension': {
        name: 'Soul Ascension',
        emoji: '✨',
        description: 'The ultimate unification of dual souls.\nTranscend mortal limitations.',
        maxRank: 1,
        type: 'mixed',
        tier: 5,
        requirements: [
            { talent: 'soul-rend', minRank: 2 },
            { talent: 'time-dilation', minRank: 1 },
            { talent: 'inner-strength', minRank: 2 }
        ],
        effects: [
            'Fuse your souls, and transform based on your LV or LOVE. (Higher LV = bravery transformation. Higher LOVE = humility transformation).'
        ]
    }
};