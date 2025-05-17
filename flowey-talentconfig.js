// ===================================================
// FLOWEY TALENT TREE CONFIGURATION
// ===================================================
// Support-based talent tree focused on healing, buffs, and growth

// Default starting talent points
export const DEFAULT_TALENT_POINTS = 0;

// ===================================================
// TALENT DEFINITIONS
// ===================================================

export const TALENT_DEFINITIONS = {
    // ===================================================
    // HEALING BRANCH (Green - Healing/Recovery)
    // ===================================================
    'healing-touch': {
        name: 'Healing Touch',
        emoji: '💚',
        description: 'Your touch infuses allies with restorative energy.\nEach rank increases healing power and efficiency.',
        maxRank: 5,
        type: 'healing',
        tier: 1,
        requirements: [],
        effects: [
            'Heal a target for 100 HP',
            'Heal a target for 250 HP',
            'Heal a target for 400 HP, 10% chance to remove one negative status effect',
            'Heal a target for 600 HP, 25% chance to remove one negative status effect',
            'Heal a target for 1000 HP, 50% chance to remove all negative status effects'
        ]
    },
    
    'regenerative-aura': {
        name: 'Regenerative Aura',
        emoji: '✨',
        description: 'Create a healing field around you.\nAllies within range regenerate health over time.',
        maxRank: 3,
        type: 'healing',
        tier: 2,
        requirements: [{ talent: 'healing-touch', minRank: 2 }],
        effects: [
            'Allies within 10 feet recover 5% of max HP every 10 seconds',
            'Allies within 15 feet recover 10% of max HP every 10 seconds',
            'Allies within 20 feet recover 15% of max HP every 10 seconds and gain +10% healing received from all sources'
        ]
    },
    
    'cleansing-bloom': {
        name: 'Cleansing Bloom',
        emoji: '🌺',
        description: 'Release a burst of purifying energy.\nRemoves harmful effects from allies.',
        maxRank: 3,
        type: 'healing',
        tier: 2,
        requirements: [{ talent: 'healing-touch', minRank: 3 }],
        effects: [
            'Remove one random negative effect from up to 3 allies',
            'Remove one random negative effect from all allies within 20 feet',
            'Remove all negative effects from all allies within 30 feet and grant 5 seconds of immunity to negative effects'
        ]
    },
    
    'lifelink': {
        name: 'Life Link',
        emoji: '🔄',
        description: 'Create a bond between yourself and an ally.\nShare healing received and transfer vitality.',
        maxRank: 3,
        type: 'healing',
        tier: 3,
        requirements: [{ talent: 'regenerative-aura', minRank: 2 }],
        effects: [
            'Link with an ally for 30 seconds. 30% of healing you receive is shared with them',
            'Link with an ally for 60 seconds. 50% of healing you receive is shared with them, and they receive 15% damage reduction',
            'Link with up to 3 allies for 90 seconds. 70% of healing you receive is shared with them, and they receive 25% damage reduction'
        ]
    },
    
    'rapid-growth': {
        name: 'Rapid Growth',
        emoji: '🌱',
        description: 'Accelerate natural healing processes.\nIncrease healing speed and effectiveness.',
        maxRank: 3,
        type: 'healing',
        tier: 3,
        requirements: [{ talent: 'regenerative-aura', minRank: 1 }],
        effects: [
            'Healing spells have 20% reduced cooldown and are 15% more effective',
            'Healing spells have 35% reduced cooldown and are 30% more effective',
            'Healing spells have 50% reduced cooldown and are 50% more effective. Critical heals are possible with a 15% chance to double healing'
        ]
    },
    
    'vitality-transfer': {
        name: 'Vitality Transfer',
        emoji: '💫',
        description: 'Sacrifice your own health to heal others.\nEmergency healing at the cost of your vitality.',
        maxRank: 3,
        type: 'healing',
        tier: 3,
        requirements: [{ talent: 'cleansing-bloom', minRank: 2 }],
        effects: [
            'Transfer up to 20% of your max HP to heal a target for 150% of the transferred amount',
            'Transfer up to 30% of your max HP to heal a target for 200% of the transferred amount',
            'Transfer up to 50% of your max HP to heal a target for 300% of the transferred amount, and gain 50% damage reduction for 10 seconds afterward'
        ]
    },
    
    'rejuvenation': {
        name: 'Rejuvenation',
        emoji: '💖',
        description: 'Powerful healing over time that scales with missing health.\nThe more wounded the target, the stronger the effect.',
        maxRank: 2,
        type: 'healing',
        tier: 4,
        requirements: [
            { talent: 'lifelink', minRank: 2 },
            { talent: 'rapid-growth', minRank: 2 }
        ],
        effects: [
            'Heal target for 10% of their max HP instantly, then an additional 5% every 2 seconds for 10 seconds. Effect is doubled on targets below 30% HP',
            'Heal target for 20% of their max HP instantly, then an additional 10% every 2 seconds for 10 seconds. Effect is tripled on targets below 30% HP and also increases their max HP by 20% for 30 seconds'
        ]
    },
    
    'resurrection': {
        name: 'Resurrection',
        emoji: '🕊️',
        description: 'Return fallen allies to life.\nThe ultimate expression of healing power.',
        maxRank: 1,
        type: 'healing',
        tier: 4,
        requirements: [{ talent: 'vitality-transfer', minRank: 3 }],
        effects: [
            'Resurrect a fallen ally with 50% HP and temporary invulnerability for 5 seconds. Can only be used once per day'
        ]
    },

    // ===================================================
    // BUFF BRANCH (Yellow/Gold - Buffs/Enhancements)
    // ===================================================
    'empowering-nectar': {
        name: 'Empowering Nectar',
        emoji: '🧪',
        description: 'Infuse allies with power-enhancing nectar.\nBoosts combat effectiveness of those who drink it.',
        maxRank: 5,
        type: 'buff',
        tier: 1,
        requirements: [],
        effects: [
            '+10% Attack for 60 seconds',
            '+20% Attack for 120 seconds',
            '+30% Attack and +10% Critical Hit Chance for 180 seconds',
            '+40% Attack and +15% Critical Hit Chance for 240 seconds',
            '+50% Attack, +20% Critical Hit Chance, and +30% Critical Damage for 5 minutes'
        ]
    },
    
    'protective-petals': {
        name: 'Protective Petals',
        emoji: '🛡️',
        description: 'Surround an ally with magical flower petals.\nAbsorbs incoming damage and enhances defense.',
        maxRank: 3,
        type: 'buff',
        tier: 2,
        requirements: [{ talent: 'empowering-nectar', minRank: 2 }],
        effects: [
            'Create a shield that absorbs damage equal to 20% of the target\'s max HP for 30 seconds',
            'Create a shield that absorbs damage equal to 40% of the target\'s max HP for 45 seconds',
            'Create a shield that absorbs damage equal to 60% of the target\'s max HP for 60 seconds and reflects 20% of absorbed damage back to attackers'
        ]
    },
    
    'thorny-embrace': {
        name: 'Thorny Embrace',
        emoji: '🌵',
        description: 'Wrap allies in protective thorns.\nDamages enemies that attack them.',
        maxRank: 3,
        type: 'buff',
        tier: 2,
        requirements: [{ talent: 'empowering-nectar', minRank: 3 }],
        effects: [
            'Attackers take damage equal to 10% of their attack when striking buffed allies for 30 seconds',
            'Attackers take damage equal to 20% of their attack when striking buffed allies for 45 seconds',
            'Attackers take damage equal to 30% of their attack when striking buffed allies and are slowed by 20% for 3 seconds for 60 seconds'
        ]
    },
    
    'strength-sap': {
        name: 'Strength Sap',
        emoji: '💪',
        description: 'Drain enemy strength and transfer it to allies.\nWeakens foes while empowering friends.',
        maxRank: 3,
        type: 'buff',
        tier: 3,
        requirements: [{ talent: 'protective-petals', minRank: 2 }],
        effects: [
            'Reduce target enemy\'s Attack by 20% for 20 seconds, increasing your target ally\'s Attack by the same amount',
            'Reduce target enemy\'s Attack by 30% for 30 seconds, increasing your target ally\'s Attack by the same amount',
            'Reduce all enemies\' Attack within 15 feet by 25% for 30 seconds, increasing all allies\' Attack within 15 feet by the same amount'
        ]
    },
    
    'fortifying-pollen': {
        name: 'Fortifying Pollen',
        emoji: '🌬️',
        description: 'Release a cloud of strengthening pollen.\nTens to buff allies and debuff enemies.',
        maxRank: 3,
        type: 'buff',
        tier: 3,
        requirements: [{ talent: 'empowering-nectar', minRank: 4 }],
        effects: [
            'Allies gain +20% Defense, enemies lose 10% Attack Speed for 30 seconds',
            'Allies gain +30% Defense and +10% Dodge Chance, enemies lose 20% Attack Speed for 45 seconds',
            'Allies gain +40% Defense, +20% Dodge Chance, and +15% Movement Speed, enemies lose 30% Attack Speed and 15% Movement Speed for 60 seconds'
        ]
    },
    
    'reactive-thorns': {
        name: 'Reactive Thorns',
        emoji: '🌹',
        description: 'Deploy thorns that respond to attacks.\nIntensifies when allies take damage.',
        maxRank: 3,
        type: 'buff',
        tier: 3,
        requirements: [{ talent: 'thorny-embrace', minRank: 2 }],
        effects: [
            'When a buffed ally takes damage, thorns damage increases by 30% for 5 seconds (stacks up to 3 times)',
            'When a buffed ally takes damage, thorns damage increases by 50% for 8 seconds and reflect effects gain 10% Lifesteal (stacks up to 5 times)',
            'When a buffed ally takes damage, thorns damage increases by 75% for 10 seconds, reflect effects gain 20% Lifesteal, and attackers are also stunned for 1 second (30 second cooldown per attacker)'
        ]
    },
    
    'symbiosis': {
        name: 'Symbiosis',
        emoji: '🤝',
        description: 'Form a powerful bond with allies.\nShare buffs and enhance each other\'s abilities.',
        maxRank: 2,
        type: 'buff',
        tier: 4,
        requirements: [
            { talent: 'strength-sap', minRank: 2 },
            { talent: 'fortifying-pollen', minRank: 2 }
        ],
        effects: [
            'Any buff you cast is 30% more effective and lasts 50% longer. Additionally, when you buff an ally, you gain 40% of the buff\'s effect',
            'Any buff you cast is 60% more effective and lasts 100% longer. Additionally, when you buff an ally, you gain 70% of the buff\'s effect, and they receive 15% cooldown reduction on all abilities'
        ]
    },
    
    'overgrowth': {
        name: 'Overgrowth',
        emoji: '🌲',
        description: 'Trigger rapid, uncontrolled growth in an area.\nCreateS a zone of empowerment and hindrance.',
        maxRank: 1,
        type: 'buff',
        tier: 4,
        requirements: [{ talent: 'reactive-thorns', minRank: 3 }],
        effects: [
            'Create a 30-foot zone for 20 seconds where allies gain +50% to all stats and enemies are slowed by 50% and take nature damage over time'
        ]
    },

    // ===================================================
    // GROWTH BRANCH (Green/Dark Green - Utility/Global)
    // ===================================================
    'natural-growth': {
        name: 'Natural Growth',
        emoji: '🌱',
        description: 'Your powers develop naturally over time.\nGain strength through experience and observation.',
        maxRank: 3,
        type: 'growth',
        tier: 1,
        requirements: [],
        effects: [
            '+10% to all abilities, +5% Experience gain',
            '+20% to all abilities, +10% Experience gain',
            '+30% to all abilities, +15% Experience gain, and gain 1 talent point every 10 levels'
        ]
    },
    
    'resource-sharing': {
        name: 'Resource Sharing',
        emoji: '♻️',
        description: 'Share energy and resources with allies.\nSupport the group through redistribution.',
        maxRank: 3,
        type: 'growth',
        tier: 2,
        requirements: [{ talent: 'natural-growth', minRank: 1 }],
        effects: [
            'Transfer up to 30% of your mana or energy to allies, gaining 10% damage reduction for 10 seconds',
            'Transfer up to 50% of your mana or energy to allies, gaining 20% damage reduction for 20 seconds',
            'Transfer up to 70% of your mana or energy to allies, gaining 30% damage reduction for 30 seconds, and both you and the recipient gain 10% ability haste for 1 minute'
        ]
    },
    
    'deep-roots': {
        name: 'Deep Roots',
        emoji: '🌿',
        description: 'Establish a deep connection with the earth.\nAbsorb strength from the ground and resist displacement.',
        maxRank: 3,
        type: 'growth',
        tier: 2,
        requirements: [{ talent: 'natural-growth', minRank: 2 }],
        effects: [
            '50% resistance to knockback and movement-impairing effects, +10% maximum HP',
            '75% resistance to knockback and movement-impairing effects, +20% maximum HP',
            'Immunity to knockback and movement-impairing effects, +30% maximum HP, and regenerate 1% of maximum HP per second while standing still'
        ]
    },
    
    'blossoming-potential': {
        name: 'Blossoming Potential',
        emoji: '🌷',
        description: 'Unlock the hidden potential in allies.\nEmpower them to exceed their normal limits.',
        maxRank: 3,
        type: 'growth',
        tier: 3,
        requirements: [
            { talent: 'resource-sharing', minRank: 2 },
            { talent: 'healing-touch', minRank: 3 }
        ],
        effects: [
            'Target ally gains +20% to their primary stat for 1 minute',
            'Target ally gains +35% to their primary stat and +15% to all secondary stats for 2 minutes',
            'Target ally gains +50% to their primary stat, +25% to all secondary stats, and can exceed their normal stat caps by 10% for 3 minutes'
        ]
    },
    
    'seasonal-cycle': {
        name: 'Seasonal Cycle',
        emoji: '🍂',
        description: 'Rotate through the four seasons, gaining different benefits.\nAdapt to changing situations with nature\'s cycle.',
        maxRank: 3,
        type: 'growth',
        tier: 3,
        requirements: [
            { talent: 'resource-sharing', minRank: 1 },
            { talent: 'empowering-nectar', minRank: 3 }
        ],
        effects: [
            'Cycle through seasons (Spring: +20% Healing, Summer: +20% Damage, Fall: +20% Defense, Winter: +20% Mana Regen). Change season every 15 seconds or manually (30s cooldown)',
            'Cycle through seasons (Spring: +35% Healing, Summer: +35% Damage, Fall: +35% Defense, Winter: +35% Mana Regen). Change season every 20 seconds or manually (20s cooldown)',
            'Cycle through seasons (Spring: +50% Healing and Cleanse, Summer: +50% Damage and Haste, Fall: +50% Defense and Reflect, Winter: +50% Mana Regen and Reduction). Change season every 30 seconds or manually (10s cooldown)'
        ]
    },
    
    'natural-harmony': {
        name: 'Natural Harmony',
        emoji: '☯️',
        description: 'Achieve balance with the environment.\nGain benefits based on your surroundings.',
        maxRank: 3,
        type: 'growth',
        tier: 3,
        requirements: [{ talent: 'deep-roots', minRank: 2 }],
        effects: [
            'Gain environment-based bonuses (Forest: +15% Healing, Mountain: +15% Defense, Plains: +15% Movement Speed, Water: +15% Mana Regen)',
            'Gain environment-based bonuses (Forest: +25% Healing and Stealth, Mountain: +25% Defense and Damage, Plains: +25% Movement Speed and Attack Speed, Water: +25% Mana Regen and Healing)',
            'Gain environment-based bonuses (Forest: +40% Healing, Stealth and Dodge, Mountain: +40% Defense, Damage and Resist, Plains: +40% Movement, Attack Speed and Crit, Water: +40% Mana Regen, Healing and Cooldown)'
        ]
    },
    
    'forest-guardian': {
        name: 'Forest Guardian',
        emoji: '🌳',
        description: 'Become one with the forest, gaining protection and power.\nThe ultimate expression of natural growth.',
        maxRank: 2,
        type: 'growth',
        tier: 4,
        requirements: [
            { talent: 'blossoming-potential', minRank: 2 },
            { talent: 'seasonal-cycle', minRank: 2 }
        ],
        effects: [
            'Transform for 30 seconds, gaining 30% damage reduction, 30% increased healing power, and the ability to entangle enemies within 20 feet',
            'Transform for 60 seconds, gaining 50% damage reduction, 50% increased healing power, and the ability to entangle enemies within 30 feet. While transformed, healing abilities can be cast while performing other actions'
        ]
    },

    // ===================================================
    // ULTIMATE TALENT
    // ===================================================
    'garden-of-eden': {
        name: 'Garden of Eden',
        emoji: '🌈',
        description: 'Create a paradise of perfect balance and harmony.\nWithin this sacred garden, life flourishes and harm is diminished.',
        maxRank: 1,
        type: 'ultimate',
        tier: 5,
        requirements: [
            { talent: 'rejuvenation', minRank: 1 },
            { talent: 'symbiosis', minRank: 1 },
            { talent: 'forest-guardian', minRank: 2 }
        ],
        effects: [
            'Create a 50-foot Garden of Eden for 30 seconds. Within this area, allies recover 10% max HP and mana per second, gain 100% increased stats, immunity to negative effects, and 20% cooldown reduction. Enemies within the Garden are weakened and take 50% more damage'
        ]
    }
};