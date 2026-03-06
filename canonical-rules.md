# JJK Card Game - Canonical Rules Specification

## Core Game Rules

### Player Setup
- **Starting Life Points**: 2000 (based on common TCG standards)
- **Starting Hand**: 5 cards
- **Deck Size**: 40 cards minimum
- **Maximum Field Size**: 5 creatures per side
- **Maximum Areas**: 1 per side
- **Energy Cap**: 10 maximum

### Turn Structure
1. **Start Phase**
   - Check win conditions
   - Apply ongoing effects
   - Remove temporary effects

2. **Draw Phase**
   - Draw 1 card (minimum)
   - Effects may alter draw amount

3. **Energy Phase**
   - Gain 1 energy (base)
   - Effects may grant additional energy
   - Energy cannot exceed cap

4. **Main Phase 1**
   - Play creature cards
   - Play area cards
   - Play spell/ability cards
   - Use creature abilities
   - Use ultimate moves (if conditions met)

5. **Battle Phase**
   - Declare attackers
   - Declare blockers
   - Resolve combat
   - Apply damage
   - Handle destruction

6. **Main Phase 2 / Technique Phase**
   - Same as Main Phase 1
   - Additional opportunity for responses

7. **End Phase**
   - Apply end-of-turn effects
   - Check win conditions
   - Switch turn priority

### Card Types

#### 1. Creature Cards
- **Sorcerers**: Main character units
- **Cursed Spirits**: Enemy/ally units
- **Summons/Tokens**: Temporary creatures
- **Shikigami**: Spirit summons
- **Cursed Corpses**: Undead units

**Rules**:
- Can be played during Main Phase
- Have ATK (attack) and DEF (defense/health)
- Can occupy front row or back row
- Can attack during Battle Phase
- Can use abilities during Main Phase
- Can use ultimate moves if conditions met

#### 2. Area Cards
- **Domain Expansions**: Environment-altering effects
- **Battlefields**: Modify game rules
- **Locations**: Provide ongoing benefits

**Rules**:
- One active area per side maximum
- Cannot be destroyed by most effects
- Provide ongoing passive effects
- May have activation conditions

#### 3. Spell/Ability Cards
- **Normal Spells**: One-time effects
- **Quick-Play**: Can be used during opponent's turn
- **Traps**: Can be set face-down
- **Continuous**: Ongoing effects

**Rules**:
- Played during Main Phase (unless quick-play)
- Resolve immediately unless countered
- Some have once-per-turn restrictions
- Some have targeting requirements

#### 4. Ultimate Moves
- **Signature Abilities**: Powerful character-specific effects
- **Domain Expansions**: Game-altering ultimate effects
- **Finishers**: High-impact abilities

**Rules**:
- Require ultimate cost payment
- May require source creature to be on field
- Can be used once per game or once per turn
- Often have dramatic effects

### Combat System

#### Attack Declaration
- Creatures in front row can attack
- Creatures with "cannot attack" cannot attack
- Direct attacks allowed if no enemy creatures in front row
- Attackers can be blocked by enemy creatures

#### Damage Calculation
- Attacker ATK vs Defender DEF
- Damage = ATK - DEF (minimum 0)
- If DEF reaches 0, creature is destroyed
- Excess damage is dealt to player
- "Ignore DEF" abilities bypass defense

#### Position Rules
- **Front Row**: Can attack and be attacked
- **Back Row**: Protected from direct attacks
- **Switching**: Can change rows during Main Phase
- **Linking**: Some abilities affect linked creatures

### Effect System

#### Effect Categories
1. **Triggered Effects**: Activate on specific events
2. **Activated Effects**: Require player activation
3. **Passive Effects**: Always active
4. **Continuous Effects**: Apply while conditions met
5. **Replacement Effects**: Modify game events
6. **Prevention Effects**: Stop events from occurring

#### Timing Windows
- **Fast Effects**: Can be used anytime
- **Spell Speed 2**: Can be used during battle
- **Spell Speed 3**: Can counter other effects

#### Status Effects
- **Stun**: Cannot attack or use abilities
- **Silence**: Cannot use activated abilities
- **Shielded**: Take no damage from next attack
- **Untargetable**: Cannot be targeted by effects
- **Cannot Attack**: Cannot declare attacks
- **Cannot Move**: Cannot change positions

### Resource System

#### Energy
- **Starting Energy**: 0
- **Base Gain**: 1 per turn
- **Maximum**: 10
- **Costs**: Card play, ability activation, ultimate moves
- **Effects**: Can modify energy gain/spending

#### Ultimate Energy
- **Separate from regular energy**
- **Gained through specific effects**
- **Used for ultimate moves only**
- **May carry over between turns**

### Win Conditions
1. **Reduce opponent to 0 HP**
2. **Opponent cannot draw when required**
3. **Specific card effects** (e.g., domain expansion victory)

### Special Rules

#### Chain/Stack System
- Effects can respond to other effects
- Last effect added resolves first
- Players can add responses in priority order

#### Token System
- Temporary creatures with limited duration
- Carry origin metadata
- Can be affected by effects affecting tokens
- Expire at end of turn or when conditions met

#### Exile/Banish
- Removed from game entirely
- Cannot be returned by normal effects
- May require specific effects to retrieve

#### Mulligan System
- Available once per game
- Can redraw opening hand
- Must keep same number of cards
- Some cards may restrict mulligans