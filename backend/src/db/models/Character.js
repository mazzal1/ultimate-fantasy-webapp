import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    background: { type: String, default: '' },
    level: { type: Number, required: true, default: 1 },
    currentHp: { type: Number, required: true, default: 10 },
    maxHp: { type: Number, required: true, default: 10 },
    currentStamina: { type: Number, required: true, default: 10 },
    maxStamina: { type: Number, required: true, default: 10 },
    currentMana: { type: Number, required: true, default: 10 },
    maxMana: { type: Number, required: true, default: 10 },
    strength: { type: Number, required: true, default: 10 },
    dexterity: { type: Number, required: true, default: 10 },
    constitution: { type: Number, required: true, default: 10 },
    intelligence: { type: Number, required: true, default: 10 },
    wisdom: { type: Number, required: true, default: 10 },
    charisma: { type: Number, required: true, default: 10 },
    skills: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = ret._id.toString(); delete ret._id; } } },
);

export const Character = mongoose.models.Character || mongoose.model('Character', CharacterSchema);
