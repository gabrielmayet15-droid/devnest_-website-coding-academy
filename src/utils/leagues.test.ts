import test from 'node:test';
import assert from 'node:assert/strict';
import { getLeagueByXP, calculateProgressToNextLeague, calculateStreakMultiplier, LEAGUE_TIERS } from './leagues';

test('getLeagueByXP accurately assigns league rank based on points', () => {
  assert.equal(getLeagueByXP(0).id, 'bronze');
  assert.equal(getLeagueByXP(350).id, 'bronze');
  assert.equal(getLeagueByXP(500).id, 'silver');
  assert.equal(getLeagueByXP(1499).id, 'silver');
  assert.equal(getLeagueByXP(1500).id, 'gold');
  assert.equal(getLeagueByXP(3200).id, 'platinum');
  assert.equal(getLeagueByXP(5500).id, 'diamond');
  assert.equal(getLeagueByXP(9000).id, 'master');
});

test('calculateProgressToNextLeague computes correct percentage and remaining XP', () => {
  // Bronze tier: 0 to 500 (range = 500)
  const bronzeProgress = calculateProgressToNextLeague(250);
  assert.equal(bronzeProgress.currentTier.id, 'bronze');
  assert.equal(bronzeProgress.nextTier?.id, 'silver');
  assert.equal(bronzeProgress.percentage, 50);
  assert.equal(bronzeProgress.xpNeededForNext, 250);

  // Silver tier: 500 to 1500 (range = 1000)
  const silverProgress = calculateProgressToNextLeague(1000);
  assert.equal(silverProgress.currentTier.id, 'silver');
  assert.equal(silverProgress.nextTier?.id, 'gold');
  assert.equal(silverProgress.percentage, 50);
  assert.equal(silverProgress.xpNeededForNext, 500);

  // Master tier has no next tier
  const masterProgress = calculateProgressToNextLeague(10000);
  assert.equal(masterProgress.currentTier.id, 'master');
  assert.equal(masterProgress.nextTier, null);
  assert.equal(masterProgress.percentage, 100);
  assert.equal(masterProgress.xpNeededForNext, 0);
});

test('calculateStreakMultiplier calculates bonus rate', () => {
  assert.equal(calculateStreakMultiplier(0), 1.0);
  assert.equal(calculateStreakMultiplier(2), 1.0);
  assert.equal(calculateStreakMultiplier(3), 1.2);
  assert.equal(calculateStreakMultiplier(7), 1.5);
  assert.equal(calculateStreakMultiplier(14), 2.0);
});
