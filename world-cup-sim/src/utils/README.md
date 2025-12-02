# Knockout Algorithm Implementation

## What Was Implemented

A comprehensive structure for handling all 495 possible combinations of third-place teams advancing to the knockout stage in the FIFA 2026 World Cup.

## Files Created

1. **`knockoutAlgorithm.js`** - Main algorithm file containing:
   - `MATCHUP_LOOKUP_TABLE` - Lookup table for all combinations (to be populated)
   - `generateRoundOf32Matchups()` - Main function to generate matchups
   - `generateMatchupsFallback()` - Fallback algorithm when lookup table entry is missing
   - Helper functions for combination generation

2. **`parseCSVToLookup.js`** - Script to parse `possibilities.csv` and generate the lookup table

3. **`generateLookupTemplate.js`** - Helper script to generate a template structure

## How It Works

1. When `generateKnockoutBracket()` is called in `DashboardPage.jsx`, it:
   - Collects the 8 advancing third-place groups
   - Calls `generateRoundOf32Matchups()` with the group data
   
2. The algorithm:
   - Creates a lookup key from the sorted advancing groups (e.g., "ABCDEFGH")
   - Checks if an entry exists in `MATCHUP_LOOKUP_TABLE`
   - If found: Uses the specific matchups from the table
   - If not found: Falls back to the simplified priority-based algorithm

## Current Status

✅ Algorithm structure is complete  
✅ Integration with DashboardPage is complete  
✅ Lookup table is automatically generated from `possibilities.csv`

## How the Lookup Table is Generated

The lookup table is automatically generated from `possibilities.csv` using the `parseCSVToLookup.js` script:

1. The CSV contains all 495 combinations of advancing third-place teams
2. Each row shows which 8 groups' third-place teams advance
3. The script parses the CSV and generates `matchupLookupTable.js`
4. The knockout algorithm imports and uses this lookup table

To regenerate the lookup table after CSV changes:
```bash
node world-cup-sim/src/utils/parseCSVToLookup.js
```

## Benefits

- **Accurate**: Handles all 495 combinations according to FIFA rules
- **Maintainable**: Clear structure and documentation
- **Flexible**: Falls back gracefully if a combination is missing
- **Testable**: Can test individual combinations easily

## Example Usage

```javascript
import { generateRoundOf32Matchups } from './knockoutAlgorithm';

const advancingGroups = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
const groupWinners = { 'A': 'Team1', 'B': 'Team2', ... };
const runnersUp = { 'A': 'Team3', 'B': 'Team4', ... };
const thirdPlaceMap = { 'A': 'Team5', 'B': 'Team6', ... };

const matchups = generateRoundOf32Matchups(
  advancingGroups,
  groupWinners,
  runnersUp,
  thirdPlaceMap
);
```

