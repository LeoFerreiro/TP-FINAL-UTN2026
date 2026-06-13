import { User } from "../models/User.js";

export const userRepository = {
  create: (data) => User.create(data),
  findByEmail: (email) => User.findOne({ email }),
  findById: (id) => User.findById(id),
  findByVerificationHash: (hash) => User.findOne({ verificationTokenHash: hash }),
  save: (user) => user.save()
};
