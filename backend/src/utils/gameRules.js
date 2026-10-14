export const RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

export const MIN_LEVEL_BY_RANK = {
  F: 1,
  E: 1,
  D: 10,
  C: 20,
  B: 30,
  A: 40,
  S: 50,
};

const RESOURCE_CAP_BY_RANK = {
  F: 4,
  E: 6,
  D: 8,
  C: 10,
  B: 12,
  A: 16,
  S: 20,
};

export function isValidRank(rank) {
  return RANKS.includes(rank);
}

export function getResourceCapFromRank(rank) {
  return RESOURCE_CAP_BY_RANK[rank] ?? RESOURCE_CAP_BY_RANK.F;
}

export function canUseRankAtLevel(rank, level) {
  if (!isValidRank(rank)) {
    return false;
  }

  return level >= MIN_LEVEL_BY_RANK[rank];
}
