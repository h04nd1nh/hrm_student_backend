module.exports = (sequelize, Sequelize) => {
    const TimeTableTeacher = sequelize.define(
      "timetable_teacher",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        teacher_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        teacher_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: true
        },
        period_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }, 
        period_name: {
          type: Sequelize.STRING,
          allowNull: true
        }, 
        room_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        room_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
      },
      {
        tableName: "timetable_teacher",
      }
    );

    // Static method
    TimeTableTeacher.getCurrentClass = async function (periodId, teacherId) {
      try {
          // Format ngày thành chuỗi 'YYYY-MM-DD'
                    // Format ngày thành chuỗi 'YYYY-MM-DD'
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().split("T")[0];

          // Tìm lớp học theo period_id và ngày
          const result = await this.findOne({
              where: {
                  teacher_id: teacherId,
                  period_id: periodId,
                  date: sequelize.where(
                      sequelize.fn("DATE", sequelize.col("date")),
                      "=",
                      formattedDate // So sánh ngày
                  ),
              },
          });

          return result;
      } catch (error) {
          console.error("Error in getCurrentClass:", error);
          throw error;
      }
};
  
    return TimeTableTeacher;
  };
  