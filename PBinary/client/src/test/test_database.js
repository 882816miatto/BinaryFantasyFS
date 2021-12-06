import axios from "axios";

// Preliminar database testing

const sendTo = function(url, document) {
    return axios.post(url, document);
}
  
const createQuestion = function(title, type, options) {

    return {
        title: title,
        typeOfQuestion: type,
        questionOptions: options
    };

}
  
const createSurvey = function(status, title, user_id, email,
    group_id) {

    let q1 = createQuestion('question1', 'radio', ['op1', 'op2'])
    let q2 = createQuestion('question2', 'checkBox', ['op1', 'op2'])

    return {

        status: status,
        title: title,
        user_id: user_id,
        email: email,
        group_id: group_id,
        questions: [q1, q2]

    };
  
}

function createReview(activity_id, user_id, user_email, evaluation) {

    return {
        activity_id: activity_id,
        user_id: user_id,
        user_email: user_email,
        evaluation: evaluation
    };

}

async function test1() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/survey', survey);
        console.log('Test 1 passed');

    } catch (err) { console.error('Test 1 not passed', err); }

}

async function test2() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/deleteSurvey', survey);
        console.log('Test 2 passed');

    } catch (err) { console.error('Test 2 not passed', err); }

}

async function test3() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/survey', survey);
        let surveyInserted = await sendTo('api/tests/getSurvey', {group_id: survey.group_id});
        surveyInserted = surveyInserted.data;

        await sendTo('api/tests/insertDeleteSurveyAndAnswer', {
            data: [{
            optionsSelected: ['op1'],
            question_id: surveyInserted.questions[0]._id,
            survey_id: surveyInserted._id,
            user_id: 'ZioTreno'}]
        })

        console.log('Test 3 passed');

    } catch (err) { console.error('Test 3 not passed', err); }

}

async function test4() {

    const activity_id = 'activity_id';
    const user_id = 'user_id';
    const user_email = 'user_email';
    const evaluation = 5;

    const review = createReview(activity_id, user_id, user_email, evaluation);

    try {

        await sendTo('api/tests/insertReview', review);
        console.log('Test 4 passed');

    } catch (e) { console.error('Test 4 not passed', e); }
    
}

async function test5() {

    try {
        await axios.delete('api/tests/deleteTrial', {data: {s: 'Stringa_di_dati'} });
        console.log('Test 5 passed');
    } catch (e) { console.error('Test 5 not passed', e); }

}

async function test6() {

    try {
        await axios.get('api/tests/getTrial', {params: {answer: [42, 67]} });
        console.log('Test 6 passed');
    } catch (e) { console.error('Test 6 not passed', e); }

}

// Survey Testing

async function createSurveysForTesting() {

    const manySurveys = [];

    const s1 = {

        status: true,
        title: 'survey1',
        user_id: 'userTest',
        email: 'simone@gmail.com',
        group_id: 'gId',
        questions: [{
            title: 'question1',
            typeOfQuestion: 'radio',
            questionOptions: [
                'albero', 'fontana',
                'giardino', 'formica'
            ]
        }]

    };

    const s2 = {

        status: true,
        title: 'survey2',
        user_id: 'userTest',
        email: 'simone@gmail.com',
        group_id: 'gId',

        questions: [
        {
            title: 'question1',
            typeOfQuestion: 'checkBox',
            questionOptions: [
                'Enrico', 'Simone',
                'Eleanor', 'Rigby'
            ]
        },
    
        {
            title: 'question2',
            typeOfQuestion: 'radio',
            questionOptions: [
                'Giallo', 'Rosso',
                'Verde', 'Arancione'
            ]
        }]

    };

    const s3 = {

        status: true,
        title: 'survey3',
        user_id: 'userTest',
        email: 'simone@gmail.com',
        group_id: 'gId',
        questions: [{
            title: 'question1',
            typeOfQuestion: 'radio',
            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]
        }]

    };

    const s4 = {

        status: true,
        title: 'survey4',
        user_id: 'simone',
        email: 'simoneBiondo@gmail.com',
        group_id: 'gId',
        questions: [{
            title: 'question1',
            typeOfQuestion: 'radio',
            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]
        }]

    };

    manySurveys.push(s1, s2, s3, s4);

    try {

        await axios.post('api/tests/create-surveys', {data: manySurveys});
        console.log("Test 7 passed");

    } catch (e) {

        console.error("Error:", e);

    }

}

async function createAnswersForTesting() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

        let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        const id = response.data[0].id;
        response = await axios.get(`/api/tests/show-survey-by-id/${id}`);

        const a1 = {

            optionsSelected: [
                'fontana', 'cervo',
                'riccio', 'balena'
            ],

            question_id: response.data.questions[0]._id,
            survey_id: id,
            user_id: 'Enrico'

        };

        const a2 = {

            optionsSelected: [
                'fontana', 'cervo',
                'riccio', 'balena'
            ],

            question_id: response.data.questions[0]._id,
            survey_id: id,
            user_id: 'Simone'

        };

        const insertMany = [a1, a2];

        console.log(insertMany);

        await axios.post('/api/tests/create-answers', insertMany);
        console.log('Test 11 passed');
 
     } catch (e) {
         console.error('Test 11 not passed', e);
     }

}

async function getGID() {

    const groupId = 'gId';
    const userId = 'userTest';

    try {

        await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        console.log('Test 8 passed');

    } catch (e) {

        console.error("Test 8 not passed: error over get", e);

    }

}

async function deleteAll() {

    try {

        await axios.get('/api/tests/delete-all');
        console.log('Restore completed');

    } catch (e) {

        console.error('Restore not completed', e);

    }

}

async function showSurveys() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

       let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
       const id = response.data[0].id;
       response = await axios.get(`/api/tests/show-survey-by-id/${id}`);

       console.log('Test 9 passed');

    } catch (e) {
        console.error('Test 9 not passed', e);
    }

}

async function showSurveysForUser() {

    const userId = 'userTest';

    try {

        const response = await axios.get(`/api/tests/show-surveys-by-user-id/${userId}`);
        console.log('Test 10 passed', response.data);

    } catch (e) {

        console.error('Test 10 not passed', e);

    }

}

async function deleteSurvey() {

    const groupId = 'gId';
    const userId = 'simone';

    try {

        let response = await axios.get(`/api/tests/show-surveys/${groupId}/${userId}`);
        const id = response.data[0].id;
        response = await axios.delete('/api/tests/delete-survey', {data: {surveyId: id} });
        console.log('Test 12 passed');

    } catch (e) {

        console.error('Test 12 not passed', e);

    }

}

async function store() {

    let surveyObj = {

        status: true,
        title: 'Un sondaggio di prova',
        user_id: 'John Benson',
        email: 'email#stud.unive.it',
        group_id: 'gId',

        questions: [{

            title: 'Domanda di prova 1',
            typeOfQuestion: 'radio',

            questionOptions: [
                'pallone', 'bici',
                'racchetta', 'spada'
            ]

        }, {

            title: 'Domanda di prova 2',
            typeOfQuestion: 'checkBox',

            questionOptions: [
                'Enrico', 'Simone',
                'Marika', 'Alessandro'
            ]

        }]

    }

    try {

        let response = await axios.post('/api/tests/store', {survey: surveyObj});
        console.log('Test 13 passed', response.data);

    } catch (e) {

        console.error('Test 13 not passed');

    }

}

async function handleTest() {

    try {
  
        await test1();
        await test2();
        await test3();
        await test4();
        await test5();
        await test6();

        await createSurveysForTesting();
        await getGID();
        await showSurveys();
        await showSurveysForUser();
        await createAnswersForTesting()
        await deleteSurvey()
        await store();

        await deleteAll();

    } catch (e) { console.error(e); }

}

export default handleTest;