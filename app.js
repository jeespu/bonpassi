const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override")
      Event = require("./models/event"),
      Place = require("./models/place"),
      User = require("./models/user"),
      port = process.env.PORT || 3000;
      //seedDB = require("./seeds");

// Routet
const eventRoutes = require("./routes/events"),
      searchRoute = require("./routes/search"),
      userRoutes = require("./routes/user"),
      indexRoutes = require("./routes/index");

// Database
mongoose.set("useFindAndModify", false);
mongoose.connect("CONNECTION STRING", { useNewUrlParser: true }, (err) => {
   if(err)
      console.log("ERROR: DB connection: " + err)
});
//seedDB(); // Scrapettu data databaseen

// Express asetukset
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// __dirname viittaa kansioon, missä tiedosto sijaitsee
app.use(express.static(__dirname + "/public"))
// method override tarvitaan PUT ja DELETE pyyntöjä varten
app.use(methodOverride("_method")); 
// Flash viestit
app.use(flash());

// Passport asetukset
app.use(require("express-session")({
   // Secret lause voi olla mitä vaan
   secret: "C'est bon! Probablement la meilleure application de tous les temps.",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware tarkistamaan onko käyttäjä kirjautuneena
app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/events", eventRoutes);
app.use("/search", searchRoute);
app.use("/user", userRoutes);


// Käynnistetään serveri!
app.listen(port, () => console.log("JyväsApp Server ON"));