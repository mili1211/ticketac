var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journey');
var userModel = require('../models/user')

var city = ["Paris", "Marseille", "Nantes", "Lyon", "Rennes", "Melun", "Bordeaux", "Lille"]
var date = ["2018-11-20", "2018-11-21", "2018-11-22", "2018-11-23", "2018-11-24"]



/* GET home page. */
router.get('/home', function (req, res, next) {

  if (req.session.user == undefined) {
    req.session.user = [];
  }
  res.render('index', { user: req.session.user });
});

/* GET Login page. */
router.get('/', function (req, res, next) {

  if (req.session.user == undefined) {
    req.session.user = [];
  }
  res.render('login', { alertMessage: '' });
});


/* Available journeys in the data base */

router.post('/journeys', async function (req, res, next) {

  let availableJourneys = await journeyModel.find(
    {
      departure: req.body.departureCity,
      arrival: req.body.arrivalCity,
      date: req.body.journeyDate
    })

  req.session.journey = []

  if (availableJourneys[0] == undefined) {

    res.render('notrain')

  } else {
    for (var i = 0; i < availableJourneys.length; i++) {
      req.session.journey.push(availableJourneys[i])
    }
    res.render('tickets', { availableJourneys: req.session.journey })
  }
});

/* Selected journeys by the user */

router.get('/checkout', async function (req, res, next) {

  if (req.session.mytickets == undefined) {
    req.session.mytickets = []
  }

  let journey = await journeyModel.findById(req.query.id);

  req.session.mytickets.push(journey);

  res.render('mytickets', { mytickets: req.session.mytickets })
});

/* Purchased tickets */

router.get('/confirmReservation', async function (req, res, next) {

  var user = await userModel.findById(req.session.user)

  console.log(' /confirmReservation : we found the user --->', user);

  if (req.session.mytickets == undefined) {

    req.session.mytickets = []
  } else {
    for (i = 0; i < req.session.mytickets.length; i++) {

      user.historyTickets.push({
        departure: req.session.mytickets[i].departure,
        arrival: req.session.mytickets[i].arrival,
        date: req.session.mytickets[i].date,
        departureTime: req.session.mytickets[i].departureTime,
        price: req.session.mytickets[i].price,
      });

      await user.save();

      console.log('/confirmReservation : session --->', req.session.mytickets);
    }


  }
  res.render('index', { user: req.session.user });

});

router.get('/mylasttrips', async function (req, res, next) {

  var historicTravel = [];

  var user = await userModel.findById(req.session.user)

  console.log("On a bien le user suivant dans myLastTrips -->", user);

  res.render('mylasttrips', { historicTravel: user.historyTickets });
});



// To fill the data base
router.get('/save', async function (req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if (departureCity != arrivalCity) {

      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });

      await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// This route is only verification of route Save.
router.get('/result', function (req, res, next) {

  // It allows us to know how many journeys is in the base per a city 
  for (i = 0; i < city.length; i++) {

    journeyModel.find(
      { departure: city[i] }, //filtre

      function (err, journey) {

        console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }

  res.render('index', { title: 'Express' });
});

module.exports = router;
