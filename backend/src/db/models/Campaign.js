import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    notes: { type: String, default: '' },
    gameMasterId: { type: String, required: true, index: true },
    playerIds: { type: [String], default: [] },
    characterIds: { type: [String], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = ret._id.toString(); delete ret._id; } } },
);

export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
