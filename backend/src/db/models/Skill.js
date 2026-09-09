import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    effect: { type: String, required: true, trim: true },
    rank: { type: Number, required: true, min: 1, max: 5 },
    minLevelRequirement: { type: Number },
    requiredSkillId: { type: String },
    requiredSkillRank: { type: Number },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = ret._id.toString(); delete ret._id; } } },
);

export const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
