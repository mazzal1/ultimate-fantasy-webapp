import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    characterCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { ret.id = ret._id.toString(); delete ret._id; } } },
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
