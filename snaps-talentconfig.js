// ===================================================
// SNAPS TALENT TREE CONFIGURATION - REVISED
// ===================================================
// Updated talent tree for Snaps, the axe-tailed lizard

// Default starting talent points
export const DEFAULT_TALENT_POINTS = 0;

// ===================================================
// TALENT DEFINITIONS
// ===================================================

export const TALENT_DEFINITIONS = {
    // ===================================================
    // MAGIC BRANCH (Left - Purple/Blue) 
    // ===================================================
    'elemental-affinity': {
        name: 'Elemental Affinity',
        emoji: '♨️',
        description: 'Harness minor fire abilities.\nEach rank increases your flame manipulation.',
        maxRank: 5,
        type: 'magic',
        tier: 1,
        requirements: [],
        effects: [
            '+15% Magic Damage - Unlock begginner fire abilities',
            '+30% Magic Damage - Unlock Intermediate fire abilities',
            '+45% Magic Damage - Intermediate fire abilities',
            '+60% Magic Damage - Unlock advanced fire abilities',
            '+100% Magic Damage + 10% Magic Critical Chance - Unlock proficient fire abilities'
        ]
    },
    
    'frost-snap': {
        name: 'Frost Snap',
        emoji: '❄️',
        description: 'Channel cold magic through your claws.\nFreeze enemies in their tracks.',
        maxRank: 3,
        type: 'magic',
        tier: 2,
        requirements: [{ talent: 'elemental-affinity', minRank: 2 }],
        effects: [
            '+15% Magic Damage - Unlock begginer frost abilities',
            '+20% Magic Damage - Begginer frost abilities',
            '+30% Magic Damage - Intermediate frost abilities',
        ]
    },
    
    'nature-energy': {
        name: 'Nature Energy',
        emoji: '🌿',
        description: 'Tap into the power of natural growth and healing.\nUnleash restorative energies upon yourself and allies.',
        maxRank: 3,
        type: 'magic',
        tier: 2,
        requirements: [{ talent: 'elemental-affinity', minRank: 3 }],
        effects: [
            'Spells have a 20% chance to heal you for 5% of your max HP - Unlock begginer nature abilities',
            'Spells have a 40% chance to heal you for 10% of your max HP - Begginer nature abilities',
            'Spells have a 60% chance to heal you for 15% of your max HP and summon vines that bind enemies for 1 round - Unlock Intermediate nature abilities'
        ]
    },
    
    'mana-surge': {
        name: 'Mana Surge',
        emoji: '💧',
        description: 'Your natural connection to magic grows stronger.\nEnhance your magical reserves and regeneration.',
        maxRank: 3,
        type: 'magic',
        tier: 3,
        requirements: [{ talent: 'frost-snap', minRank: 2 }],
        effects: [
            '+25% Maximum Mana and +10% Mana Regeneration',
            '+50% Maximum Mana and +20% Mana Regeneration',
            '+100% Maximum Mana and +30% Mana Regeneration. When below 20% mana, next spell costs no mana.'
        ]
    },
    
    'spell-mastery': {
        name: 'Spell Mastery',
        emoji: '📚',
        description: 'Crit + magic? Hell yeah',
        maxRank: 3,
        type: 'magic',
        tier: 3,
        requirements: [{ talent: 'nature-energy', minRank: 2 }],
        effects: [
            'Magic critical hit chance +15%, magic critical damage +30%',
            'Magic critical hit chance +30%, magic critical damage +60%',
            'Magic critical hit chance +45%, magic critical damage +100%. Critical spells have a 25% chance to refund their mana cost.'
        ]
    },
    
    'bully-magic': {
        name: 'Bully Magic',
        emoji: '😈',
        description: 'Use your magic to torment others.\nWeaken opponents with demoralizing spells.',
        maxRank: 3,
        type: 'magic',
        tier: 3,
        requirements: [{ talent: 'nature-energy', minRank: 1 }],
        effects: [
            'Spells reduce target\'s Attack and Defense by 10% for 2 rounds',
            'Spells reduce target\'s Attack and Defense by 20% for 2 rounds',
            'Spells reduce target\'s Attack and Defense by 30% for 3 rounds and have a 15% chance to inflict Fear, causing enemies to miss their next turn'
        ]
    },
    
    'pacifying': {
        name: 'Pacifying',
        emoji: '💫',
        description: 'Calm your enemies with soothing magic.\nPut weakened foes to sleep instead of defeating them.',
        maxRank: 2,
        type: 'magic',
        tier: 4,
        requirements: [
            { talent: 'mana-surge', minRank: 2 },
            { talent: 'spell-mastery', minRank: 2 }
        ],
        effects: [
            'Enemies below 25% HP can be put to sleep',
            'Enemies below 40% HP can be put to sleep'
        ]
    },
    
    'electric-magic': {
        name: 'Electric Magic',
        emoji: '⚡',
        description: 'Channel lightning through your claws.\nShock your enemies with devastating electrical attacks.',
        maxRank: 1,
        type: 'magic',
        tier: 4,
        requirements: [{ talent: 'spell-mastery', minRank: 3 }],
        effects: [
            'Unlock electric-based attacks that deal 150% damage and have a 25% chance to stun enemies for 1 round'
        ]
    },

    // ===================================================
    // PHYSICAL BRANCH (Right - Red/Orange) 
    // ===================================================
    'natural-strength': {
        name: 'Natural Strength',
        emoji: '💪',
        description: 'Enhance your innate lizard monster strength.\nEach rank increases your physical might.',
        maxRank: 5,
        type: 'physical',
        tier: 1,
        requirements: [],
        effects: [
            '+5% Physical damage',
            '+10% Physical damage and +5% HP',
            '+15% Physical damage and +10% HP',
            '+20% Physical damage and +15% HP',
            '+25% Physical damage, +25% HP'
        ]
    },
    
    'tough-scales': {
        name: 'Tough Scales',
        emoji: '🐉',
        description: 'Your lizard scales harden with training.\nBecome more resistant to physical damage.',
        maxRank: 3,
        type: 'physical',
        tier: 2,
        requirements: [{ talent: 'natural-strength', minRank: 2 }],
        effects: [
            '+15% DEF',
            '+30% DEF and reduce critical hit damage taken by 15%',
            '+50% DEF, reduce critical hit damage taken by 30%, and gain 10% chance to completely negate physical attacks'
        ]
    },
    
    'intimidation': {
        name: 'Intimidation',
        emoji: '👹',
        description: 'Your fearsome appearance terrifies opponents.\nMake others think twice before crossing you.',
        maxRank: 3,
        type: 'physical',
        tier: 2,
        requirements: [{ talent: 'natural-strength', minRank: 3 }],
        effects: [
            'Reduce enemy attack by 10% for 2 rounds when you enter combat',
            'Reduce enemy attack by 20% for 2 rounds when you enter combat, and enemies have a 10% chance to skip their turn out of fear',
            'Reduce enemy attack by 30% for 3 rounds when you enter combat, and enemies have a 20% chance to skip their turn out of fear'
        ]
    },
    
    'predator-instincts': {
        name: 'Predator Instincts',
        emoji: '👁️',
        description: 'Your hunter\'s instincts sharpen in battle.\nTarget enemies\' weak points with deadly precision.',
        maxRank: 3,
        type: 'physical',
        tier: 3,
        requirements: [{ talent: 'tough-scales', minRank: 2 }],
        effects: [
            '+15% Critical Hit Chance and +25% Critical Hit Damage',
            '+30% Critical Hit Chance and +50% Critical Hit Damage',
            '+45% Critical Hit Chance and +100% Critical Hit Damage. Critical hits ignore 30% of enemy armor.'
        ]
    },
    
    'regeneration': {
        name: 'Regeneration',
        emoji: '♻️',
        description: 'Your lizard body regenerates damage rapidly.\nHeal wounds during and after combat.',
        maxRank: 3,
        type: 'physical',
        tier: 3,
        requirements: [{ talent: 'tough-scales', minRank: 1 }],
        effects: [
            'Regenerate 5% of max HP each round',
            'Regenerate 10% of max HP each round, and heal 20% of max HP after winning a battle',
            'Regenerate 15% of max HP each round, heal 40% of max HP after winning a battle, and gain 50% increased healing from all sources'
        ]
    },
    
    'mercy-act': {
        name: 'Mercy ACT',
        emoji: '🙏',
        description: 'Develop your ways to end conflict peacefully.\nIncrease chances of sparing enemies that fear you.',
        maxRank: 3,
        type: 'physical',
        tier: 3,
        requirements: [{ talent: 'intimidation', minRank: 2 }],
        effects: [
            'ACT commands are 30% more effective. Enemies below 15% HP have a 10% chance to surrender',
            'ACT commands are 60% more effective. Enemies below 15% HP have a 25% chance to surrender',
            'ACT commands are 100% more effective. Enemies below 25% HP have a 50% chance to surrender out of fear. Successful ACTs boost your morale, increasing all stats by 5% for 2 rounds'
        ]
    },
    
    'parry-master': {
        name: 'Parry Master',
        emoji: '🔄',
        description: 'Master the art of deflecting attacks.\nTurn enemies\' strength against them.',
        maxRank: 2,
        type: 'physical',
        tier: 4,
        requirements: [
            { talent: 'predator-instincts', minRank: 2 },
            { talent: 'mercy-act', minRank: 2 }
        ],
        effects: [
            '+30% Parry chance.',
            '+50% Parry chance.'
        ]
    },
    
    'alpha-presence': {
        name: 'Alpha Presence',
        emoji: '👑',
        description: 'Establish dominance over your territory.\nYour very presence weakens those around you.',
        maxRank: 1,
        type: 'physical',
        tier: 4,
        requirements: [{ talent: 'mercy-act', minRank: 3 }],
        effects: [
            'Your presence reduces all enemy stats by 25% and has a 20% chance to cause enemies to flee during combat'
        ]
    },

    // ===================================================
    // WEAPON/AXE BRANCH (Center - Green/Yellow) 
    // ===================================================
    'axe-proficiency': {
        name: 'Axe Proficiency',
        emoji: '🪓',
        description: 'Master the use of your natural axe-tail.\nEach rank increases your weapon prowess.',
        maxRank: 5,
        type: 'weapon',
        tier: 1,
        requirements: [],
        effects: [
            '+15% Axe Damage',
            '+30% Axe Damage and +10% Axe Attack Speed',
            '+45% Axe Damage and +20% Axe Attack Speed',
            '+60% Axe Damage and +30% Axe Attack Speed',
            '+100% Axe Damage, +50% Axe Attack Speed, and axe attacks have a 20% chance to hit all enemies in front of you'
        ]
    },
    
    'sharp-edge': {
        name: 'Sharp Edge',
        emoji: '⚔️',
        description: 'Sharpen your axe-tail to a deadly edge.\nCut through enemy defenses with ease.',
        maxRank: 3,
        type: 'weapon',
        tier: 2,
        requirements: [{ talent: 'axe-proficiency', minRank: 2 }],
        effects: [
            'Axe attacks penetrate 15% of enemy armor',
            'Axe attacks penetrate 30% of enemy armor and have a 10% chance to cause Bleeding',
            'Axe attacks penetrate 50% of enemy armor and have a 25% chance to cause Bleeding'
        ]
    },
    
    'metal-morphing': {
        name: 'Metal Morphing',
        emoji: '🔩',
        description: 'Transform your axe-tail into different types of strong metal.\nGain different benefits based on the metal type.',
        maxRank: 3,
        type: 'weapon',
        tier: 2,
        requirements: [{ talent: 'axe-proficiency', minRank: 3 }],
        effects: [
            'Transform your axe into steel for +20% damage, titanium for +20% attack speed, or silver for +20% critical chance',
            'Transform your axe into steel for +35% damage, titanium for +35% attack speed, or silver for +35% critical chance',
            'Transform your axe into adamantium for +25% to ALL stats (damage, speed, and critical chance)'
        ]
    },
    
    'flame-axe': {
        name: 'Flame Axe',
        emoji: '🔥',
        description: 'Infuse your axe-tail with fire magic.\nBurn your enemies with each strike.',
        maxRank: 3,
        type: 'weapon',
        tier: 3,
        requirements: [
            { talent: 'sharp-edge', minRank: 2 },
            { talent: 'elemental-affinity', minRank: 3 }
        ],
        effects: [
            'Axe attacks deal additional 20% damage as fire damage',
            'Axe attacks deal additional 40% damage as fire damage and have a 20% chance to ignite enemies',
            'Axe attacks deal additional 60% damage as fire damage and ignites enemies'
        ]
    },
    
    'frost-axe': {
        name: 'Frost Axe',
        emoji: '❄️',
        description: 'Imbue your axe-tail with ice magic.\nSlow and freeze enemies with your strikes.',
        maxRank: 3,
        type: 'weapon',
        tier: 3,
        requirements: [
            { talent: 'metal-morphing', minRank: 2 },
            { talent: 'frost-snap', minRank: 3 }
        ],
        effects: [
            'Axe attacks slow enemies by 20% for 2 rounds',
            'Axe attacks slow enemies by 35% for 2 rounds and have a 15% chance to freeze them for 1 round',
            'Axe attacks slow enemies by 50% for 3 rounds and have a 30% chance to freeze them for 1 round'
        ]
    },
    
    'ultimate-heal': {
        name: 'Ultimate Heal',
        emoji: '🌸',
        description: 'Ultimate Heal.',
        maxRank: 3,
        type: 'weapon',
        tier: 3,
        requirements: [
            { talent: 'metal-morphing', minRank: 1 },
            { talent: 'electric-magic', minRank: 1 }
        ],
        effects: [
            'Unlock ULTIMATE HEAL.',
            'Unlock ULTIMATE HEAL MK II.',
            'Unlock ULTIMATE HEAL MK III.'
        ]
    },
    
    'executioner-benignant': {
        name: 'Executioner/Benignant',
        emoji: '💀',
        description: 'Master the art of finishing foes, whether through defeat or mercy.\nChoose between executing weakened enemies or offering them mercy.',
        maxRank: 2,
        type: 'weapon',
        tier: 4,
        requirements: [
            { talent: 'flame-axe', minRank: 2 },
            { talent: 'frost-axe', minRank: 2 }
        ],
        effects: [
            'Deal 200% increased damage to enemies below 20% health OR instantly offer them MERCY with an 80% success rate',
            'Deal 400% increased damage to enemies below 20% health OR instantly offer them MERCY with a 100% success rate.'
        ]
    },
    
    'fear-scent': {
        name: 'Fear Scent',
        emoji: '👃',
        description: 'Smell the fear in your enemies.\nDetect weakness and gain a morale boost in battle.',
        maxRank: 1,
        type: 'weapon',
        tier: 4,
        requirements: [{ talent: 'intimidation', minRank: 3 }],
        effects: [
            'Detect enemies\' fear levels. For each frightened enemy, gain +10% to all stats. For each terrified enemy, gain +20% to all stats'
        ]
    },

    // ===================================================
    // ULTIMATE TALENT (Center Top) 
    // ===================================================
    'knight-transformation': {
        name: 'Knight Transformation',
        emoji: '🌟',
        description: 'Transform into a fully armored lizard knight.\nUnleash your true potential as an unstoppable warrior.',
        maxRank: 1,
        type: 'ultimate',
        tier: 5,
        requirements: [
            { talent: 'pacifying', minRank: 1 },
            { talent: 'parry-master', minRank: 1 },
            { talent: 'executioner-benignant', minRank: 2 }
        ],
        effects: [
            'Transform into a legendary armored knight for 5 rounds: 100% increased damage for all attacks, 75% damage reduction, unlimited mana, and all attacks have a 50% chance to critically hit. Your ACTs become 200% more effective.'
        ]
    }
};