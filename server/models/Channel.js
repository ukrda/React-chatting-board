const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  totalMessages: {
    type: Number,
    default: 0,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;
