import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    password: { type: String },
    adminId: { type: String },
    permission: { type: Boolean, default: false },
    verifyId: { type: Boolean, default: false },

    posters: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Poster",
      },
    ],

    numOfPosters: { type: Number, default: 0 },
    numOfPostersPermission: { type: Number, default: 0 },
    validity: { type: Number, default: 0 },

    admin: { type: Boolean, default: true },
    links: { type: Array, default: [] },
    updated_at: { type: Date },

    qrCodeStatus: { type: Boolean, default: false },
    showTagField: { type: Boolean, default: false },

    phone: { type: String },
    email: { type: String, trim: true },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
