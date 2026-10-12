# GraphQL API Reference

## Queries

- `getCharacter(id: ID!)`
- `listMyCharacters`
- `getCampaign(id: ID!)`
- `listMyCampaigns`
- `listSkills`
- `getSkill(id: ID!)`
- `getMe`

## Mutations

- `createCharacter(input)`
- `updateCharacter(id, input)`
- `deleteCharacter(id)`
- `createCampaign(input)`
- `updateCampaign(id, input)`
- `joinCampaign(campaignId)`
- `assignCharacterToCampaign(campaignId, characterId)`
- `createSkill(input)`
- `updateSkill(id, input)`

## Authorization rules

- All character operations require authentication and ownership.
- Campaign reads require game master or player membership.
- Campaign updates require the game master.
- Skill creation and update require Cognito `Admins` group membership.
