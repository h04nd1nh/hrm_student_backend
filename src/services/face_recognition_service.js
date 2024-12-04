const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Tải các mô hình nhận diện khuôn mặt
const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
      faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
      faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
    ]);
    console.log("Các mô hình nhận diện khuôn mặt đã được tải thành công.");
  } catch (error) {
    console.error("Lỗi khi tải mô hình nhận diện khuôn mặt:", error);
  }
};

// Nhận diện khuôn mặt từ ảnh
const recognizeFace = async (imgBuffer) => {
  const img = await canvas.loadImage(imgBuffer);
  const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
  return detections;
};

// So sánh khuôn mặt nhận diện với các khuôn mặt đã lưu
const matchFace = (faceDescriptors, labeledDescriptors) => {
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6); // Threshold 0.6
  return faceMatcher.findBestMatch(faceDescriptors[0].descriptor);
};

// Tải các khuôn mặt đã được gắn nhãn từ cơ sở dữ liệu (hoặc nơi lưu trữ khác)
const loadLabeledDescriptors = async () => {
  const labeledDescriptors = [
    new faceapi.LabeledFaceDescriptors('student', [/* Các mặt đã được lưu ở đây */]),
  ];
  return labeledDescriptors;
};

// Hàm để lấy descriptor từ ảnh
const getFaceDescriptorFromImage = async (imagePath) => {
    const img = await canvas.loadImage(imagePath);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    if (detections) {
      return detections.descriptor; // Dữ liệu khuôn mặt (Face Descriptor)
    } else {
      throw new Error("Không phát hiện khuôn mặt trong ảnh.");
    }
  };

module.exports = { loadModels, recognizeFace, matchFace, loadLabeledDescriptors };