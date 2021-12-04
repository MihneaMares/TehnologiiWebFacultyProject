const express = require("express");
const auth = require("../middleware/auth");
const Activity = require("../models/activity.model");
const Feedback = require("../models/feedback.model");

const router = new express.Router();

router.post("/activity", auth, async (req, res) => {
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

router.get("/activities", auth, async (req, res) => {
  try {
    const activities = await req.prof.getActivities();
    res.status(200).send(activities);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/activity/:code", async (req, res) => {
  try {
    const activity = await Activity.findByCode(req.params.code);
    res.status(200).send(activity);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/activity/:code", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description"];
  const isValidUpdate = updates.every(
    (update) =>
      allowedUpdates.includes(update) &&
      (typeof req.body[update] === "string" ||
        req.body[update] instanceof String)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid Updates" });

  try {
    const activity = await Activity.findByCode(req.params.code);
    updates.forEach((update) => (activity[update] = req.body[update]));

    await activity.save();
    res.send(activity);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/activity/:code", auth, async (req, res) => {
  try {
    const activity = await Activity.findByCode(req.params.code);
    await activity.destroy();
    res.send(activity);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post("/activity/:code/:feedback", async (req, res) => {
  try {
    const activity = await Activity.findByCode(req.params.code);
    const feedback = await activity.addFb(req.params.feedback);
    res.send({ feedback });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/activity/:code/feedbacks", auth, async (req, res) => {
  try {
    const activity = await Activity.findByCode(req.params.code);
    const activities = await req.prof.getActivities();
    const hasActivity = activities.some((act) => act.id === activity.id);
    if (!hasActivity) {
      throw new Error("Not authorized");
    }
    const feedbacks = await activity.getFeedbacks();
    const counter = { 1: 0, "-1": 0, 0: 0, 2: 0 };
    feedbacks.forEach((item) => counter[item.feedback]++);
    res.send(counter);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = router;
