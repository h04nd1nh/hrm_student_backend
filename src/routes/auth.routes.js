const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/hrmstudent/api/v1/auth/signup",
    // [
    //   verifySignUp.checkDuplicatePhoneNumber
    // ],
    controller.signup
  );

  app.post("/hrmstudent/api/v1/auth/signin", controller.signin);
  app.post("/hrmstudent/api/v1/change_password", [authJwt.verifyToken], controller.changePassword);
  // app.post("/hrmstudent/api/v1/auth/forgot-pass", controller.forgotpass);
  // app.post("/hrmstudent/api/v1/auth/forgot-pass-confirm", controller.forgotpassconfirm);
  // app.post('/hrmstudent/api/v1/auth/checkexist', controller.checkexist);
  // app.post('/wedding-planner/api/v1/google/verify', controller.verifyGooogle);
};