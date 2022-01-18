const express = require('express');
const auth = require('../middleware/auth');
const Professor = require('../models/professor.model');

const router = new express.Router();

router.post('/register', async ({ body }, res) => {
	try {
		const prof = await Professor.create(body);
		const data = await prof.authorize();
		res.status(201).send(data);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.post('/login', async ({ body }, res) => {
	try {
		const prof = await Professor.authenticate(body.email, body.password);
		res.send(prof);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.post('/logout', auth, async (req, res) => {
	try {
		await req.prof.logout(req.token);
		res.send(req.prof);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.post('/logoutAll', auth, async (req, res) => {
	try {
		await req.prof.logoutAll();
		res.send(req.prof);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.get('/me', auth, (req, res) => {
	res.send(req.prof);
});

router.patch('/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email'];
	const isValidUpdate = updates.every(
		(update) =>
			allowedUpdates.includes(update) &&
			(typeof req.body[update] === 'string' ||
				req.body[update] instanceof String)
	);

	if (!isValidUpdate) return res.status(400).send({ error: 'Invalid Updates' });

	try {
		updates.forEach((update) => (req.prof[update] = req.body[update]));

		await req.prof.save();
		res.send(req.prof);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

router.delete('/me', auth, async (req, res) => {
	try {
		await req.prof.destroy();
		res.send(req.prof);
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

module.exports = router;
