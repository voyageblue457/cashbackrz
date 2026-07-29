import mongoose from "mongoose";

const Schema = mongoose.Schema;
const feeConfigSchema = new Schema(
  {
    key: {
      type: String,
      default: "fee_toggle",
      unique: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FeeConfig = mongoose.model("FeeConfig", feeConfigSchema);

export default FeeConfig;
