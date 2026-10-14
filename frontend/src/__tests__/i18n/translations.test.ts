import { describe, expect, it } from 'vitest';
import { translations } from '../../i18n/translations';

describe('i18n translations', () => {
  it('keeps italian and english keys aligned', () => {
    const englishKeys = Object.keys(translations.en).sort();
    const italianKeys = Object.keys(translations.it).sort();

    expect(italianKeys).toEqual(englishKeys);
  });
});
