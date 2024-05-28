'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/dbConfig.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db["contests"].hasMany(db["problems"], { foreignKey: 'contestId', onDelete: 'CASCADE' });
db["problems"].belongsTo(db["contests"], { foreignKey: 'contestId', onDelete: 'CASCADE' });

db["problems"].hasMany(db["testcases"], { foreignKey: 'problemId', onDelete: 'CASCADE' });
db["testcases"].belongsTo(db["problems"], { foreignKey: 'problemId', onDelete: 'CASCADE' });

db["categories"].belongsToMany(db["problems"], {
    through: 'problem_category',
    foreignKey: 'categoryId',
    otherKey: 'problemId'
  });

db["problems"].belongsToMany(db["categories"], {
    through: 'problem_category',
    foreignKey: 'problemId',
    otherKey: 'categoryId'
  });

db["contests"].hasMany(db["user_contest"], { foreignKey: 'contestId', onDelete: 'CASCADE' });
db["user_contest"].belongsTo(db["contests"], { foreignKey: 'contestId', onDelete: 'CASCADE' });
db["user_contest"].hasMany(db["contests"], { foreignKey: 'contestId', onDelete: 'CASCADE' });
db["contests"].belongsTo(db["user_contest"], { foreignKey: 'contestId', onDelete: 'CASCADE' });

module.exports = db;
