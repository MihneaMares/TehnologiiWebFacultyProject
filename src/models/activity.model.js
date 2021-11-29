const { DataTypes } = require('sequelize/dist');
const shortid = require('shortid');
const { sequelize } = require('../db/sequelize');

const Activity = sequelize.define(
	'Activity',
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
		code: {
			type: DataTypes.STRING,
			defaultValue: shortid.generate(),
			allowNull: false,
			unique: true,
			set() {
				return shortid.generate();
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
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			set(value) {
				if (typeof value === 'string' || value instanceof String)
					this.setDataValue('description', value.trim());
			},
		},
		profId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

Activity.associate = () => {
	const { Feedback, Professor } = sequelize.models;
	Activity.hasMany(Feedback, { foreignKey: 'activityId' });
	Activity.belongsTo(Professor, { foreignKey: 'profId' });
};

Activity.prototype.findByCode = async (code) => {
	if (!shortid.isValid(code)) throw new Error('Unable to find activity!');
	const activity = await Activity.findOne({ code });
	if (!activity) throw new Error('Unable to find activity!');
	return activity;
};

module.exports = Activity;
