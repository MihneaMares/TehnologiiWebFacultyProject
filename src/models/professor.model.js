const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../db/sequelize');
const { DataTypes } = require('sequelize');

const Professor = sequelize.define(
	'Professor',
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			set() {
				return this.setDataValue('id', DataTypes.UUIDV4);
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value) {
				if (typeof value === 'string' || value instanceof String)
					return this.setDataValue('name', value.trim());
			},
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true,
			},
			set(value) {
				if (typeof value === 'string' || value instanceof String)
					return this.setDataValue('email', value.trim().toLowerCase());
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isStrongPassword(value) {
					if (!validator.isStrongPassword(value))
						throw new Error('Password too weak!');
					if (
						validator.contains(value, 'parola', {
							ignoreCase: true,
						}) ||
						validator.contains(value, 'password', {
							ignoreCase: true,
						})
					)
						throw new Error('Password can\'t be "password"');
				},
				async set(value) {
					return this.setDataValue('password', await bcrypt.hash(value, 8));
				},
			},
		},
	},
	{
		timestamps: true,
	}
);

Professor.associate = () => {
	const { AuthToken, Activity } = sequelize.models;
	Professor.hasMany(AuthToken, { foreignKey: 'profId', onDelete: 'CASCADE' });
	Professor.hasMany(Activity, { foreignKey: 'profId' });
};

Professor.authenticate = async (email, password) => {
	const prof = await Professor.findOne({ where: { email } });
	if (!prof) throw new Error('Unable to login!');
	const isMatch = bcrypt.compare(password, prof.password);
	if (!isMatch) throw new Error('Unable to login!');
	return prof.authorize();
};

Professor.prototype.authorize = async function () {
	const prof = this;
	const { AuthToken } = sequelize.models;
	const token = await jwt.sign({ id: prof.id }, process.env.JWT_SECRET);
	const authToken = await AuthToken.create({ token, profId: prof.id });
	await authToken.save();
	await prof.addAuthToken(authToken);
	return { prof, authToken };
};

Professor.prototype.getTokens = async function () {
	const prof = this;
	try {
		const tokens = await prof.getAuthTokens();
		return tokens;
	} catch (error) {
		throw new Error(error);
	}
};
Professor.prototype.logout = async (token) => {
	const { AuthToken } = sequelize.models;
	AuthToken.destroy({ where: { token } });
};

Professor.prototype.logoutAll = async function () {
	const prof = this;
	const { AuthToken } = sequelize.models;
	AuthToken.destroy({ where: { profId: prof.id } });
};

Professor.prototype.toJSON = function () {
	const data = this.dataValues;
	delete data.password;
	return data;
};

Professor.addHook('beforeDestroy', (user, _options) => {
	const { Activity } = sequelize.models;
	Activity.destroy({ where: { profId: user.id } });
	user.logoutAll();
});

module.exports = Professor;
