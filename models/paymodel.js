const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  amount: Number,
  status: String,
});

module.exports = mongoose.model("payments", paymentSchema);
