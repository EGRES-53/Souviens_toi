import { expect, test } from 'vitest';
import { formatDate, sortEvents, filterEvents } from '../utils/timeline';

test('formatDate formats dates correctly', () => {
  expect(formatDate('2024-03-15', true)).toBe('15 mars 2024');
  expect(formatDate('2024-03-15', false)).toBe('2024');
  expect(formatDate('invalid-date', true)).toBe('Date invalide');
});

test('sortEvents sorts events by date', () => {
  const events = [
    { id: '1', date: '2024-03-15', title: 'Event 1' },
    { id: '2', date: '2024-01-01', title: 'Event 2' },
    { id: '3', date: '2024-12-25', title: 'Event 3' }
  ];
  const sorted = sortEvents(events);
  expect(sorted[0].date).toBe('2024-01-01');
  expect(sorted[2].date).toBe('2024-12-25');
});

test('filterEvents filters events by search term', () => {
  const events = [
    { id: '1', title: 'Mariage', description: 'Description 1' },
    { id: '2', title: 'Naissance', description: 'Description 2' },
    { id: '3', title: 'Anniversaire', description: 'Mariage d\'or' }
  ];
  const filtered = filterEvents(events, 'mariage');
  expect(filtered).toHaveLength(2);
});