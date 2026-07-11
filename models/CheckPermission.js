import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Check = new Schema(
  {
    lightningInvoice: {
      type: Boolean,
      default: true,
    },
    lightningInvoice2: 
    { type: Boolean, default: false },
  },
  { timestamps: true },
);

const CheckPermission = mongoose.model("CheckPermission", Check);

export default CheckPermission;

