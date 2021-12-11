const express = require('express')
const router = new express.Router()

const Review = require('../models/review')
const Profile = require('../models/profile')
const User = require('../models/user')
const Image = require('../models/image')

const ReviewDoc = require('../docsHelper/reviewDoc');

// TODO: check member

router.get('/get-reviews/:activityId', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    const activityId = req.params.activityId;

    try {

        const reviews = await Review.find({activity_id: activityId});

        const mappedReviews = reviews.map(review => {

            return {

                id: review.id,
                activity_id: review.activity_id,
                user_id: review.user_id,

                user: {
                    given_name: review.given_name,
                    avatar: review.user_image, 
                    role: review.user_role
                },

                evaluation: review.evaluation,
                comment: review.comment ? review.comment : '',
                created_at: review.createdAt

            }

        });

        return res.status(200).send(mappedReviews);

    } catch (e) { return res.send(500).send(e); }

});

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

    } catch (e) { return res.status(400).send(e); }

    try {

        let responseProfile = await Profile.findOne({user_id: review.user_id});
        let responseUser = await User.findOne({user_id: review.user_id});
        let responseImage = await Image.findOne({image_id: responseProfile.image_id});

        const reviewToInsert = review.encodeForSaving();
        reviewToInsert['given_name'] = String(responseProfile.given_name + ' ' + String(responseProfile.family_name));
        reviewToInsert['user_role'] = responseUser.role;
        reviewToInsert['user_image'] = responseImage.path;

        await Review.findOneAndUpdate({activity_id: review.activity_id, user_id: review.user_id}, reviewToInsert, {upsert: true});

        return res.status(200).send('Review has been inserted successfully');

    } catch( e) { return res.status(500).send(e); }
    
});

router.delete('/delete', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    if (!req.body || !req.body.reviewId) {
        return res.status(400).send('Bad request');
    }

    const reviewId = req.body.reviewId;

    try {

        let review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).send('Review does not exist');
        }

        if (review.user_id !== req.user_id) {
            return res.status(401).send('Unauthorized');
        }

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).send('Deletion completed successfully');

    } catch (e) { return res.status(500).send(e); }

});

module.exports = router;