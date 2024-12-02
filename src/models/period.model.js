module.exports = (sequelize, Sequelize) => {
    const Period = sequelize.define(
      "period",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        period_name: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        start_time: { // Trường lưu giờ bắt đầu
            type: Sequelize.TIME,
            allowNull: false,
        },
        end_time: { // Trường lưu giờ kết thúc
            type: Sequelize.TIME,
            allowNull: true, // Có thể cho phép null nếu không cần
        },
      },
      {
        tableName: "period",
        timestamps: false, // Tắt auto thêm createdAt, updatedAt
      }
    );
    return Period;
  };
  