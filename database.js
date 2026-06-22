import mongoose  from 'mongoose'


const mongouri ="mongodb://cashapp:yEphxwEYS7ScREAw@ac-vd0hedy-shard-00-00.neq5upx.mongodb.net:27017,ac-vd0hedy-shard-00-01.neq5upx.mongodb.net:27017,ac-vd0hedy-shard-00-02.neq5upx.mongodb.net:27017/cashapp?ssl=true&replicaSet=atlas-nibxzo-shard-0&authSource=admin&appName=Cluster0"
 // const mongouri="mongodb://razu009:razu008@31.97.181.120:27017/cashapp?replicaSet=rs0&authSource=cashapp"
const connectDB = () => {

    mongoose.connect(mongouri
    ).then((result) => {
        console.log('mongo connected');
    })
        .catch((err) => { console.log(err) });
}

export default connectDB




