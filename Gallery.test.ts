import { expect, test } from 'vitest';
import { filterMedia, sortMediaByDate, validateMediaType } from '../utils/gallery';

test('filterMedia filters media by search term', () => {
  const media = [
    { id: '1', title: 'Photo de mariage', type: 'image' },
    { id: '2', title: 'Document important', type: 'document' },
    { id: '3', title: 'Photo de famille', type: 'image' }
  ];
  const filtered = filterMedia(media, 'photo');
  expect(filtered).toHaveLength(2);
});

test('sortMediaByDate sorts media by date', () => {
  const media = [
    { id: '1', created_at: '2024-03-15' },
    { id: '2', created_at: '2024-01-01' },
    { id: '3', created_at: '2024-12-25' }
  ];
  const sorted = sortMediaByDate(media);
  expect(sorted[0].created_at).toBe('2024-12-25');
});

test('validateMediaType validates file types', () => {
  expect(validateMediaType('image/jpeg')).toBe(true);
  expect(validateMediaType('image/png')).toBe(true);
  expect(validateMediaType('application/pdf')).toBe(true);
  expect(validateMediaType('video/mp4')).toBe(false);
});