# STATSgO

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Personal stats tracker with hexagonal visualization
- 6 editable stat nodes at each corner of a hexagon (user types the stat name and value/percentage)
- Visual radar/hex chart showing all 6 stats at once
- Stats are persisted per user via backend
- Dashboard with hex-grid aesthetic, neon glow on dark background
- Ability to add/edit/remove custom stat categories
- Progress tracking over time (current value + history)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store user stats (name, value 0-100, history) in a map keyed by stat ID
2. Backend: CRUD APIs for stats (createStat, updateStat, deleteStat, getStats)
3. Frontend: Full-screen dark dashboard with STATSgO branding
4. Frontend: Central large hexagon with 6 corner nodes, each editable (label + percentage)
5. Frontend: Hexagon radar chart fills proportionally to values
6. Frontend: Inline editing on each hex corner node
7. Frontend: Stat cards below hex for details
8. Frontend: Neon cyan/teal + dark navy color scheme with glow effects
