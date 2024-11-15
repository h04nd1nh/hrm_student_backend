const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  if (!req.body.username) {
    res.status(400).send({
      message: "Failed! Please input Username!"
    });
    return;
  }
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    if (!req.body.username) {
      res.status(400).send({
        message: "Failed! Please input Email!"
      });
      return;
    }
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkDuplicatePhoneNumber = (req, res, next) => {
  // Username
  if (!req.body.phone_number) {
    res.status(400).send({
      message: "Failed! Please input phone_number!"
    });
    return;
  }
  User.findOne({
    where: {
      phone_number: req.body.phone_number
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! phone_number is already in use!"
      });
      return;
    }
    next();
  });
};


// verifyDataSignup = (req, res, next) => {
//   // Username
//   if (!req.body.phone_number) {
//     res.status(400).send({
//       message: "Failed! Please input phone_number!"
//     });
//     return;
//   }
//   User.findOne({
//     where: {
//       phone_number: req.body.phone_number
//     }
//   }).then(user => {
//     if (user) {
//       res.status(400).send({
//         message: "Failed! phone_number is already in use!"
//       });
//       return;
//     }
//     next();
//   });
// };

// function validateIdentifier(identifier) {
//   // Kiểm tra định dạng email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   // Kiểm tra định dạng số điện thoại (dùng cho định dạng quốc tế và nội địa)
//   const phoneRegex = /^[0-9]{10,15}$/;  // Số điện thoại có 10 đến 15 chữ số

//   if (emailRegex.test(identifier)) {
//       return { type: 'email', valid: true };
//   } else if (phoneRegex.test(identifier)) {
//       return { type: 'phone', valid: true };
//   } else {
//       return { type: null, valid: false };
//   }
// }


const verifySignUp = {
  checkDuplicatePhoneNumber: checkDuplicatePhoneNumber
};

module.exports = verifySignUp;
