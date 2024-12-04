module.exports = (sequelize, Sequelize) => {
    const FaceDescriptor = sequelize.define(
      "face_descriptors", // Tên bảng trong cơ sở dữ liệu
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users', // Tên bảng liên kết
            key: 'id',
          },
        },
        label: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        descriptor: {
          type: Sequelize.JSONB, // Lưu trữ descriptor dưới dạng JSON
          allowNull: false,
        },
      },
      {
        tableName: "face_descriptors", // Tên bảng
        timestamps: false, // Nếu không cần trường thời gian
      }
    );
  
    return FaceDescriptor;
  };
  