module.exports = {
    HOST: "139.180.129.178",
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
  