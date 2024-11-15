module.exports = (sequelize, Sequelize) => {
    const TimeTable = sequelize.define(
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        student_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        teacher_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: true
        },
        period_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }, 
        room_id: {
            type: Sequelize.INTEGER,
            allowNull: false
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
  
    return TimeTable;
  };
  