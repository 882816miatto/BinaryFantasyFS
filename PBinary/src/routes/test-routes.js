const express = require('express')
const router = new express.Router()

const Survey = require('../models/survey')
const Answer = require('../models/answer');
const Review = require('../models/review')

const SurveyDoc = require('../docsHelper/surveyDoc');
const AnswerDoc = require('../docsHelper/answerDoc');
const ReviewDoc = require('../docsHelper/reviewDoc')

// Preliminar database testing

router.post('/survey', async (req, res) => {

    let survey;

    try {
        survey = new SurveyDoc(req.body);
    } catch  (e) { return res.status(400).send('Bad request'); }

    try {
        const surveyDoc = (survey.encodeForSaving())
        await Survey.create(surveyDoc);
        return res.status(200).send('Document inserted');
    } catch (e) { return res.status(500).send(e); }

});

router.post('/deleteSurvey', async (req, res) => {

    const survey = req.body;

    try {

        // In the 'production' route change group_id with id -> deleteOneById
        const queryObj = await Survey.deleteOne({group_id: survey.group_id});

        if (queryObj.deletedCount !== 1)
            return res.status(500).send('DeletedCount should be one');

        else
            return res.status(200).send('Document deleted');

    } catch (e) { return res.status(500).send(e); }

});

router.post('/getSurvey', async (req, res) => {

    const { group_id } = req.body;

    try {

        const doc = await Survey.findOne({ group_id: group_id });
        res.send(doc.toObject());

    } catch (e) { return res.status(500).send(e); }

});

router.post('/insertDeleteSurveyAndAnswer', async (req, res) => {

    const { data } = req.body;
    let ans;

    try {
        ans = new AnswerDoc(data[0]);
    } catch (e) { return res.status(500).send(e); }

    try {

        const doc = await Survey.findById(ans.survey_id);
        const ansQuestionIds = new Set(data.map(v => v.question_id));
        const docQuestionIds = new Set(doc.toObject().questions.map(v => String(v._id)));

        for (const a of ansQuestionIds) {

            if (!docQuestionIds.has(a)) 
                return res.status(500).send('Question_id does not match');
            
        }

        await Answer.insertMany([ans]);

        const countDeletedSurvey = await Survey.deleteOne({ _id: doc._id });
        const countDeletedAnswers = await Answer.deleteMany({ survey_id: doc._id });

        if (countDeletedSurvey.deletedCount === 0 || countDeletedAnswers.deletedCount === 0)
            res.status(500).send('Deletion has not occured');

        else 
            res.status(200).send('Answers inserted and deleted');

    } catch (e) { return res.status(500).send(e); }

});

router.post('/insertReview', async (req, res) => {

    try {
        const review = new ReviewDoc(req.body);
        await Review.create(review.encodeForSaving());
        const doc = await Review.findOne(review);
        const cnt = await Review.deleteOne(doc.toObject());

        if (cnt.deletedCount !== 1)
            return res.status(500).send('DeletedCount should be 1');

        else 
            return res.status(200).send('Review inserted and deleted');

    } catch (e) { return res.status(500).send('Error'); }

});

router.delete('/deleteTrial', (req, res) => {

    if (req.body) {

        console.log(req.body);
        return res.status(200).send('Delete works properly');

    }

    else 
        return res.status(500).send('Problem with delete');

})

router.get('/getTrial', (req, res) => {

    if (req.query) {

        console.log(req.query);
        return res.status(200).send('Get works properly');

    }

    else 
        return res.status(500).send('Problem with get');

})

module.exports = router