module.exports = (sequelize, Sequelize) => {
    const CheckinSession = sequelize.define(
      "checkin_session",
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
      },
      {
        tableName: "checkin_session",
      }
    );
    return CheckinSession;
  };
  