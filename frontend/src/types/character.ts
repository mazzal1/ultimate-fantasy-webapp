export interface Character {
  id: string;
  userId: string;
  name: string;
  background?: string;
  level: number;
  currentHp: number;
  maxHp: number;
  currentStamina: number;
  maxStamina: number;
  currentMana: number;
  maxMana: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CharacterInput {
  name: string;
  background?: string;
  level?: number;
  maxHp?: number;
  maxStamina?: number;
  maxMana?: number;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
}

export interface CharacterUpdateInput extends Partial<CharacterInput> {
  currentHp?: number;
  currentStamina?: number;
  currentMana?: number;
  skills?: string[];
}
