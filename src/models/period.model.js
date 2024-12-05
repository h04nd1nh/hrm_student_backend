const moment = require('moment-timezone');

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
              allowNull: false,
          },
          start_time: {
              type: Sequelize.TIME,
              allowNull: false,
          },
          end_time: {
              type: Sequelize.TIME,
              allowNull: true,
          },
      },
      {
          tableName: "period",
          timestamps: false, // Không thêm createdAt, updatedAt
      }
  );

  Period.getCurrentPeriod = async function () {
    try {
      // Lấy thời gian hiện tại theo múi giờ Hà Nội
      const currentTime = moment().tz("Asia/Ho_Chi_Minh");
      console.log("Current Time:", currentTime.format("YYYY-MM-DD HH:mm:ss"));
  
      // Lấy tất cả các period
      const periods = await this.findAll();
  
      for (const period of periods) {
        // Tạo startTime và endTime theo múi giờ Hà Nội
        const [startHours, startMinutes, startSeconds] = period.start_time.split(":").map(Number);
        const [endHours, endMinutes, endSeconds] = period.end_time.split(":").map(Number);
  
        const startTime = currentTime.clone().set({
          hour: startHours,
          minute: startMinutes,
          second: startSeconds || 0,
        });
  
        const endTime = currentTime.clone().set({
          hour: endHours,
          minute: endMinutes,
          second: endSeconds || 0,
        });
  
        console.log("Start Time:", startTime.format("YYYY-MM-DD HH:mm:ss"));
        console.log("End Time:", endTime.format("YYYY-MM-DD HH:mm:ss"));
  
        // Kiểm tra currentTime có nằm trong khoảng thời gian không
        if (currentTime.isBetween(startTime, endTime, null, '[]')) {
          return period.id; // Trả về period_id
        }
      }
  
      return null; // Không có period nào phù hợp
    } catch (error) {
      console.error("Error in getCurrentPeriod:", error);
      throw error;
    }
  };

  return Period;
};
