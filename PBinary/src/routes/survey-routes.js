const express = require('express')
const router = new express.Router()

const Survey = require('../models/survey')
const Answer = require('../models/answer')

const SurveyDoc = require('../docsHelper/surveyDoc');

router.post('/store', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    // TODO check findMember like routes in group-routes

    let surveyDoc;

    try { surveyDoc = new SurveyDoc(req.body.survey); } 
    catch (e) { return res.status(400).send('Bad request'); }

    try {

        let response = await Survey.create(surveyDoc.encodeForSaving());
        response = await Survey.findById(response._id);

        if (!!!response)
            return res.status(500).send('Something went wrong while inserting the document');

        else 
            return res.status(200).send('Survey inserted');

    } catch (e) {

        return res.status(500).send('Something went wrong while inserting the document');

    }

});


// Deleteing a survey implies the deletion of all answers associated with it

router.delete('/delete', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    // TODO check findMember like routes in group-routes

    if (!req.body || !req.body.surveyId){
        return res.status(400).send('Bad request');
    }

    const surveyId = req.body.surveyId;

    try {

        let surveyDeleted = await Survey.findByIdAndDelete(surveyId);
        console.log(surveyDeleted.inspect());

        let answsersDeleted = await Answer.deleteMany({survey_id: surveyId});
        console.table(answsersDeleted);

        let checkSurvey = await Survey.findById(surveyId);

        if (checkSurvey)
            return res.status(500).send('Deletion has not been performed as expected');

        else
            return res.status(200).send('Deletion completed');

    } catch (e) {

        return res.status(500).send(e);

    }

});

router.get('/show-survey-by-id/:id', async (req, res) => {
    let surveyObj = {
        id: 'abc1',
        status: true,
        title: 'Un sondaggio di prova',
        email: 'email@stud.unive.it',
        questions: [{
            id: '1',
            title: 'Domanda di prova 1',
            typeOfQuestion: 'radio',
            questionOptions: [ 
                {id:"1", value:'pallone'},
                {id:"2", value:'bici'},
                {id:"3", value:'racchetta'},
                {id:"4", value:'spada'},
            ],
            questionAnswers: null
        }, {
            id: '2',
            title: 'Domanda di prova 2',
            typeOfQuestion: 'checkBox',
            questionOptions: [
                {id:"1", value:'Enrico'},
                {id:"2", value:'Simone'},
                {id:"3", value:'Marika'},
                {id:"4", value:'Alessandro'},
            ],
            questionAnswers: null
        }]
    }
    return res.status(200).send(surveyObj);
    
    if (!req.user_id) { 
        return res.status(401).send('Not authenticated');
    }

    // TODO check findMember like routes in group-routes

    const id = req.params.id;

    try {

        let survey = await Survey.findById(id);

        if (!survey) 
            return res.status(500).send('Invalid id');

        let surveyObj = {

            id: survey.id,

            status: survey.status,
            title: survey.title,
            email: survey.email,

            questions: survey.questions

        }

        return res.status(200).send(surveyObj);


    } catch (e) {

        return res.status(500).send(e);

    }

});

router.get('/show-surveys-by-user-id', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated');
    }

    // TODO check findMember like routes in group-routes

    const userId = req.userId;

    try {

        let surveysData = await Survey.find({user_id: userId});

        if (surveysData.length > 0) {
            surveysData = surveysData.map(doc => {
                return {
                    id: doc.id,
                    title: doc.title
                }
            });
        }

        else 
            surveysData = []

        return res.status(200).send(surveysData);

    } catch (e) {

        return res.status(500).send(e);

    }

});

module.exports = router;