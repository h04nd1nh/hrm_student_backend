const db = require("../models");
const config = require("../config/auth.config");
const moment = require("moment");
const User = db.user;
const FaceDescriptor = db.faceDescriptor;
const { Op, transaction } = db.Sequelize;
const faceapi = require('face-api.js');
const canvas = require('@napi-rs/canvas');
const path = require('path');
const upload = require('../config/multer.config');  // Import multer config

// Set up canvas cho face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load các mô hình của face-api.js
const loadModels = async () => {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
    console.log("Mô hình face-api.js đã được tải thành công");
  } catch (error) {
    console.error("Lỗi khi tải mô hình face-api.js:", error);
    throw new Error("Không thể tải mô hình nhận diện khuôn mặt");
  }
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

exports.update_face_descriptor = async (req, res) => {
  const { userId } = req.userId; 
  
  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng tải lên một tệp ảnh' });
  }
  
  try {
    // Tải các mô hình nhận diện khuôn mặt
    await loadModels();
  
    // Lấy Face Descriptor từ ảnh
    const imagePath = path.resolve(req.file.path);  // Đường dẫn đến ảnh đã upload
    const descriptor = await getFaceDescriptorFromImage(imagePath);
  
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findByPk(userId);
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
  }
};
