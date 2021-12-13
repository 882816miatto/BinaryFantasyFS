const express = require('express')
const router = new express.Router()

const Activity = require('../models/activity')
const Review = require('../models/review')

router.get('/get-activity-by-id/:activityId', async (req, res) => {

  if (!req.user_id) {
    return res.status(401).send('Not authenticated');
  }

  const activityId = req.params.activityId;

  try {

    const response = await Activity.findOne({activity_id: activityId}, {name: 1});

    if (!response) {
      return res.status(400).send('Bad request');
    }

    let reviews = await Review.find({activity_id: activityId}, {evaluation: 1});

    let cnt = 0;
    let sum = 0;

    reviews.forEach(doc => {

      cnt += 1;
      sum += doc.evaluation;

    });

    const mappedActivity = { 
        name: response.name,
        average: cnt !== 0 ? Math.round((sum / cnt) * 10) / 10 : -1
    };

    return res.status(200).send(mappedActivity);

  } catch (e) { return res.status(500).send(e); }

});

module.exports = router;
