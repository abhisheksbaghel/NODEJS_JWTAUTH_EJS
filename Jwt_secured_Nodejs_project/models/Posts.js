const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
 title: {
  type: String,
  required: true,
 },
 body: {
  type: String,
  required: true,
  minlength: 5,
  maxlength: 100,
  alphanumeric: true
 },
 date: {
  type: Date,
  default: Date.now,
 }
});
module.exports = mongoose.model('Posts', PostSchema)