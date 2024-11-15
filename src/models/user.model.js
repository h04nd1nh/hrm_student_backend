module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      identifier: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
      },
      user_role: { 
        type: Sequelize.ENUM('student', 'teacher'), 
        allowNull: true,
        defaultValue: 'student',
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      
    },
    {
      tableName: "user",
    }
  );

  return User;
};
