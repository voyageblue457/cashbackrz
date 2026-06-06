import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const clickSchema = new Schema({

    click: { type: Number, default: 0 },
    adminId: { type: String },
    posterId: { type: String },
    site:{ type: String },
    desktop:{  type: Number, default: 0 },
    phone:{  type: Number, default: 0 },
    ipad:{  type: Number, default: 0 },





}, { timestamps: true })

// userSchema.pre('save', async function(next){
//   const salt=await bcrypt.genSalt();
//   this.password=await bcrypt.hash(this.password,salt);
//   next();
// })

// userSchema.statics.login= async function(email,password){
//        const user=  await this.findOne({email});

//         if(user){
//             const auth=  await bcrypt.compare(password, user.password);
//              if(auth){
//                 return user;

//                 } 
//               throw Error('incorrect password')




//            }
//             throw Error('incorrect email')

// }

const Click = mongoose.model('Click', clickSchema);
export default Click
