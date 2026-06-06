import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const passwordSchema = new Schema({
    totalRequest: { type: Number, default: 0 },
    totalChanged: { type: Number, default: 0 },
    constant: { type: String, default: "yanky" },

}, { timestamps: true })



const Password = mongoose.model('Password', passwordSchema);
export default Password

// https://stackoverflow.com/questions/74977542/how-to-add-expire-time-to-verification-code-nodejs