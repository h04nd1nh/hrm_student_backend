const { authJwt } = require("../middleware");
const controller = require("../controllers/face_descriptor.controller");
const upload = require('../config/multer.config'); // Import config Multer

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });



  app.put("/hrmstudent/api/v1/student/face_descriptor", [authJwt.verifyToken], upload.single('image'), controller.update_face_descriptor);
  app.put("/hrmstudent/api/v1/student/face_identify", [authJwt.verifyToken], upload.single('image'), controller.face_identify);
  
};