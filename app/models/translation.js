// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TranslationSchema = new Schema({
  translation: String,
  suggestion: String,
  language: String
});

TranslationSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Translation', TranslationSchema);

