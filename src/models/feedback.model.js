const { sequelize } = require('../db/sequelize');
const { DataTypes } = require('sequelize');

const Feedback = sequelize.define(
	'Feedback',
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
		feedback: {
			type: DataTypes.STRING,
			allowNull: false,
			set() {
				if (typeof value === 'string' || value instanceof String)
					this.setDataValue('feedback', value.trim());
			},
			validate: {
				isValidFeedback(value) {
					return ['🙂', '🙁', '😮', '🤔'].includes(value);
				},
			},
		},
		activityId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

Feedback.associate = () => {
	const { Activity } = sequelize.models;
	Feedback.belongsTo(Activity, { foreignKey: 'activityId' });
};

module.exports = Feedback;
