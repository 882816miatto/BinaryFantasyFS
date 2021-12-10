const express = require('express')
const router = new express.Router()

const Survey = require('../models/survey')
const Answer = require('../models/answer')
const Group = require('../models/group')
const Member = require('../models/member')

const SurveyDoc = require('../docsHelper/surveyDoc');

// TODO check user_id === req.user_id
// TODO check findMember like routes in group-routes

router.post('/store', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

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

// Deleting a survey implies the deletion of all answers associated with it

router.delete('/delete', async (req, res) => {

    if (!req.user_id) { 
        return res.status(401).send('Not authenticated'); 
    }

    if (!req.body || !req.body.surveyId){
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

router.get('/show-survey-by-id/:id', async (req, res) => {
        
    if (!req.user_id) { 
        return res.status(401).send('Not authenticated');
    }

    const id = req.params.id;

    try {

        let survey = await Survey.findById(id);

        if (!survey) 
            return res.status(500).send('Invalid id');

        let parsedQuestions = survey.questions.map(q => {

            let idOption = 0;

            let parsedOptions = q.questionOptions.map(o => {

                let option = {
                    id: idOption,
                    value: o
                };

                idOption += 1;

                return option;

            });

            return {

                id: String(q._id),
                title: q.title,
                typeOfQuestion: q.typeOfQuestion,

                questionOptions: parsedOptions,

            }

        })

        let surveyObj = {

            id: survey.id,

            status: survey.status,
            title: survey.title,
            email: survey.email,

            questions: parsedQuestions

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

    const userId = req.user_id;

    try {

        const groups = [];

        const inGroups = await Member.find({
            user_id: userId,
            group_accepted: true,
            user_accepted: true
        }, {group_id: 1});

        for (const gr of inGroups) {
            
            const groupName = await Group.findOne({group_id: gr.group_id}, {group_id: 1, name: 1});

            groups.push({
                id: groupName.group_id,
                name: groupName.name
            });

        }

        const surveysByGroup = [];

        for (const group of groups) {

            let surveysGroupUser = await Survey.find({user_id: userId, group_id: group.id}, {title: 1});

            if (surveysGroupUser.length > 0) {

                surveysGroupUser = surveysGroupUser.map(doc => {
                    return {
                        id: doc.id,
                        title: doc.title
                    }
                });

                surveysByGroup.push({

                    group_id: group.id,
                    group_name: group.name,

                    survyes: surveysGroupUser

                });

            }

        }

        return res.status(200).send(surveysData);

    } catch (e) {

        return res.status(500).send(e);

    }

});

/*
router.get('/review', async (req, res) => {
	let reviews = [
		{
			id: 1,
			activity_id: 1,
			user_id: 2,
			user: {
				name: 'John',
				surname: 'Doe',
				avatar: 'https://place-puppy.com/300x300',
				role: 'parent'
			},
			evaluation: 3,
			created_at: '2021-12-01',
			comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam blandit semper lorem sit amet ornare. Aenean non pretium odio. Morbi arcu turpis, iaculis in scelerisque eu, luctus sed turpis. Nam faucibus euismod massa, porta pulvinar quam eleifend sed. Maecenas tincidunt metus eget porttitor pharetra.',
		},
		{
			id: 2,
			activity_id: 1,
			user_id: 1,
			user: {
				name: 'Jane',
				surname: 'Doe',
				avatar: 'https://place-puppy.com/150x150',
				role: 'organizer'
			},
			evaluation: 4,
			created_at: '2021-10-10',
			images: [
					'https://place-puppy.com/160x150',
					'https://place-puppy.com/160x150',
					'https://place-puppy.com/160x150',
					'https://place-puppy.com/160x150',
					'https://place-puppy.com/160x150',
					'https://place-puppy.com/160x150',
					'https://place-puppy.com/160x150',
			],
			comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam blandit semper lorem sit amet ornare. Aenean non pretium odio. Morbi arcu turpis, iaculis in scelerisque eu, luctus sed turpis. Nam faucibus euismod massa, porta pulvinar quam eleifend sed. Maecenas tincidunt metus eget porttitor pharetra.',
		},
	];

	return res.status(200).send(reviews);
});
*/

router.get('/:groupId/show-surveys-by-group-id', async (req, res) => {

    if (!req.user_id) {
      return res.status(401).send('Not authenticated');
    }
  
    const group_id = req.params.groupId;
    const user_id = req.user_id;
  
    try {
  
      let surveysData = await Survey.find({group_id: group_id});
      let answersData = await Answer.find({user_id: user_id});
      let idSurveySet = new Set(answersData.map(doc => doc.survey_id));
  
      surveysData = surveysData.filter(doc => idSurveySet.has(doc.id) === false)
        .map(doc => {
            return {
                title: doc.title, 
                id: doc.id
            }});
  
      return res.status(200).send(surveysData);
  
    } catch (e) {return res.status(500).send(e); }
  
  });

module.exports = router;