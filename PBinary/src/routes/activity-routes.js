const express = require('express')
const router = new express.Router()

const Activity = require('../models/activity')

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

        const mappedActivity = { name: response.name };

        return res.status(200).send(mappedActivity);

    } catch (e) { return res.status(500).send(e); }

});

module.exports = router;