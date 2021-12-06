const express = require('express')
const router = new express.Router()

router.post('/store', async (req, res) => {

    // TODO

});

router.delete('/delete', async (req, res) => {

    // TODO

});

router.get('/show-survey-by-id/:surveyId', async (req, res) => {

    // TODO
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

});

router.get('/show-surveys-by-user-id', async (req, res) => {

    // TODO

});

router.get(':groupId/show-surveys-by-group-id', async (req, res) => {

    // TODO

});

module.exports = router;