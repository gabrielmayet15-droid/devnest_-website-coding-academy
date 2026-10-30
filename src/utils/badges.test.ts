import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBadges } from './badges';

test('evaluateBadges unlocks badges based on student progress stats', () => {
  const initialStats = {
    lessonsCompleted: 0,
    meetSessionsJoined: 0,
    chatMessagesSent: 0,
    streakDays: 1,
    playgroundProjectsRun: 0,
    totalXP: 0,
  };

  const initialResult = evaluateBadges(initialStats, []);
  assert.equal(initialResult.newlyUnlocked.length, 0);

  // Student runs first code
  const stepStats = { ...initialStats, playgroundProjectsRun: 1, totalXP: 50 };
  const stepResult = evaluateBadges(stepStats, []);
  assert.equal(stepResult.newlyUnlocked.length, 1);
  assert.equal(stepResult.newlyUnlocked[0].id, 'first_step');

  // Student joins meet and sends chat
  const activeStats = {
    ...stepStats,
    meetSessionsJoined: 1,
    chatMessagesSent: 2,
    totalXP: 550, // Should also unlock silver league
  };
  const activeResult = evaluateBadges(activeStats, ['first_step']);
  const unlockedIds = activeResult.newlyUnlocked.map(b => b.id);
  assert.ok(unlockedIds.includes('meet_pioneer'));
  assert.ok(unlockedIds.includes('collab_hero'));
  assert.ok(unlockedIds.includes('league_climber'));
});
