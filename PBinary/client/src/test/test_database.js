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

        const responseTestOne = await sendTo('/api/tests/survey', survey);
        console.log('Test 1 passed', responseTestOne.data);

    } catch (err) { console.error('Test 1 not passed', err); }

}

async function test2() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        const responseTestTwo = await sendTo('/api/tests/deleteSurvey', survey);
        console.log('Test 2 passed', responseTestTwo.data);

    } catch (err) { console.error('Test 2 not passed', err); }

}

async function test3() {

    const survey = createSurvey(true, 'TITLE', 'USER_ID', 'EMAIL', 'GROUP_ID'); 

    try {

        await sendTo('/api/tests/survey', survey);
        let surveyInserted = await sendTo('api/tests/getSurvey', {group_id: survey.group_id});
        surveyInserted = surveyInserted.data;

        const responseTestThree = await sendTo('api/tests/insertDeleteSurveyAndAnswer', {
            data: [{
            optionsSelected: ['op1'],
            question_id: surveyInserted.questions[0]._id,
            survey_id: surveyInserted._id,
            user_id: 'ZioTreno'}]
        })

        console.log('Test 3 passed', responseTestThree.data);

    } catch (err) { console.error('Test 3 not passed', err); }

}

async function test4() {

    const activity_id = 'activity_id';
    const user_id = 'user_id';
    const user_email = 'user_email';
    const evaluation = 5;

    const review = createReview(activity_id, user_id, user_email, evaluation);

    try {

        const responseTestFour = await sendTo('api/tests/insertReview', review);
        console.log('Test 4 passed', responseTestFour.data);

    } catch (e) { console.error('Test 4 not passed', e); }
    
}

async function test5() {

    try {
        let res = await axios.delete('api/tests/deleteTrial', {data: {s: 'Stringa_di_dati'} });
        res = res.data;
        console.log('Test 5 passed', res);
    } catch (e) { console.error('Test 5 not passed', e); }

}

async function test6() {

    try {
        let res = await axios.get('api/tests/getTrial', {params: {answer: [42, 67]} });
        res = res.data;
        console.log('Test 6 passed', res);
    } catch (e) { console.error('Test 6 not passed', e); }



}

async function handleTest() {
  
    await test1();
    await test2();
    await test3();
    await test4();
    await test5();
    await test6();

}

export default handleTest;