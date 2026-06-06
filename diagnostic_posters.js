import mongoose from 'mongoose';

const mongouri = "mongodb://voyageblue457:BJhTnHTtJPCNqZm4@ac-etoxoda-shard-00-00.pytsqsl.mongodb.net:27017,ac-etoxoda-shard-00-01.pytsqsl.mongodb.net:27017,ac-etoxoda-shard-00-02.pytsqsl.mongodb.net:27017/cashapp?ssl=true&replicaSet=atlas-12avc8-shard-0&authSource=admin&appName=Cluster0";

// Define minimal Poster Schema
const PosterSchema = new mongoose.Schema({
  username: String,
  posterId: String,
  root: mongoose.Schema.Types.ObjectId,
});

const Poster = mongoose.models.Poster || mongoose.model('Poster', PosterSchema);

async function run() {
  try {
    await mongoose.connect(mongouri);
    console.log('Connected to MongoDB Atlas!');
    
    const docs = await Poster.find().lean();
    console.log('ALL POSTERS IN DB:');
    console.log(JSON.stringify(docs, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error connecting or querying:', err);
    process.exit(1);
  }
}

run();
