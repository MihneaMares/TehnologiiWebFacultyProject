const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		dialect: 'mariadb',
		dialectOptions: {
			charset: 'utf8mb4',
		},
		//Daca vreti sa vedeti ce comenzi sql se executa puneti logging pe true
		logging: false,
	}
);

const init = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

const associate = () => {
	const db = sequelize.models;
	Object.keys(db).forEach((model) => {
		if (db[model].associate) {
			db[model].associate(db);
		}
	});
};

module.exports = { sequelize, init, associate };
