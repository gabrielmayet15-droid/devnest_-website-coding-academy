import test from 'node:test';
import assert from 'node:assert/strict';
import { generateWeeklyActivityGrid, calculateWeeklyStats } from './streak';

test('generateWeeklyActivityGrid returns 7 days of the week', () => {
  const grid = generateWeeklyActivityGrid(3, 50, 1, new Date('2026-10-30T10:00:00Z'));
  assert.equal(grid.length, 7);
  assert.equal(grid[0].dayName, 'Mon');
  assert.equal(grid[6].dayName, 'Sun');
});

test('calculateWeeklyStats returns correct met goals and percentage', () => {
  const grid = generateWeeklyActivityGrid(5, 50, 1, new Date('2026-10-30T10:00:00Z'));
  const stats = calculateWeeklyStats(grid);
  assert.ok(stats.metDays >= 1);
  assert.equal(stats.totalDays, 7);
  assert.ok(stats.percentage >= 0 && stats.percentage <= 100);
});
