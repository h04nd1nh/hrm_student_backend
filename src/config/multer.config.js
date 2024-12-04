const multer = require('multer');

// Cấu hình Multer để lưu file ảnh vào thư mục tạm thời
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Lưu ảnh vào thư mục uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage: storage });

module.exports = upload;