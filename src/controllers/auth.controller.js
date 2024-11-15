const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const crypto = require('crypto');



exports.signup = async (req, res) => {

  try {

    // Save User to Database

  const validation = validateIdentifier(req.body.identifier);
    
  if (!validation.valid) {
    return res.status(400).send({
      "status": "failure",
      "message": "Email hoặc số điện thoại không hợp lệ",
      "data": {
        "identifier": "Email hoặc số điện thoại không hợp lệ"
      }
    });
  }

  // Kiểm tra xem người dùng đã tồn tại chưa
  const existingUser = await User.findOne({ where: { identifier: req.body.identifier } });
  if (existingUser != null) {

    if (existingUser.active) {
      return res.status(400).send({
        "status": "failure",
        "message": "Email hoặc số điện thoại đã tồn tại",
        "data": {
          "identifier": "Email hoặc số điện thoại đã tồn tại"
        }
      });
    } 
  }
  const userData = {
    identifier: req.body.identifier,
    fullname: req.body.fullname,
    password: bcrypt.hashSync(req.body.password, 8),
    user_type: 'student'
  };

  if (validation.type === 'phone') {
    userData.phone_number = userData.identifier;
  } else if (validation.type === 'email') {
    userData.email = userData.identifier;
  }
    // Tạo người dùng
    const newUser = await User.create(userData);

    // Gửi phản hồi thành công
    res.status(200).send({
      "status": "success",
      "message": "Đăng ký thành công",
      "data": {
        "identifier": newUser.identifier,
        "type": validation.type,
      }
    });
  } catch (err) {
    // Xử lý lỗi
    res.status(500).send({ success: false, message: err.message });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      identifier: req.body.identifier || ""
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          "status": "failure",
          "message": "Tài khoản hoặc mật khẩu không đúng"
      });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          "message": "Tài khoản hoặc mật khẩu không đúng"
        });
      }
      
      if (!user.active) {
        return res.status(401).send({
          accessToken: null,
          "message": "Tài khoản không tồn tại, vui lòng thử lại"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400*30, // 24 hours
                              });

      res.status(200).send(
        {
          "status": "success",
          "message": "Đăng nhập thành công",
          "data": {
            id: user.id,
            identifier: user.identifier,
            fullname: user.fullname,
            email: user.email,
            phone_number: user.phone_number,
            avatar: user.avatar,
            user_type: user.user_type,
            access_token: token
          }
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.changePassword = (req, res) => {
  try {
    const userId = req.userId; 
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;

    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: `Invalid body`,
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).send({
        success: false,
        message: 'Mật khẩu mới không được trùng với mật khẩu cũ. Vui lòng chọn mật khẩu khác.',
      });
    }

    User.findOne({
      where: {
        id: userId,
      }
    }).then(user => {
      if (!user || !user.active) { // User not found or user is not active
        return res.status(404).send({
          success: false,
          message: "Lỗi không xác định, vui lòng thử lại sau"
        });
      }

      var oldPasswordIsValid = bcrypt.compareSync(
        oldPassword,
        user.password
      );

      if (!oldPasswordIsValid) {
        return res.status(401).send({
          success: false,
          message: "Mật khẩu cũ không khớp, vui lòng thử lại"
        });
      }
      const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

      user.update({ password: hashedNewPassword })
      .then(() => {
        res.status(200).send({
          success: true,
          message: 'Đổi mật khẩu thành công!',
        });
      })
      .catch((err) => {
        res.status(500).send({
          success: false,
          message: 'Không thể cập nhật mật khẩu, vui lòng thử lại sau',
        });
      });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};


function validateIdentifier(identifier) {
  // Kiểm tra định dạng email
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Kiểm tra định dạng số điện thoại (dùng cho định dạng quốc tế và nội địa)
  const phoneRegex = /^[0-9]{10,15}$/;  // Số điện thoại có 10 đến 15 chữ số

  if (emailRegex.test(identifier)) {
      return { type: 'email', valid: true };
  } else if (phoneRegex.test(identifier)) {
      return { type: 'phone', valid: true };
  } else {
      return { type: null, valid: false };
  }
}

