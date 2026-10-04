import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const linkSchema = new Schema({
    linkName: {
        type: String,
        trim: true

    },
    root: {
        type: mongoose.Schema.Types.ObjectId,

        ref: 'Poster'
    },
    targetUrl: {
        type: String,
        trim: true
    },
    theme: {
        type: String,
        default: "Cash Green"
    },
    fixedAmount: {
        type: String,
        default: "Open"
    },
    minAmount: {
        type: Number,
        default: 1
    },
    maxAmount: {
        type: Number,
        default: 2000
    },
    defaultAmount: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    brandName: {
        type: String,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
}, { timestamps: true })

const Link = mongoose.model('Link', linkSchema);
export default Link



