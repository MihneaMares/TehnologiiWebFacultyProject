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

module.exports = router;
