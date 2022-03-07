const mongoose = require('mongoose');

// tickets 
var ticketsSchema = mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  departureTime: String,
  price: Number,
})

// user 
var userSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password:String,
    historyTickets: [ticketsSchema]
  });
  
var userModel = mongoose.model('users', userSchema);

module.exports = userModel