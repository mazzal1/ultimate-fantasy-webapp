# Database Schema

## Character

- `userId`
- `name`
- `background`
- `level`
- `currentHp`, `maxHp`
- `currentStamina`, `maxStamina`
- `currentMana`, `maxMana`
- `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`
- `skills[]`
- `createdAt`, `updatedAt`

## Campaign

- `name`
- `description`
- `notes`
- `gameMasterId`
- `playerIds[]`
- `characterIds[]`
- `createdAt`, `updatedAt`

## Skill

- `name`
- `effect`
- `rank`
- `minLevelRequirement`
- `requiredSkillId`
- `requiredSkillRank`
- `tags[]`
- `createdAt`, `updatedAt`

## User

- `email`
- `username`
- `characterCount`
