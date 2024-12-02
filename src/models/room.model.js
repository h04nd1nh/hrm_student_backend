module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define(
      "room",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        room_name: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false
        },
        room_wifi_ssid: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
          },
      },
      {
        tableName: "room",
        timestamps: false, // Tắt auto thêm createdAt, updatedAt
      }
    );
    return Room;
  };
  