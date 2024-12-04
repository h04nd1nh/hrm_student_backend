const db = require("../models");
const User = db.user;
const FaceDescriptor = db.faceDescriptor;
const { Op, transaction } = db.Sequelize;
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fs = require("fs");

// Set up canvas cho face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Biến toàn cục để lưu trạng thái mô hình đã tải
let modelsLoaded = false;

// Tải các mô hình của face-api.js chỉ một lần khi ứng dụng khởi động
exports.loadModels = async () => {
  if (!modelsLoaded) {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
      await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
      await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
      modelsLoaded = true;
      console.log("Mô hình face-api.js đã được tải thành công");
    } catch (error) {
      console.error("Lỗi khi tải mô hình face-api.js:", error);
      throw new Error("Không thể tải mô hình nhận diện khuôn mặt");
    }
  }
};

// Hàm tính toán khoảng cách Euclidean giữa hai face descriptor
const getEuclideanDistance = (descriptor1, descriptor2) => {
  return Math.sqrt(
    descriptor1.reduce((sum, value, index) => sum + Math.pow(value - descriptor2[index], 2), 0)
  );
};

// Hàm lấy Face Descriptor từ ảnh
const getFaceDescriptorFromImage = async (imagePath) => {
  try {
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    if (detections) {
      return detections.descriptor;  // Trả về Face Descriptor
    } else {
      throw new Error("Không phát hiện khuôn mặt trong ảnh.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy Face Descriptor:", error);
    throw error;
  }
};

// Hàm cập nhật Face Descriptor cho người dùng
exports.update_face_descriptor = async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng tải lên một tệp ảnh' });
  }

  try {

    // Lấy Face Descriptor từ ảnh
    const imagePath = path.resolve(req.file.path);  // Đường dẫn đến ảnh đã upload
    const descriptor = await getFaceDescriptorFromImage(imagePath);

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findOne({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Cập nhật Face Descriptor vào cơ sở dữ liệu
    let faceDescriptor = await FaceDescriptor.findOne({ where: { user_id: userId } });

    if (faceDescriptor) {
      // Nếu đã có Face Descriptor cho người dùng, cập nhật nó
      faceDescriptor.descriptor = descriptor;
      await faceDescriptor.save();
      return res.status(200).json({ message: 'Cập nhật khuôn mặt thành công' });
    } else {
      // Nếu chưa có, tạo mới Face Descriptor
      await FaceDescriptor.create({
        user_id: userId,
        label: user.fullname || 'unknown',  // Sử dụng fullname của người dùng làm nhãn
        descriptor: descriptor,
      });
      return res.status(201).json({ message: 'Thêm khuôn mặt thành công' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật khuôn mặt:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
  } finally {
    // Xóa file ảnh tạm sau khi xử lý xong
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// Hàm xác thực khuôn mặt
exports.face_identify = async (req, res) => {
  try {
    // Kiểm tra nếu không có file được upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng tải lên một tệp ảnh" 
      });
    }

    // Lấy descriptor từ ảnh được upload
    const imagePath = path.resolve(req.file.path);
    const uploadedDescriptor = await getFaceDescriptorFromImage(imagePath);

    if (!uploadedDescriptor) {
      return res.status(400).json({success: false, message: "Không thể phát hiện khuôn mặt trong ảnh" });
    }

    // Tìm FaceDescriptor từ database dựa trên userId
    const userId = req.userId; // Lấy userId từ token hoặc request
    const faceDescriptor = await FaceDescriptor.findOne({ where: { user_id: userId } });

    if (!faceDescriptor) {
      return res.status(404).json({ message: "Không tìm thấy dữ liệu khuôn mặt cho người dùng này" });
    }

    // So sánh descriptor được upload với descriptor trong database
    const storedDescriptor = faceDescriptor.descriptor; // Descriptor từ database
    const distance = getEuclideanDistance(uploadedDescriptor, storedDescriptor);

    // Ngưỡng để xác định hai khuôn mặt là giống nhau
    const threshold = 0.6;

    // Kiểm tra xem khoảng cách có nằm trong ngưỡng
    if (distance < threshold) {
      return res.status(200).json({
        success: true,
        message: "Khuôn mặt khớp"
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Khuôn mặt không khớp"
      });
    }
  } catch (error) {
    console.error("Lỗi khi xác thực khuôn mặt:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    // Xóa file ảnh tạm sau khi xử lý xong
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
  }
};
