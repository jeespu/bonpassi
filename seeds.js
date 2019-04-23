const mongoose = require("mongoose");
const Event = require("./models/event");
const request = require("request");
const meteli = require('./meteli.json');
const menoinfo = require("./menoinfo.json");

mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://heroku_t3bhk87c:c41hp21eam24mtr3cvpe602m1d@ds143666.mlab.com:43666/heroku_t3bhk87c", { useNewUrlParser: true }, (err) => {
   if (err)
      console.log("ERROR: DB connection: " + err)
});

//seedDB();

// Menoinfo ja meteli data
const eventData = meteli.event.concat(menoinfo.event);
console.log(eventData)
eventData.forEach(event => {
   let newEvent = {
      name: event.name,
      image: event.image,
      url: event.url,
      date: event.date,
      location: event.location,
      author: event.author,
      tickets: event.tickets,
   };
   console.log(newEvent)
   // Lisää ja tallenna tapahtuma databaseen
   Event.create(newEvent, (err, newlyCreated) => {
      if (err)
         console.log(err);
      else
         console.log(newlyCreated);
   });
})

// Bailataan Jyväskylä events
let data = {};
let urlEvents = 'https://www.parsehub.com/api/v2/runs/tHra_a8S2iDO/data?api_key=tzO4YZDoS3MH';
// Data encoodattu gzip-muotoon
request(urlEvents, { gzip: true }, (error, response, body) => {
   if (!error && response.statusCode === 200) {
      data = JSON.parse(body);
      data.event.forEach(event => {
         let dateData = event.date.split("@");
         let date = dateData[0];
         let location = dateData[1];
         let newEvent = {
            name: event.name,
            image: event.image,
            url: event.url,
            date: date,
            location: location,
            author: event.author,
            tickets: event.tickets
         };
         //console.log(newEvent)
         // Lisää ja tallenna tapahtuma databaseen
         Event.create(newEvent, (err, newlyCreated) => {
            if (err)
               console.log(err);
            else
               console.log(newlyCreated);
         });
      });
   }
});

// // Empty DB
function seedDB() {
   Event.remove({}, function (err) {
   });
}

//module.exports = seedDB;