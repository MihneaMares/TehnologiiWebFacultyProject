const jwt = require('jsonwebtoken');
const { sequelize } = require('../db/sequelize');

const auth = async (req, res, next) => {
	const { Professor } = sequelize.models;
	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		if (!token || token === '') throw new Error('Please authenticate!');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const prof = await Professor.findOne({
			where: {
				id: decoded.id || -1,
			},
		});
		if (!prof) throw new Error('Please authenticate!');
		const tokens = await prof.getTokens();
		let hasToken = false;
		tokens.some(
			(authToken) => authToken.dataValues.token === token && (hasToken = true)
		);
		if (!hasToken) throw new Error('Please authenticate!');
		req.prof = prof;
		req.token = token;
		next();
	} catch (error) {
		res.status(401).send({ error: error.message });
	}
};

module.exports = auth;
