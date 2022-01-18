const { DataTypes } = require('sequelize/dist');
const { sequelize } = require('../db/sequelize');

const Activity = sequelize.define(
	'Activity',
	{
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			set(_value) {
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

Activity.findByCode = async (code) => {
	const activities = await Activity.findAll({});
	const activity = activities.filter((activity) => {
		return activity.dataValues.id.slice(0, 6) === code;
	});
	if (!activity[0]) throw new Error('Unable to find activity!');
	return activity[0];
};

Activity.prototype.addFb = async function (value) {
	const { Feedback } = sequelize.models;
	const feedback = await Feedback.create({
		activityId: this.id,
		feedback: value,
	});
	await this.addFeedback(feedback);
	return feedback;
};

Activity.prototype.toJSON = function () {
	const data = this.dataValues;
	data.id = data.id.slice(0, 6);
	return data;
};

module.exports = Activity;
