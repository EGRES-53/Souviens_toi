import { expect, test } from 'vitest';
import { filterStories, formatStoryDate, validateStoryContent } from '../utils/stories';

test('filterStories filters stories by search term', () => {
  const stories = [
    { id: '1', title: 'Histoire de grand-père', content: 'Contenu 1' },
    { id: '2', title: 'Recette de famille', content: 'Histoire de la recette' },
    { id: '3', title: 'Anecdote', content: 'Une histoire drôle' }
  ];
  const filtered = filterStories(stories, 'histoire');
  expect(filtered).toHaveLength(3);
});

test('formatStoryDate formats dates correctly', () => {
  const date = new Date('2024-03-15').toISOString();
  expect(formatStoryDate(date)).toBe('15 mars 2024');
});

test('validateStoryContent validates story content', () => {
  expect(validateStoryContent('')).toBe(false);
  expect(validateStoryContent('a'.repeat(10))).toBe(false);
  expect(validateStoryContent('Une histoire suffisamment longue')).toBe(true);
});