import mongoose from "mongoose";

const Schema = mongoose.Schema;
const amountSchema = new Schema(
  {
    site: {
      type: String,
    },
    amount: {
      type: String,

      lowercase: true,
    },
    adminId: {
      type: String,
    },
    name: {
      type: String,
    },
    posterId: {
      type: String,
    },
    cashTag: {
      type: String,
    },
  },
  { timestamps: true },
);

const Amount = mongoose.model("Amount", amountSchema);

export default Amount;

// 6558fca9d08567217d7b4cef
