const express = require('express')
const router = new express.Router()

const Survey = require('../models/survey')
const Answer = require('../models/answer')

const AnswerDoc = require('../docsHelper/answerDoc');

router.get('/show-answers-by-survey-id/:surveyId', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    const surveyId = req.params.surveyId;

    try {

        let survey = await Survey.findById(surveyId);

        if (!!!survey)
            return res.status(400).send('Bad request');

        else {

            let answers = await Answer.find({survey_id: surveyId});
            // TODO mapping

        }


    } catch (e) {

        return res.status(500).send(e);

    }

});

router.post('/store', async (req, res) => {

    // TODO

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    if (!!!req.body || req.body.answers) {
        return res.status(400).send('Bad request');
    }

    let answers;

    try { answers = req.body.answers.map(doc => new AnswerDoc(doc)); } 
    catch (e) { return res.status(500).send('Bad request'); }

    try {

        answers = answers.map(doc => new AnswerDoc(doc)).map(doc => doc.encodeForSaving())





    } catch (e) {

    }



});


module.exports = router;