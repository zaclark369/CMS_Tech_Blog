const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// create our Post model
Post.init(
  {
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      title: {
          type: DataTypes.STRING,
          allowNull: false
      },
      // text content of post, must be at least 100 characters
      content: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: [100]
          }
      },
      // reference user model through it's id
      user_id: {
          type: DataTypes.INTEGER,
          references: {
              model: 'user',
              key: 'id'
          }
      }
  },
  {
      // mandatory sequelize connection
      sequelize,
      // pluralize table name when getting posts
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
  }
)

module.exports = Post;
