
const { authJwt } = require("../middleware");
const controller = require("../controllers/timetable_teacher.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });



  app.get("/hrmstudent/api/v1/student/timetable_teacher", [authJwt.verifyToken],controller.get_time_table_teacher);
  app.get("/hrmstudent/api/v1/student/current_timetable_teacher", [authJwt.verifyToken],controller.get_current_time_table);
  app.post("/hrmstudent/api/v1/student/timetable_teacher", [authJwt.verifyToken],controller.add_time_table_teacher);
};