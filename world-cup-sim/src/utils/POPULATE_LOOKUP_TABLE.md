# Knockout Algorithm Lookup Table

## Overview
The FIFA 2026 World Cup has 495 possible combinations of which 8 groups' third-place teams advance to the knockout stage. Each combination results in different Round of 32 matchups according to FIFA's official rules.

## Current Status
✅ **The lookup table is automatically generated from `possibilities.csv`**

The lookup table generation is now fully automated. You no longer need to manually populate entries.

## How It Works

### Automatic Generation
The lookup table (`matchupLookupTable.js`) is generated from `possibilities.csv` using the `parseCSVToLookup.js` script.

### CSV Format
The `possibilities.csv` file contains:
- **Columns 2-13**: Indicate which 8 groups' third-place teams advance (A-L)
- **Columns 14-21**: Show the resulting matchups for specific group winners vs third-place teams

### Regenerating the Lookup Table
If you update `possibilities.csv`, regenerate the lookup table:

```bash
node world-cup-sim/src/utils/parseCSVToLookup.js
```

This will:
1. Parse the CSV file
2. Extract all 495 combinations
3. Map the matchups to Round of 32 structure
4. Generate `matchupLookupTable.js` with all entries

## Lookup Table Structure

### Key Format
- **Key**: Sorted string of 8 group letters (e.g., "ABCDEFGH")
- **Value**: Array of exactly 16 matchups

### Team Types
- `{ type: 'winner', group: 'X' }` - Winner of Group X
- `{ type: 'runner', group: 'X' }` - Runner-up of Group X  
- `{ type: 'third', group: 'X' }` - Third-place team from Group X

### Match Order
The 16 matchups are in Round of 32 order:
1. Match 1 (Left side, top quarter)
2. Match 2 (Left side, top quarter)
3. Match 3 (Left side, top quarter)
4. Match 4 (Left side, top quarter)
5. Match 5 (Left side, second quarter)
6. Match 6 (Left side, second quarter)
7. Match 7 (Left side, second quarter)
8. Match 8 (Left side, second quarter)
9. Match 9 (Right side, top quarter)
10. Match 10 (Right side, top quarter)
11. Match 11 (Right side, top quarter)
12. Match 12 (Right side, top quarter)
13. Match 13 (Right side, bottom quarter)
14. Match 14 (Right side, bottom quarter)
15. Match 15 (Right side, bottom quarter)
16. Match 16 (Right side, bottom quarter)

## Usage

The lookup table is automatically imported and used by `knockoutAlgorithm.js`:

```javascript
import MATCHUP_LOOKUP_TABLE_DATA from './matchupLookupTable.js';
const MATCHUP_LOOKUP_TABLE = MATCHUP_LOOKUP_TABLE_DATA;
```

If a combination is not found in the lookup table, the algorithm falls back to a simplified priority-based approach.

## Files

- **`possibilities.csv`** - Source data with all 495 combinations
- **`parseCSVToLookup.js`** - Parser script that generates the lookup table
- **`matchupLookupTable.js`** - Generated lookup table (auto-generated, do not edit manually)
- **`knockoutAlgorithm.js`** - Algorithm that uses the lookup table

## Notes

- The lookup table is generated automatically - do not edit `matchupLookupTable.js` manually
- If you need to update matchups, edit `possibilities.csv` and regenerate
- The generated file is ~670 KB and contains all 495 combinations
- Missing combinations will use the fallback algorithm
