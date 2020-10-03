const mongoose = require("mongoose");

// User schema
const dailySchema = new mongoose.Schema({
  id_str: {
    type: String,
  },
  dream: {
    type: String,
  },
  permalink: {
    type: String,
  },
  screenName: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  retweetCount: {
    type: Number,
  },
  favCount: {
    type: Number,
  },
});

module.exports = mongoose.model("Daily", dailySchema);
