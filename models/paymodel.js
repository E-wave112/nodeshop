const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    email: String,
    firstname: String,
    lastname: String
})

module.exports = mongoose.model('payments', paymentSchema)