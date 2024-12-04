require('@tensorflow/tfjs-node'); 
const express = require("express");
const cors = require("cors");
const i18n = require("i18n");
var url = require("url");
var path = require("path");
global.dummy = 1;

var signalObject = {};
i18n.configure({
  locales: ["en", "de", "vi"],
  register: signalObject,
  directory: path.join(__dirname, "locales"),
  updateFiles: false,
});

const app = express();
app.use(i18n.init);

var corsOptions = {
  origin: "http://localhost:8080",
};

// app.use(cors(corsOptions));
app.use(cors())

// parse requests of content-type - application/json
app.use(express.json({ limit: '10mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// database
const db = require("./src/models");

// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync Database with { force: false }");
  // Init Database
  // initial();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to HRM Student application." });
});

// routes
require("./src/routes/auth.routes")(app);
require("./src/routes/timetable.routes")(app);
require("./src/routes/timetable_teacher.routes")(app);
require("./src/routes/checkin_session.routes")(app);
require("./src/routes/face_descriptor.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


