const express = require('express')
const router = new express.Router()

const Review = require('../models/review')

const ReviewDoc = require('../docsHelper/reviewDoc');


router.get('/get-reviews/:activityId', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    const activityId = req.params.activityId;

    // TODO getReviews and all info 

})

// TODO: check member
router.post('/store', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    if (!req.body || !req.body.review) {
        return res.status(400).send('Bad request');
    }

    let review;

    try {

        review = new ReviewDoc(req.body.review);

        if (review.user_id !== req.user_id) {
            return res.status(400).send('Bad request')
        }

    } catch (e) {
        return res.status(400).send(e);
    }

    try {

        await Review.create(review.encodeForSaving());
        return res.status(200).send('Review has been inserted successfully');

    } catch( e) { return res.status(500).send(e); }

});

module.exports = router;