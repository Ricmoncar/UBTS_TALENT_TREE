// ===================================================
// YUKI TALENT TREE CONFIGURATION
// ===================================================
// Arctic Fox Ice Archer talent tree with focus on
// ice magic, speed, and peaceful/merciful options
// Default starting talent points
export const DEFAULT_TALENT_POINTS = 0;
// ===================================================
// TALENT DEFINITIONS
// ===================================================
export const TALENT_DEFINITIONS = {
// ===================================================
// ICE BRANCH (Light Blue - Ice Powers/Control)
// ===================================================
'frost-arrow': {
name: 'Frost Arrow',
emoji: '❄️',
description: 'Infuse your arrows with the power of frost.\nEach rank increases the slowing effect and damage.',
maxRank: 5,
type: 'ice',
tier: 1,
requirements: [],
effects: [
'Arrows slow enemies by 10% for 2s',
'Arrows slow enemies by 20% for 3s',
'Arrows slow enemies by 30% for 4s and deal +10% ice damage',
'Arrows slow enemies by 40% for 5s and deal +20% ice damage',
'Arrows slow enemies by 50% for 6s and deal +30% ice damage, with a 15% chance to freeze enemies for 1s'
]
},
'ice-shards': {
    name: 'Ice Shards',
    emoji: '💎',
    description: 'Fire multiple ice shards in a cone.\nGreat for crowd control and area denial.',
    maxRank: 3,
    type: 'ice',
    tier: 2,
    requirements: [{ talent: 'frost-arrow', minRank: 2 }],
    effects: [
        'Fire 3 ice shards in a 30° cone, each dealing 60% arrow damage',
        'Fire 5 ice shards in a 45° cone, each dealing 70% arrow damage',
        'Fire 7 ice shards in a 60° cone, each dealing 80% arrow damage and leaving icy patches that slow enemies by 20%'
    ]
},

'freezing-trap': {
    name: 'Freezing Trap',
    emoji: '❄',
    description: 'Place a trap that freezes enemies when triggered.\nPerfect for strategic positioning and escape.',
    maxRank: 3,
    type: 'ice',
    tier: 2,
    requirements: [{ talent: 'frost-arrow', minRank: 3 }],
    effects: [
        'Place a trap that freezes enemies for 2s when triggered',
        'Place a trap that freezes enemies for 3s and deals ice damage when triggered',
        'Place up to 3 traps that freeze enemies for 4s and deal ice damage when triggered'
    ]
},

'glacier-shot': {
    name: 'Glacier Shot',
    emoji: '🏔️',
    description: 'Fire an arrow that creates a wall of ice on impact.\nBlock enemy paths and create defensive barriers.',
    maxRank: 3,
    type: 'ice',
    tier: 3,
    requirements: [{ talent: 'ice-shards', minRank: 2 }],
    effects: [
        'Create a 10-foot ice wall with 500 HP that lasts for 5s',
        'Create a 20-foot ice wall with 1000 HP that lasts for 10s',
        'Create a 30-foot ice wall with 2000 HP that lasts for 15s and damages enemies on contact'
    ]
},

'arctic-wind': {
    name: 'Arctic Wind',
    emoji: '🌬️',
    description: 'Summon a freezing gale that pushes enemies away.\nCombines control with damage in a wide area.',
    maxRank: 3,
    type: 'ice',
    tier: 3,
    requirements: [{ talent: 'ice-shards', minRank: 1 }],
    effects: [
        'Pushes enemies back 10 feet and slows them by 20% for 3s',
        'Pushes enemies back 15 feet, slows them by 30% for 4s, and deals ice damage',
        'Pushes enemies back 20 feet, slows them by 40% for 5s, deals ice damage, and has a 20% chance to freeze them'
    ]
},

'bitter-cold': {
    name: 'Bitter Cold',
    emoji: '🥶',
    description: 'Your very presence chills the air around you.\nSlows enemies that stay near you for too long.',
    maxRank: 3,
    type: 'ice',
    tier: 3,
    requirements: [{ talent: 'freezing-trap', minRank: 2 }],
    effects: [
        'Enemies within 15 feet are slowed by 10%, increasing by 5% for every 2s they stay near you',
        'Enemies within 20 feet are slowed by 15%, increasing by 10% for every 2s they stay near you',
        'Enemies within 25 feet are slowed by 20%, increasing by 15% for every 2s they stay near you, and take ice damage'
    ]
},

'winter-embrace': {
    name: 'Winter Embrace',
    emoji: '☃️',
    description: 'Surround yourself with protective ice crystals.\nReduce incoming damage and reflect attacks.',
    maxRank: 2,
    type: 'ice',
    tier: 4,
    requirements: [
        { talent: 'glacier-shot', minRank: 2 },
        { talent: 'arctic-wind', minRank: 2 }
    ],
    effects: [
        'Reduce all incoming damage by 20% and reflect 10% of damage back at attackers',
        'Reduce all incoming damage by 30% and reflect 20% of damage back at attackers as ice damage'
    ]
},

'absolute-zero': {
    name: 'Absolute Zero',
    emoji: '🧊',
    description: 'Unleash the ultimate cold, freezing everything around you.\nMass crowd control for desperate situations.',
    maxRank: 1,
    type: 'ice',
    tier: 4,
    requirements: [{ talent: 'bitter-cold', minRank: 3 }],
    effects: [
        'Freeze all enemies within 30 feet for 5s and deal massive ice damage'
    ]
},

// ===================================================
// SPEED BRANCH (White/Silver - Agility/Movement)
// ===================================================
'swift-paws': {
    name: 'Swift Paws',
    emoji: '🦊',
    description: 'Enhance your natural fox agility.\nEach rank increases your overall speed and reflexes.',
    maxRank: 5,
    type: 'speed',
    tier: 1,
    requirements: [],
    effects: [
        '+10% Movement Speed',
        '+20% Movement Speed and +5% Dodge Chance',
        '+30% Movement Speed and +10% Dodge Chance',
        '+40% Movement Speed and +15% Dodge Chance',
        '+50% Movement Speed, +20% Dodge Chance, and +20% Attack Speed'
    ]
},

'rapid-fire': {
    name: 'Rapid Fire',
    emoji: '🏹',
    description: 'Draw and loose arrows with incredible speed.\nSacrifice some power for rapid attacks.',
    maxRank: 3,
    type: 'speed',
    tier: 2,
    requirements: [{ talent: 'swift-paws', minRank: 2 }],
    effects: [
        '+20% Attack Speed, but -10% Damage per Arrow',
        '+40% Attack Speed, but -5% Damage per Arrow',
        '+60% Attack Speed, no damage penalty, and every 5th arrow is guaranteed to critically hit'
    ]
},

'blink-step': {
    name: 'Blink Step',
    emoji: '✨',
    description: 'Teleport short distances in the blink of an eye.\nPerfect for repositioning or escaping danger.',
    maxRank: 3,
    type: 'speed',
    tier: 2,
    requirements: [{ talent: 'swift-paws', minRank: 3 }],
    effects: [
        'Teleport up to 15 feet in any direction. 15s cooldown',
        'Teleport up to 25 feet in any direction. 10s cooldown',
        'Teleport up to 40 feet in any direction. 5s cooldown and your next attack after teleporting deals 50% bonus damage'
    ]
},

'arctic-agility': {
    name: 'Arctic Agility',
    emoji: '🌟',
    description: 'Move across snowy and icy terrain with perfect balance.\nGain speed bonuses in winter environments.',
    maxRank: 3,
    type: 'speed',
    tier: 3,
    requirements: [{ talent: 'rapid-fire', minRank: 2 }],
    effects: [
        '+50% Movement Speed on snow and ice, never slip on icy surfaces',
        '+75% Movement Speed on snow and ice, leave a trail of frost that slows enemies by 10%',
        '+100% Movement Speed on snow and ice, leave a trail of frost that slows enemies by 20%, and gain 10 energy when moving on snow or ice'
    ]
},

'perfect-parry': {
    name: 'Perfect Parry',
    emoji: '🛡️',
    description: 'Deflect incoming attacks with your bow.\nTurn enemy aggression into opportunity.',
    maxRank: 3,
    type: 'speed',
    tier: 3,
    requirements: [{ talent: 'swift-paws', minRank: 3 }],
    effects: [
        '+15% chance to Parry attacks, reducing damage by 50%',
        '+25% chance to Parry attacks, reducing damage by 75%',
        '+35% chance to Parry attacks, reducing damage by 100% and reflecting 50% of the damage back to attacker'
    ]
},

'snow-dash': {
    name: 'Snow Dash',
    emoji: '💨',
    description: 'Dash forward in a blur of snow and speed.\nMove quickly through combat while avoiding danger.',
    maxRank: 3,
    type: 'speed',
    tier: 3,
    requirements: [{ talent: 'blink-step', minRank: 2 }],
    effects: [
        'Dash 20 feet forward, becoming untargetable during the dash. 8s cooldown',
        'Dash 30 feet in any direction, becoming untargetable and leaving a trail of frost. 6s cooldown',
        'Dash 40 feet in any direction, becoming untargetable, leaving a trail of frost, and slowing enemies you pass through by 30% for 3s. 4s cooldown'
    ]
},

'fox-reflexes': {
    name: 'Fox Reflexes',
    emoji: '⚡',
    description: 'Your heightened reflexes allow you to react instantly.\nOccasionally gain extra actions in combat.',
    maxRank: 2,
    type: 'speed',
    tier: 4,
    requirements: [
        { talent: 'arctic-agility', minRank: 2 },
        { talent: 'perfect-parry', minRank: 2 }
    ],
    effects: [
        '20% chance at the start of combat to gain an extra action. Successful parries give you 20% chance for an extra action',
        '30% chance at the start of combat to gain an extra action. Successful parries always give you an extra action'
    ]
},

'aurora-trail': {
    name: 'Aurora Trail',
    emoji: '🌈',
    description: 'Leave a beautiful trail of northern lights as you move.\nThe trail enhances allies and weakens enemies.',
    maxRank: 1,
    type: 'speed',
    tier: 4,
    requirements: [{ talent: 'snow-dash', minRank: 3 }],
    effects: [
        'Leave a trail of aurora energy that boosts ally movement speed by 20% and attack speed by 15%, while slowing enemies by 20% and reducing their attack speed by 15%'
    ]
},

// ===================================================
// MERCY BRANCH (Soft Purple - ACT/Peace Options)
// ===================================================
'gentle-presence': {
    name: 'Gentle Presence',
    emoji: '💗',
    description: 'Your calming aura soothes those around you.\nIncrease chances of peaceful resolution.',
    maxRank: 3,
    type: 'mercy',
    tier: 1,
    requirements: [],
    effects: [
        'ACT commands are 25% more effective. Enemies are 10% less likely to attack first',
        'ACT commands are 50% more effective. Enemies are 20% less likely to attack first',
        'ACT commands are 75% more effective. Enemies are 30% less likely to attack first and may offer friendship'
    ]
},

'compassionate-act': {
    name: 'Compassionate ACT',
    emoji: '🙏',
    description: 'Master the art of peaceful negotiation.\nUnlock new ACT options to resolve conflicts.',
    maxRank: 3,
    type: 'mercy',
    tier: 2,
    requirements: [{ talent: 'gentle-presence', minRank: 2 }],
    effects: [
        'Unlock "COMFORT" ACT option that can calm agitated enemies. +15% MERCY success chance',
        'Unlock "BEFRIEND" ACT option that can turn neutral enemies friendly. +30% MERCY success chance',
        'Unlock "PACIFY" ACT option that can end combat peacefully. +50% MERCY success chance and gain rewards for peaceful resolutions'
    ]
},

'peaceful-aura': {
    name: 'Peaceful Aura',
    emoji: '😇',
    description: 'Radiate a soothing energy that calms hostility.\nReduce enemy aggression and damage.',
    maxRank: 3,
    type: 'mercy',
    tier: 2,
    requirements: [{ talent: 'gentle-presence', minRank: 1 }],
    effects: [
        'Enemies within 20 feet deal 10% less damage and are 10% more susceptible to ACT commands',
        'Enemies within 30 feet deal 20% less damage and are 20% more susceptible to ACT commands',
        'Enemies within 40 feet deal 30% less damage and are 30% more susceptible to ACT commands. Has a 5% chance to make enemies reconsider attacking'
    ]
},

'calming-touch': {
    name: 'Calming Touch',
    emoji: '👋',
    description: 'Your touch soothes pain and aggression.\nCan temporarily pacify even the most violent foes.',
    maxRank: 3,
    type: 'mercy',
    tier: 3,
    requirements: [
        { talent: 'compassionate-act', minRank: 2 },
        { talent: 'frost-arrow', minRank: 3 }
    ],
    effects: [
        'Touch an enemy to make them non-hostile for 10s. 60s cooldown',
        'Touch an enemy to make them non-hostile for 20s. 40s cooldown',
        'Touch an enemy to make them non-hostile for 30s or permanently pacify non-boss enemies below 30% health. 20s cooldown'
    ]
},

'inspiring-hope': {
    name: 'Inspiring Hope',
    emoji: '✨',
    description: 'Inspire hope in allies and enemies alike.\nStrengthen friends and offer redemption to foes.',
    maxRank: 3,
    type: 'mercy',
    tier: 3,
    requirements: [
        { talent: 'compassionate-act', minRank: 1 },
        { talent: 'swift-paws', minRank: 3 }
    ],
    effects: [
        'Allies gain +10% to all stats. Enemies below 50% health have a 5% chance to surrender each turn',
        'Allies gain +20% to all stats. Enemies below 50% health have a 10% chance to surrender each turn',
        'Allies gain +30% to all stats. Enemies below 50% health have a 15% chance to surrender each turn. Successfully sparing enemies grants bonus EXP and items'
    ]
},

'spiritual-healing': {
    name: 'Spiritual Healing',
    emoji: '✨',
    description: 'Mend wounds with the power of compassion.\nHeal yourself and allies while offering mercy.',
    maxRank: 3,
    type: 'mercy',
    tier: 3,
    requirements: [{ talent: 'peaceful-aura', minRank: 2 }],
    effects: [
        'Heal yourself and allies for 10% of max HP every 5s. Successfully sparing enemies heals for 20% max HP',
        'Heal yourself and allies for 15% of max HP every 5s. Successfully sparing enemies heals for 40% max HP',
        'Heal yourself and allies for 20% of max HP every 5s. Successfully sparing enemies heals for 60% max HP and removes all negative status effects'
    ]
},

'heart-of-mercy': {
    name: 'Heart of Mercy',
    emoji: '❤️',
    description: 'Your compassion becomes your greatest strength.\nGain power through peaceful acts, not violence.',
    maxRank: 2,
    type: 'mercy',
    tier: 4,
    requirements: [
        { talent: 'calming-touch', minRank: 2 },
        { talent: 'inspiring-hope', minRank: 2 }
    ],
    effects: [
        'Gain 5% damage, defense, and healing for every enemy you spare, stacking up to 10 times',
        'Gain 10% damage, defense, and healing for every enemy you spare, stacking up to 20 times. Spared enemies may become allies who can be summoned once per day'
    ]
},

// ===================================================
// ULTIMATE TALENT
// ===================================================
'fox-spirit-ascension': {
    name: 'Fox Spirit Ascension',
    emoji: '🦊',
    description: 'Transform into a mythical nine-tailed fox spirit.\nUnleash your true potential as an ancient being of ice and harmony.',
    maxRank: 1,
    type: 'ultimate',
    tier: 5,
    requirements: [
        { talent: 'winter-embrace', minRank: 1 },
        { talent: 'fox-reflexes', minRank: 1 },
        { talent: 'heart-of-mercy', minRank: 1 }
    ],
    effects: [
        'Transform for 10 minutes: +100% all stats, all ice abilities cost no energy, successful ACTs are guaranteed, gain ability to fly, and enemies that witness your form have a 50% chance to become peaceful immediately'
    ]
}
};