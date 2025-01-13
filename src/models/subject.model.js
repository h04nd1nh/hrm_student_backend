module.exports = (sequelize, Sequelize) => {
    const Subject = sequelize.define(
      "subject",
      {
        id: {
          type: Sequelize.STRING(6), // Mã môn học là chuỗi 6 ký tự
          primaryKey: true,
          allowNull: false,
        },
        subject_name: {
          type: Sequelize.STRING(255), // Tên môn học
          allowNull: false,
        },
      },
      {
        tableName: "subject", // Tên bảng
      }
    );
    return Subject;
  };
  