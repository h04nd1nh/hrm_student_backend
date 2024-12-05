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

  // Static method để lấy period_id của khoảng thời gian hiện tại
  Period.getCurrentPeriod = async function () {
      try {
          const currentTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // Lấy thời gian hiện tại
            console.log(currentTime);
          // Lấy tất cả các period
          const periods = await this.findAll();

          for (const period of periods) {
              // Tạo startTime và endTime từ ngày hiện tại
              const startTime = new Date();
              const endTime = new Date();

              // Gắn giờ, phút, giây vào startTime
              const [startHours, startMinutes, startSeconds] = period.start_time.split(":").map(Number);
              startTime.setHours(startHours, startMinutes, startSeconds || 0);

              // Gắn giờ, phút, giây vào endTime
              const [endHours, endMinutes, endSeconds] = period.end_time.split(":").map(Number);
              endTime.setHours(endHours, endMinutes, endSeconds || 0);

              // Kiểm tra currentTime có nằm trong khoảng thời gian không
              if (currentTime >= startTime && currentTime <= endTime) {
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
