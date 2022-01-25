const express = require('express')
const router = new express.Router()

const Survey = require('../models/survey')
const Answer = require('../models/answer')

const AnswerDoc = require('../docsHelper/answerDoc');

const round = (number, decimalPlace) => {
    const factorOfTen = Math.pow(10, decimalPlace);
    return Math.round(number * factorOfTen) / factorOfTen;
}

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
            let map = new Map();

            /*
                For each answer in the database, we perform a GROUB BY like operation
                Then we count how many options have been selected for a particular question
            */

            survey.questions.forEach(doc => {

                let ansMap = new Map();
                doc.questionOptions.forEach(s => ansMap.set(s, 0));

                map.set(String(doc._id), {
                    title: doc.title,
                    answers: ansMap
                });

            });

            answers.forEach(ans => {

                let ansDict = map.get(ans.question_id);
                ans.optionsSelected.forEach(s => ansDict.answers.set(s, Number(ansDict.answers.get(s)) + 1));

            });

            /*
                After mapping answers to a nice representation we perfrom an AVG like operation on our data
                For each option we have its avg value
            */

            let results = [];

            for (const v of map.values()) {

                let sum = 0;

                for (const prop of v.answers.keys()) {
                    sum += v.answers.get(prop);
                }

                let resultObj = {}

                for (const prop of v.answers.keys()) {
                    resultObj[prop] = round(Number(v.answers.get(prop)) / sum, 2);
                }


                let result = {

                    title: v.title,
                    options: resultObj 

                };

                results.push(result);

            }

            return res.status(200).send(results);

        }

    } catch (e) { return res.status(500).send(e); }

});

router.post('/store', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    if (!!!req.body || !!!req.body.answers) {
        return res.status(400).send('Bad request');
    }

    let answers;

    /*  
        Answers are related to survey and its questions
        This implies integrity check
    */

    try { 

        const question_id = req.body.answers[0].question_id;
        const checkSurvey = await Survey.findOne({'questions._id': question_id});

        const survey = await Survey.findById(checkSurvey.id);
        const questions = survey.questions.map(doc => String(doc._id));
        const idSet = new Set(questions);

        answers = req.body.answers.map(a => {

            a['survey_id'] = checkSurvey.id;
            a['user_id'] = req.user_id;

            return new AnswerDoc(a);

        });

        for (const ans of answers) {

            if (!idSet.has(ans.question_id)) {
                return res.status(400).send('Bad request');
            }

            let question = survey.questions.filter(doc => String(doc._id) === ans.question_id);

            if (question.length !== 1) {
                return res.status(400).send('Bad request');
            }
            
            let optionsSet = new Set(question[0].questionOptions);

            for (const opt of ans.optionsSelected) {

                if (!optionsSet.has(opt)) {
                    return res.status(400).send('Bad request');
                }
                
            }
        
        }
    
    } catch (e) { return res.status(400).send('Bad request'); }

    /*
        At the end we start insertion of answers
        Verify the correct insrtion is required
    */

    try {

        answers = answers.map(doc => doc.encodeForSaving());
        await Answer.insertMany(answers);

        let response = await Answer.find({survey_id: answers[0].survey_id, user_id: req.user_id});
        
        if (response.length !== answers.length) {
            return res.status(500).send('Something went wrong while inserting answers');
        }

        else 
            return res.status(200).send('Answers insertion has been completed successfully');

    } catch (e) { return res.status(500).send(e); }

});

module.exports = router;