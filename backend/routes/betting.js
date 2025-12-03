// backend/routes/betting.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Helper function to extract country name from team string (removes emoji and extra text)
function extractCountryName(teamString) {
  // Remove emoji and extra characters, get just the country name
  // Examples: "United States 🇺🇸" -> "United States", "Brazil 🇧🇷" -> "Brazil"
  return teamString.split('🇺🇸🇲🇽🇨🇦🇪🇸🇦🇷🇫🇷🏴󠁧󠁢󠁥󠁮󠁧󠁿🇧🇷🇵🇹🇳🇱🇧🇪🇩🇪🇭🇷🇲🇦🇨🇴🇺🇾🇨🇭🇯🇵🇸🇳🇮🇷🇰🇷🇪🇨🇦🇹🇦🇺🇳🇴🇵🇦🇪🇬🇩🇿🏴󠁧󠁢󠁳󠁣󠁴󠁿🇵🇾🇹🇳🇨🇮🇺🇿🇶🇦🇸🇦🇿🇦🇯🇴🇨🇻🇬🇭🇨🇼🇭🇹🇳🇿🇮🇹🇺🇦🇹🇷🇨🇿🇮🇶🇨🇩')[0].trim();
}

// Map country names to common API team names
const TEAM_NAME_MAP = {
  'United States': 'USA',
  'South Korea': 'Korea Republic',
  'DR Congo': 'Congo DR',
  'Czech Republic': 'Czechia',
  // Add more mappings as needed
};

function normalizeTeamName(countryName) {
  return TEAM_NAME_MAP[countryName] || countryName;
}

// GET betting odds for a matchup
router.get('/odds', async (req, res) => {
  try {
    const { team1, team2, type } = req.query; // type: 'group' or 'matchup'

    if (!team1 || !team2) {
      return res.status(400).json({ message: 'Both team1 and team2 are required' });
    }

    const apiKey = process.env.SPORTS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Sports API key not configured' });
    }

    // Extract country names from team strings
    const country1 = extractCountryName(team1);
    const country2 = extractCountryName(team2);
    
    // Normalize team names for API
    const normalizedTeam1 = normalizeTeamName(country1);
    const normalizedTeam2 = normalizeTeamName(country2);

    // Try The Odds API format (common betting odds API)
    // This is a flexible implementation that can work with different APIs
    try {
      // Option 1: The Odds API (api.the-odds-api.com)
      const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds`;
      const oddsResponse = await axios.get(oddsApiUrl, {
        params: {
          apiKey: apiKey,
          regions: 'us,uk',
          markets: 'h2h,spreads,totals',
        },
        timeout: 10000,
      });

      // Filter for matches involving our teams
      const matchingOdds = oddsResponse.data.filter(event => {
        const homeTeam = event.home_team?.toLowerCase() || '';
        const awayTeam = event.away_team?.toLowerCase() || '';
        const team1Lower = normalizedTeam1.toLowerCase();
        const team2Lower = normalizedTeam2.toLowerCase();
        
        return (homeTeam.includes(team1Lower) || awayTeam.includes(team1Lower) ||
                homeTeam.includes(team2Lower) || awayTeam.includes(team2Lower)) &&
               (homeTeam.includes(team1Lower) || homeTeam.includes(team2Lower) ||
                awayTeam.includes(team1Lower) || awayTeam.includes(team2Lower));
      });

      if (matchingOdds.length > 0) {
        return res.json({
          team1: country1,
          team2: country2,
          odds: matchingOdds[0].bookmakers || [],
          event: matchingOdds[0],
        });
      }
    } catch (oddsApiError) {
      console.log('The Odds API failed, trying alternative...');
    }

    // Option 2: SportsDataIO or similar API format
    try {
      // Alternative API format - adjust based on your actual API
      const altApiUrl = `https://api.sportsdata.io/v3/soccer/odds/json/GameOddsByDate/2026-06-01`;
      const altResponse = await axios.get(altApiUrl, {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
        },
        timeout: 10000,
      });

      // Filter for matching teams
      const matchingGames = altResponse.data.filter(game => {
        const homeTeam = game.HomeTeam?.toLowerCase() || '';
        const awayTeam = game.AwayTeam?.toLowerCase() || '';
        const team1Lower = normalizedTeam1.toLowerCase();
        const team2Lower = normalizedTeam2.toLowerCase();
        
        return (homeTeam.includes(team1Lower) && awayTeam.includes(team2Lower)) ||
               (homeTeam.includes(team2Lower) && awayTeam.includes(team1Lower));
      });

      if (matchingGames.length > 0) {
        return res.json({
          team1: country1,
          team2: country2,
          odds: matchingGames[0].PregameOdds || [],
          event: matchingGames[0],
        });
      }
    } catch (altApiError) {
      console.log('Alternative API failed');
    }

    // If no odds found, return a mock response structure
    // This allows the frontend to work even if the API doesn't have the specific matchup
    return res.json({
      team1: country1,
      team2: country2,
      odds: [],
      event: null,
      message: 'No betting odds available for this matchup at this time',
      mock: true,
    });

  } catch (error) {
    console.error('Error fetching betting odds:', error);
    res.status(500).json({ 
      message: 'Failed to fetch betting odds', 
      error: error.message 
    });
  }
});

export default router;

