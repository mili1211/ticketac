var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   }
  
  // --------------------- BDD -----------------------------------------------------
  mongoose.connect(`${process.env.DB_CONNECT}`,
    options,
     function(err) {
      if (err) {
        console.log(`error, failed to connect to the database because --> ${err}`);
      } else {
        console.info('*** Database Ticketac connection : Success ***');
      }
     }
  );
  
  module.exports = mongoose 
  