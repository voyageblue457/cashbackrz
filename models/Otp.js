import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const otpSchema = new Schema({

    otp: {
        type: String,
    },
    username: {
        type: String,
    },
}, { timestamps: true })



const Otp = mongoose.model('Otp', otpSchema);
export default Otp
