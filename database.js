import mongoose  from 'mongoose'


const mongouri= "mongodb://voyageblue457:BJhTnHTtJPCNqZm4@ac-etoxoda-shard-00-00.pytsqsl.mongodb.net:27017,ac-etoxoda-shard-00-01.pytsqsl.mongodb.net:27017,ac-etoxoda-shard-00-02.pytsqsl.mongodb.net:27017/cashapp?ssl=true&replicaSet=atlas-12avc8-shard-0&authSource=admin&appName=Cluster0"
 
const connectDB = () => {

    mongoose.connect(mongouri
    ).then((result) => {
        console.log('mongo connected');
    })
        .catch((err) => { console.log(err) });
}

export default connectDB




