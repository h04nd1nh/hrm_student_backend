const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  port: config.POST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  define: {
    timestamps: false,
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.checkinSession = require("../models/checkin_session.model.js")(sequelize, Sequelize);
db.period = require("../models/period.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);
db.timeTable = require("../models/timetable.model.js")(sequelize, Sequelize);
db.timeTableTeacher = require("../models/timetable_teacher.model.js")(sequelize, Sequelize);
db.faceDescriptor = require("../models/face_descriptor.model.js")(sequelize, Sequelize);
db.subject = require("../models/subject.model.js")(sequelize, Sequelize);


db.user.hasMany(db.timeTable, {
  foreignKey: 'student_id', // Trường khóa ngoại trong bảng timeTable
  as: 'timeTables', // Alias cho quan hệ (tùy chọn)
});

db.timeTable.belongsTo(db.user, {
  foreignKey: 'student_id', // Trường khóa ngoại trỏ đến id trong bảng user
  as: 'user', // Alias cho quan hệ (tùy chọn)
});

module.exports = db;
