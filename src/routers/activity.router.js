const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/activity.model');

const router = new express.Router();

router.post('/activity', auth, async (req, res) => {
	try {
		const activity = await Activity.create({
			profId: req.prof.id,
			...req.body,
		});
		res.status(201).send(activity);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.get('/activities', auth, async (req, res) => {
	try {
		const activities = await req.prof.getActivities();
		res.status(200).send(activities);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.get('/activity/:code', async (req, res) => {
	try {
		console.log(req.params.code);
		const activity = await Activity.findByCode(req.params.code);
		res.status(200).send(activity);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

module.exports = router;
