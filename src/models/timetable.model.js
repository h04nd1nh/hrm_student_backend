module.exports = (sequelize, Sequelize) => {
  const TimeTable = sequelize.define(
      "timetable",
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true,
          },
          student_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          time_table_teacher_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          teacher_name: {
              type: Sequelize.STRING,
              allowNull: true,
          },
          title: {
              type: Sequelize.STRING,
              allowNull: true,
          },
          period_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          period_name: {
              type: Sequelize.STRING,
              allowNull: true,
          },
          room_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          room_name: {
              type: Sequelize.STRING,
              allowNull: true,
          },
          date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
          },
          is_checkin: {
              type: Sequelize.BOOLEAN,
              defaultValue: false,
          },
      },
      {
          tableName: "timetable",
      }
  );

  // Static method
  TimeTable.getCurrentClass = async function (periodId, studentId) {
      try {
          // Format ngày thành chuỗi 'YYYY-MM-DD'
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split("T")[0];
            // Tìm lớp học theo period_id và ngày hôm nay
            const result = await this.findOne({
                where: {
                student_id: studentId,
                period_id: periodId,
                date: sequelize.where(sequelize.fn("DATE", sequelize.col("date")), "=", formattedDate),
                },
            });

          return result;
      } catch (error) {
          console.error("Error in getCurrentClass:", error);
          throw error;
      }
  };

  return TimeTable;
};
