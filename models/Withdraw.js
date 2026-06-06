import mongoose from "mongoose";

const Schema = mongoose.Schema;
const withdrawSchema = new Schema(
  {
    userId: {
      type: String, // The admin or poster ID requesting the withdrawal
      required: true,
    },
    rootId: {
      type: String, // The admin ID who will approve this request
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

export default Withdraw;
