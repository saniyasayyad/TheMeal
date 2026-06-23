import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  passwordHash: string
  role: 'user' | 'admin'
  avatar: string
  preferences: {
    dietaryTags: string[]
    cuisines: string[]
    allergies: string[]
  }
  isVerified: boolean
  refreshToken?: string
  createdAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar:       { type: String, default: '' },
    preferences: {
      dietaryTags: { type: [String], default: [] },
      cuisines:    { type: [String], default: [] },
      allergies:   { type: [String], default: [] },
    },
    isVerified:   { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10)
  next()
})

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash)
}

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash
    delete ret.refreshToken
    return ret
  },
})

export const User = mongoose.model<IUser>('User', userSchema)
