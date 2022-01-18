const { sequelize } = require('../db/sequelize');
const jwt = require('jsonwebtoken');
const { DataTypes } = require('sequelize');

const AuthToken = sequelize.define('AuthToken', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
		set() {
			return this.setDataValue('id', DataTypes.UUIDV4);
		},
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	profId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
});

AuthToken.associate = function () {
	const { Professor } = sequelize.models;
	AuthToken.belongsTo(Professor, { foreignKey: 'profId', onDelete: 'CASCADE' });
};

module.exports = AuthToken;
