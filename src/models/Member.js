const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('member', 'admin'),
    defaultValue: 'member',
  },
  avatar: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'members',
  timestamps: true,
  hooks: {
    beforeCreate: async (member) => {
      if (member.password) {
        member.password = await bcrypt.hash(member.password, 12);
      }
    },
    beforeUpdate: async (member) => {
      if (member.changed('password')) {
        member.password = await bcrypt.hash(member.password, 12);
      }
    },
  },
});

Member.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Member.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Member;
