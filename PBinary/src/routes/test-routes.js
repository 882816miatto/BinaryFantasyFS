const express = require('express')
const router = new express.Router()

const Survey = require('../models/survey');
const Answer = require('../models/answer');
const Review = require('../models/review');
const Profile = require('../models/profile');
const User = require('../models/user');
const Image = require('../models/image');

const SurveyDoc = require('../docsHelper/surveyDoc');
const AnswerDoc = require('../docsHelper/answerDoc');
const ReviewDoc = require('../docsHelper/reviewDoc');

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
        let toInsert = review.encodeForSaving();
        toInsert.given_name = 'Given name';
        toInsert.user_role = 'user_role';
        toInsert.user_image = 'user_image';
        await Review.create(toInsert);
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
        return res.status(200).send('Delete works properly');
    }

    else 
        return res.status(500).send('Problem with delete');

})

router.get('/getTrial', (req, res) => {

    if (req.query) {
        return res.status(200).send('Get works properly');
    }

    else 
        return res.status(500).send('Problem with get');

});

router.post('/create-surveys', async (req, res) => {

    try {

        let data = req.body.data;
        let surveys = data.map(s => new SurveyDoc(s)).map(s => s.encodeForSaving());
        let response = await Survey.insertMany(surveys);

        return res.status(200).send(response);

    } catch (e) {

        res.status(500).send(e);

    }

});

router.get('/show-surveys/:groupId/:userId', async (req, res) => {
  
    const group_id = req.params.groupId;
    const user_id = req.params.userId;

    try {

        let surveysData = await Survey.find({group_id: group_id, user_id: user_id});
        let answersData = await Answer.find({user_id: user_id});
        
        let idSurveySet = new Set(answersData.map(doc => doc.survey_id));

        surveysData = surveysData.filter(doc => idSurveySet.has(doc.id) === false)
        .map(doc => {
            return {
                title: doc.title,
                id: doc.id
            }
        });

        return res.status(200).send(surveysData);

    } catch (e) {return res.status(500).send(e); }
  
});

router.get('/show-surveys-by-user-id/:id', async (req, res) => {

    const userId = req.params.id;

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

router.get('/show-survey-by-id/:id', async (req, res) => {

    const id = req.params.id;

    try {

        let survey = await Survey.findById(id);

        if (!!!survey) 
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

router.get('/delete-all', async (req, res) => {

    try { 
        await Survey.deleteMany({}); 
        await Answer.deleteMany({});
        await Review.deleteMany({});
        return res.status(200).send('Deletion completed');
    }

    catch (e) { return res.status(500).send('Something went wrong durind deletion'); }

})

router.delete('/delete-survey', async (req, res) => {

    // Deleteing a survey implies the deletion of all answers associated with it

    if (!req.body.surveyId){
        return res.status(400).send('Bad request');
    }

    const surveyId = req.body.surveyId;

    try {

        await Survey.findByIdAndDelete(surveyId);
        await Answer.deleteMany({survey_id: surveyId});

        let checkSurvey = await Survey.findById(surveyId);

        if (checkSurvey)
            return res.status(500).send('Deletion has not been performed as expected');

        else
            return res.status(200).send('Deletion completed');

    } catch (e) {

        return res.status(500).send(e);

    }

});

router.post('/create-answers', async (req, res) => {

    try {

        let ansArray = req.body;
        ansArray = ansArray.map(doc => new AnswerDoc(doc).encodeForSaving());
        await Answer.insertMany(ansArray);

        return res.status(200).send('Creation completed');

    } catch (e) {

        return res.status(500).send(e);

    }

})

router.post('/store', async (req, res) => {

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

router.post('/store-answers', async (req, res) => {

    if (!!!req.body || !!!req.body.answers) {
        return res.status(400).send('Bad request');
    }

    let answers;

    try { 

        let survey = await Survey.findById(req.body.answers[0].survey_id);
        let questions = survey.questions.map(doc => String(doc._id));
        let idSet = new Set(questions);

        answers = req.body.answers.map(doc => new AnswerDoc(doc));

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

    try {

        answers = answers.map(doc => doc.encodeForSaving());
        await Answer.insertMany(answers);

        let response = await Answer.find({survey_id: answers[0].survey_id, user_id: 'Simone Biondo'});
        
        if (response.length !== answers.length) {
            return res.status(500).send('Something went wrong while inserting answers');
        }

        else 
            return res.status(200).send('Answers insertion has been completed successfully');

    } catch (e) { return res.status(500).send(e); }

});

router.get('/show-answers-by-survey-id/:surveyId', async (req, res) => {

    const surveyId = req.params.surveyId;

    try {

        let survey = await Survey.findById(surveyId);

        if (!!!survey)
            return res.status(400).send('Bad request');

        else {

            let answers = await Answer.find({survey_id: surveyId});
            let map = new Map();

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

            for (const v of map.values()) {
                console.log('\n\n', v);
            }

            */

            let results = [];

            for (const v of map.values()) {

                let sum = 0;

                for (const prop of v.answers.keys()) {
                    sum += v.answers.get(prop);
                }
                
                // console.log('\n\n', sum);

                let resultObj = {}

                for (const prop of v.answers.keys()) {
                    resultObj[prop] = Number(v.answers.get(prop)) / sum;
                }


                let result = {

                    title: v.title,
                    options: resultObj 

                };

                results.push(result);

            }

            // console.log('\n\n', results);

            return res.status(200).send(results);

        }

    } catch (e) {

        return res.status(500).send(e);

    }

});

router.post('/store-review', async (req, res) => {

    if (!req.body || !req.body.review) {
        return res.status(400).send('Bad request');
    }

    let review;

    try {
        review = new ReviewDoc(req.body.review);
    } catch (e) {
        return res.status(400).send(e);
    }

    try {

        let rew = review.encodeForSaving();
        rew['given_name'] = 'prova';
        rew['user_role'] = 'user_role';
        rew['user_image'] = 'user_image';

        await Review.create(rew);
        return res.status(200).send('Review has been inserted successfully');

    } catch( e) { return res.status(500).send(e); }

});

router.get('/get-from-req', async (req, res) => {

    if (!req.user_id) {
        return res.status(401).send('Not Authenticated');
    }

    else 
        return res.status(200).send('OK');

})

router.post('/store-review-with-user', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    if (!req.body || !req.body.review) {
        return res.status(400).send('Bad request');
    }

    const currentReview = req.body.review;
    currentReview.user_id = req.user_id;

    let review;

    try {

        review = new ReviewDoc(currentReview);

        if (review.user_id !== req.user_id) {
            return res.status(400).send('Bad request')
        }

    } catch (e) { return res.status(400).send(e); }

    try {

        let responseProfile = await Profile.findOne({user_id: review.user_id});
        let responseUser = await User.findOne({user_id: review.user_id});
        let responseImage = await Image.findOne({image_id: responseProfile.image_id});

        let proj = await User.findOne({user_id: review.user_id}, {user_id: 1});
        console.log(proj)

        const reviewToInsert = review.encodeForSaving();
        reviewToInsert['given_name'] = String(responseProfile.given_name + ' ' + String(responseProfile.family_name));
        reviewToInsert['user_role'] = responseUser.role;
        reviewToInsert['user_image'] = responseImage.path;

        await Review.create(reviewToInsert);

        return res.status(200).send('Review has been inserted successfully');

    } catch( e) { return res.status(500).send(e); }

});

module.exports = router