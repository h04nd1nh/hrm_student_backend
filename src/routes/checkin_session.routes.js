
const { authJwt } = require("../middleware");
const controller = require("../controllers/checkin_session.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });



  app.post("/hrmstudent/api/v1/student/checkin_session", [authJwt.verifyToken],controller.create_checkin_session);
  app.put("/hrmstudent/api/v1/student/checkin_session/:session_id", [authJwt.verifyToken],controller.checkin);
  app.get("/hrmstudent/api/v1/student/checkin_session", [authJwt.verifyToken],controller.get_checkin);
  
};