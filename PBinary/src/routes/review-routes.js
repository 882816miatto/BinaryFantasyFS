const express = require('express')
const router = new express.Router()

const Review = require('../models/review')
const Profile = require('../models/profile')
const User = require('../models/user')
const Image = require('../models/image')

const ReviewDoc = require('../docsHelper/reviewDoc');
const objectid = require('objectid');

// file upload code
const multer = require('multer');
const DIR = './images/reviews';
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

// TODO: check member

router.get('/get-reviews/:activityId', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    const activityId = req.params.activityId;

    try {

        const reviews = await Review.find({activity_id: activityId});

        const mappedReviews = [];

        for (const rev of reviews) {

            const responseProfile = await Profile.findOne({user_id: rev.user_id});
            const responseUser = await User.findOne({user_id: rev.user_id});
            const responseImage = await Image.findOne({image_id: responseProfile.image_id});

            const r = {

                id: rev.id,
                activity_id: rev.activity_id,
                user_id: rev.user_id,

                user: {
                    given_name: String(responseProfile.given_name + ' ' + String(responseProfile.family_name)),
                    avatar: responseImage.path, 
                    role: responseUser.role,
                },

                evaluation: rev.evaluation,
                comment: rev.comment ? rev.comment : '',
                created_at: rev.createdAt,
                images: rev.images

            };

            mappedReviews.push(r);
            
        }

        return res.status(200).send(mappedReviews);

    } catch (e) { return res.send(500).send(e); }

});

router.post('/store',
  upload.array('images', 15),
  async (req, res) => {

    //check why
    const { files } = req;

    if (!req.user_id) {
      return res.status(401).send('Not authenticated');
    }

    if (!req.body) {
      return res.status(400).send('Bad request, review is missing');
    }

    if (files) {
      req.body.images = [];
      files.forEach(photo => {
        req.body.images.push({
          image_id: objectid(),
          path: `/images/reviews/${photo.filename}`
        });
      });
    }

    let review;

    try {
      review = new ReviewDoc(req.body);

      if (review.user_id !== req.user_id) {
        return res.status(400).send('Bad request, user_id does not match');
      }
    } catch (e) {
      return res.status(400).send(e);
    }

    try {
      const reviewToInsert = review.encodeForSaving();

      await Review.findOneAndUpdate({
        activity_id: review.activity_id,
        user_id: review.user_id
      }, reviewToInsert, { upsert: true });

      return res.status(200).send('Review has been inserted successfully');
    } catch (e) {
      return res.status(500).send(e);
    }
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