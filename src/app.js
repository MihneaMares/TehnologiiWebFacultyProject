const express = require('express');
const cors = require('cors');
const profRouter = require('./routers/professor.router');
const activityRouter = require('./routers/activity.router');
const { sequelize, init, associate } = require('./db/sequelize');

const app = express();

app.use(cors());
app.use(express.json());
app.use(profRouter);
app.use(activityRouter);

app.all('/*', (_req, res) => {
	res.status(404).send({ error: 'Not a valid endpoint' });
});

init();
(async () => {
	require('./models/professor.model');
	require('./models/authToken.model');
	require('./models/activity.model');
	require('./models/feedback.model');
	await sequelize.sync();
	associate();
	console.log('Models synchronized');
})();

module.exports = app;
