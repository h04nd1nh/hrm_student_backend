module.exports = {
    HOST: "103.98.149.187",
    PORT: 5432,
    USER: "postgres",
    PASSWORD: "admin",
    DB: "hrmstudentptit",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
  