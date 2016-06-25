var mongoose = require('mongoose');
var URIString = process.env.MONGOLAB_URI || 'mongodb://localhost/whatsthatsong';
var db = mongoose.connection;
var Schema = mongoose.Schema;

mongoose.connect(URIString);

var entry = new Schema({
  date_created: {
    type: Date,
    default: Date.now
  },
  content: String,
  song: String,
  artist: String
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
  console.log('Successfully connected to database.');
});

module.exports = mongoose.model('Entry', entry);
