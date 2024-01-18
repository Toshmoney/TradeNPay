const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const questionSchema = new Schema({
    question: String,
    options: [String],
    correctOption: Number,
  });
  
  const Question = model('Question', questionSchema);

  module.exports = Question;