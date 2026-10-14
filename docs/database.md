# Database Schema (Skill Ranker / Ultimate Fantasy v0.3)

## User

- `id`
- `email`
- `username`
- `characterCount`
- `createdAt`, `updatedAt`

## Character

- `id`
- `userId`
- `name`
- `playerName`, `gender`, `race`, `age`, `background`
- `level`, `statPoints`, `skillPoints`
- `coreStats` (ranks for: strength, agility, dexterity, resilience, magic, willpower, acumen, charisma, luck)
- `currentMana`, `maxMana`
- `currentStamina`, `maxStamina`
- `wounds`
- `competencyStates[]` (`competencyId`, `rank`)
- `skillStates[]` (`skillId`, `rank`)
- `titleIds[]`
- `itemStates[]` (`itemId`, `equipped`)
- `createdAt`, `updatedAt`

## Campaign

- `id`
- `name`
- `description`
- `notes`
- `gameMasterId`
- `playerIds[]`
- `characterIds[]`
- `createdAt`, `updatedAt`

## Ability (Skill / Item)

- `id`
- `ownerUserId` (nullable for system abilities)
- `kind` (`SKILL` or `ITEM`)
- `name`
- `description`
- `maxRank`
- `activationType`
- `manaCost`, `staminaCost`
- `minLevelRequirement`
- `requiredAbilityIds[]`
- `requiredTitleIds[]`
- `tags[]`
- `isSystem`
- `sharedCampaignIds[]`
- `createdAt`, `updatedAt`

## Competency

- `id`
- `ownerUserId` (nullable for system competencies)
- `name`
- `description`
- `tags[]`
- `isSystem`
- `sharedCampaignIds[]`
- `createdAt`, `updatedAt`

## Title

- `id`
- `name`
- `description`
- `isSystem`
- `createdAt`, `updatedAt`
