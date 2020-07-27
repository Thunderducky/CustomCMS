// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  const Story = sequelize.define("Story", {
    // The email cannot be null, and must be a proper email before creation
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    // The password cannot be null
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len:[1]
      }
    },
    category: {
      type: DataTypes.STRING
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Story.associate = function(models){
    Story.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  }

  return Story;
};
