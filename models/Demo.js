import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const demoSchema = new Schema({
    linkName: {
        type: String,
        trim: true

    },
    username: {
        type: String,
        trim: true

    },
    age: {
        type: Number,

    },
    


}, { timestamps: true })


const Demo = mongoose.model('Demo', demoSchema);

export default Demo


